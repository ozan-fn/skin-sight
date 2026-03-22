import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { InputGroupCustom } from '@/components/custom-input';
import { useAuth } from '@/components/auth-provider';
import { AuthOverlay } from '@/components/auth-overlay';
import { Sparkles, Activity, Search, ShieldAlert, MessageSquare, ChevronRight, History, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const CHAT_TEMPLATES = [
    {
        icon: <Search className="size-4 text-blue-500" />,
        title: 'Analisa Gejala',
        description: 'Saya memiliki bintik merah gatal di lengan, tolong analisa.',
    },
    {
        icon: <Activity className="size-4 text-emerald-500" />,
        title: 'Identifikasi Ruam',
        description: 'Ada ruam melingkar di punggung saya yang terasa perih.',
    },
    {
        icon: <ShieldAlert className="size-4 text-orange-500" />,
        title: 'Kondisi Kronis',
        description: 'Kulit wajah saya sering mengelupas dan kering di area T.',
    },
];

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

    const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation();
        if (!confirm('Apakah Anda yakin ingin menghapus riwayat konsultasi ini?')) return;

        try {
            await api.delete(`/api/chats/${chatId}`);
            setHistory(history.filter((chat) => chat.id !== chatId));
            toast.success('Riwayat berhasil dihapus');
        } catch (error) {
            console.error('Gagal menghapus riwayat:', error);
            toast.error('Gagal menghapus riwayat');
        }
    };

    const handleKirimKeAI = (files?: File[], textOverride?: string) => {
        const finalMessage = textOverride || description;

        if (!files?.length && !finalMessage.trim()) {
            return;
        }

        // Convert files to the format expected by the chat page (preview URLs)
        const gambar =
            files?.map((file) => ({
                preview: URL.createObjectURL(file),
                file: file,
            })) || [];

        const dataSiapKirim = {
            teks: finalMessage,
            gambar: gambar,
            waktu: new Date().toLocaleString('id-ID'),
        };

        navigate('/deteksi-chat', { state: { data: dataSiapKirim } });
    };

    return (
        <div className="h-[calc(100vh-56px)] w-full bg-background overflow-hidden flex flex-col mt-[56px]">
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-5xl mx-auto w-full min-h-0">
                {/* Header - Compact */}
                <header className="mb-6 md:mb-8 text-center space-y-2 shrink-0">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="size-3 md:size-4" />
                        <span>Analisis Kulit AI</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                        Mulai Deteksi <span className="text-primary italic">Kulit Anda</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-xs md:text-sm max-w-xl mx-auto hidden sm:block">
                        Unggah foto atau deskripsikan gejala untuk analisis awal teknologi AI kami.
                    </motion.p>
                </header>

                {/* Main Card - Contained height */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative w-full flex flex-col gap-4 md:gap-6 p-4 md:p-8 bg-card border shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden min-h-0 max-h-[85%]">
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-6 md:space-y-8">
                        {/* Templates - Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                            {CHAT_TEMPLATES.map((template, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDescription(template.description);
                                        handleKirimKeAI([], template.description);
                                    }}
                                    className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3 md:p-4 text-left border rounded-xl md:rounded-2xl bg-muted/30 hover:bg-muted hover:border-primary/50 transition-all group w-full"
                                >
                                    <div className="p-2 rounded-lg bg-background group-hover:scale-110 transition-transform shrink-0">{template.icon}</div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-xs md:text-sm truncate">{template.title}</p>
                                        <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Chat History Horizontal List */}
                        {user && history.length > 0 && (
                            <div className="w-full space-y-2 shrink-0 border-t pt-4">
                                <div className="flex items-center gap-2 px-1 text-muted-foreground">
                                    <History className="size-3" />
                                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Lanjutkan Konsultasi</span>
                                </div>
                                <ScrollArea className="w-full whitespace-nowrap">
                                    <div className="flex w-max space-x-3 pb-2">
                                        {history.map((chat) => (
                                            <div key={chat.id} className="relative group shrink-0">
                                                <button onClick={() => navigate('/deteksi-chat', { state: { chatId: chat.id } })} className="flex flex-col w-40 md:w-44 p-3 rounded-xl border bg-muted/10 hover:bg-muted hover:border-primary/30 transition-all text-left group">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="size-5 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                                            <MessageSquare className="size-2.5" />
                                                        </div>
                                                        <span className="text-[8px] text-muted-foreground font-bold truncate flex-1 uppercase tracking-tighter">{new Date(chat.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                        <ChevronRight className="size-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <p className="text-[10px] font-bold truncate text-foreground group-hover:text-primary transition-colors">{chat.title || 'Konsultasi Baru'}</p>
                                                </button>
                                                <button onClick={(e) => handleDeleteChat(e, chat.id)} className="absolute -top-1.5 -right-1.5 size-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 active:scale-95 z-10" title="Hapus Riwayat">
                                                    <Trash2 className="size-3" />
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
                    <div className="w-full pt-4 shrink-0 border-t bg-card mt-auto">
                        <InputGroupCustom textValue={description} onTextChange={setDescription} onSend={(files) => handleKirimKeAI(files)} />
                    </div>

                    {!user && <AuthOverlay />}
                </motion.div>

                {/* Footer - Extra Compact */}
                <footer className="mt-4 text-center text-[9px] md:text-[10px] text-muted-foreground italic px-4 shrink-0 opacity-60">* Peringatan: Hasil analisis AI bukan merupakan diagnosis medis resmi. Konsultasikan dengan dokter spesialis kulit.</footer>
            </main>
        </div>
    );
}
