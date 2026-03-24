import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { InputGroupCustom } from '@/components/custom-input';
import { DetectionTemplates, UploadCard } from '@/components/detection-templates';
import { useAuth } from '@/components/auth-provider';
import { AuthOverlay } from '@/components/auth-overlay';
import { Sparkles, MessageSquare, ChevronRight, History, Trash2, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ChatHistory {
    id: string;
    title: string;
    createdAt: string;
}

export default function Deteksi() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [history, setHistory] = useState<ChatHistory[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const triggerFileUploadRef = useRef<() => void>(null);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/api/chats');
            setHistory(response.data);
        } catch (error) {
            console.error('Gagal mengambil riwayat chat:', error);
        }
    };

    const handleDeleteChat = async (chatId: string) => {
        setIsDeleting(true);
        try {
            await api.delete(`/api/chats/${chatId}`);
            setHistory(history.filter((chat) => chat.id !== chatId));
            toast.success('Riwayat berhasil dihapus');
            setDeleteId(null);
        } catch (error) {
            console.error('Gagal menghapus riwayat:', error);
            toast.error('Gagal menghapus riwayat');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleKirimKeAI = async (files?: (File | string)[], textOverride?: string) => {
        const finalMessage = textOverride || description;

        if (!files?.length && !finalMessage.trim()) {
            return;
        }

        // Convert files to the format expected by the chat page (preview URLs)
        const gambar = await Promise.all(
            (files || []).map(async (item) => {
                if (typeof item === 'string') {
                    // Handle image path/URL
                    const response = await fetch(item);
                    const blob = await response.blob();
                    const file = new File([blob], 'example.jpg', { type: 'image/jpeg' });
                    return {
                        preview: item,
                        file: file,
                    };
                }
                // Handle File object
                return {
                    preview: URL.createObjectURL(item),
                    file: item,
                };
            }),
        );

        const dataSiapKirim = {
            teks: finalMessage,
            gambar: gambar,
            waktu: new Date().toLocaleString('id-ID'),
        };

        navigate('/deteksi-chat', { state: { data: dataSiapKirim } });
    };

    return (
        <div className="flex-1 w-full bg-background  flex flex-col ">
            <main className="flex-1 flex flex-col items-center p-4 md:p-8 max-w-5xl mx-auto w-full">
                {/* Header - Compact */}
                <header className="mb-6 md:mb-8 text-center space-y-2 shrink-0">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="size-3.5" />
                        <span>Analisis Kulit AI</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground scroll-m-20">
                        Mulai Deteksi <span className="text-primary italic">Kulit Anda</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto hidden sm:block leading-7">
                        Unggah foto atau deskripsikan gejala untuk analisis awal teknologi AI kami.
                    </motion.p>
                </header>

                {/* Main Card - Contained height */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative w-full flex flex-col gap-6 md:gap-8 p-4 md:p-8 bg-card border shadow-2xl rounded-2xl md:rounded-3xl">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Left Side: Upload Card */}
                        <div className="w-full lg:w-1/2 flex flex-col">
                            <UploadCard onUploadClick={() => triggerFileUploadRef.current?.()} />
                        </div>

                        {/* Right Side: Templates */}
                        <div className="w-full lg:w-1/2 flex flex-col justify-center">
                            <DetectionTemplates
                                onSelect={(desc, img) => {
                                    setDescription(desc);
                                    handleKirimKeAI(img ? [img] : [], desc);
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Chat History Horizontal List */}
                        {user && history.length > 0 && (
                            <div className="w-full space-y-2 shrink-0 border-t pt-6">
                                <div className="flex items-center gap-2 px-1 text-muted-foreground">
                                    <History className="size-3.5" />
                                    <span className="text-xs font-semibold uppercase tracking-widest">Lanjutkan Konsultasi</span>
                                </div>
                                <ScrollArea className="w-full whitespace-nowrap -mx-2 px-2">
                                    <div className="flex w-max space-x-5 pb-0 pt-4 px-4">
                                        {history.map((chat) => (
                                            <div key={chat.id} className="relative group shrink-0">
                                                <button onClick={() => navigate('/deteksi-chat', { state: { chatId: chat.id } })} className="flex flex-col w-40 md:w-44 p-3 rounded-xl border bg-muted/10 hover:bg-muted hover:border-primary/30 transition-all text-left group">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="size-5 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                                            <MessageSquare className="size-2.5" />
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground font-semibold truncate flex-1 uppercase tracking-tight">{new Date(chat.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                        <ChevronRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <p className="text-xs font-semibold truncate text-foreground group-hover:text-primary transition-colors">{chat.title || 'Konsultasi Baru'}</p>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteId(chat.id);
                                                    }}
                                                    className="absolute -top-3 -right-1.5 size-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all shadow-xl hover:scale-110 active:scale-95 z-30 border-2 border-background"
                                                    title="Hapus Riwayat"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>
                        )}
                    </div>

                    {/* Input Area - Integrated Image Upload inside Card Footer */}
                    <div className="w-full pt-2 shrink-0 border-t bg-card mt-auto">
                        <InputGroupCustom textValue={description} onTextChange={setDescription} onSend={(files) => handleKirimKeAI(files)} triggerFileUpload={triggerFileUploadRef} />
                    </div>

                    {!user && <AuthOverlay />}

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={!!deleteId} onOpenChange={(open) => !open && !isDeleting && setDeleteId(null)}>
                        <DialogContent className="sm:max-w-md rounded-3xl p-8 border shadow-2xl">
                            <DialogHeader className="space-y-4">
                                <div className="size-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto rotate-3">
                                    <AlertTriangle className="size-8" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <DialogTitle className="text-xl font-bold tracking-tight">Hapus Riwayat?</DialogTitle>
                                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                                        Apakah Anda yakin ingin menghapus riwayat konsultasi ini?
                                        <br />
                                        <span className="font-semibold text-destructive/80 italic">Tindakan ini permanen dan akan menghapus semua pesan serta gambar dari sistem.</span>
                                    </DialogDescription>
                                </div>
                            </DialogHeader>
                            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 sm:justify-center">
                                <Button variant="outline" className="flex-1 rounded-2xl h-12 text-sm font-bold order-2 sm:order-1" onClick={() => setDeleteId(null)} disabled={isDeleting}>
                                    Batal
                                </Button>
                                <Button variant="destructive" className="flex-1 rounded-2xl h-12 text-sm font-bold shadow-lg shadow-destructive/20 order-1 sm:order-2" onClick={() => deleteId && handleDeleteChat(deleteId)} disabled={isDeleting}>
                                    {isDeleting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Menghapus...</span>
                                        </div>
                                    ) : (
                                        'Ya, Hapus Permanen'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                {/* Footer - Extra Compact */}
                <footer className="mt-6 text-center text-[11px] md:text-xs text-muted-foreground italic px-4 shrink-0 opacity-80 leading-relaxed max-w-2xl mx-auto">* Peringatan: Hasil analisis AI bukan merupakan diagnosis medis resmi. Konsultasikan dengan dokter spesialis kulit untuk penanganan lebih lanjut.</footer>
            </main>
        </div>
    );
}
