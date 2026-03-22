'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Sparkles, AlertCircle, Loader2, ArrowLeft, MoreVertical, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ChatMessage, type Message, type ImageAttachment } from '@/components/chat/chat-message';
import { ChatInput } from '@/components/chat/chat-input';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { useAuth } from '@/components/auth-provider';
import { AuthOverlay } from '@/components/auth-overlay';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';
import { toast } from 'sonner';

// Helper function to resize image and convert to base64
const resizeImageAndBase64 = (blobUrl: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = blobUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = (err) => {
            console.error('Image Load Error:', err);
            reject(err);
        };
    });
};

export default function ChatPage() {
    const { user: authUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Initial data from detection page
    const item = location.state?.data;

    const [chatId, setChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [pendingImages, setPendingImages] = useState<ImageAttachment[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const scrollEndRef = useRef<HTMLDivElement>(null);
    const hasInitializedRef = useRef(false);

    const scrollToBottom = useCallback(() => {
        if (scrollEndRef.current) {
            scrollEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    // Initialize chat session
    useEffect(() => {
        const initializeChat = async () => {
            // If we have a chatId from location state (loading history)
            const stateChatId = location.state?.chatId;

            // If no data from detection page and no state chatId, we can't start
            if (!item && !stateChatId) {
                setIsInitializing(false);
                return;
            }

            // Prevent multiple initializations
            if (hasInitializedRef.current || !authUser) return;
            hasInitializedRef.current = true;
            setIsInitializing(true);

            try {
                let currentChatId = stateChatId;

                // If we don't have a chatId, it means we are creating a new chat from detection data
                if (!currentChatId && item) {
                    // 1. Prepare UI with the initial user message immediately
                    const initialUserMsg: Message = {
                        id: `temp-user-${Date.now()}`,
                        role: 'user',
                        content: item.teks || 'Tolong analisa kulit saya',
                        timestamp: new Date().toISOString(),
                        images: item.gambar?.map((g: any, i: number) => ({
                            id: `img-${i}`,
                            url: g.preview || g,
                            name: `image-${i}.jpg`,
                        })),
                    };

                    setMessages([initialUserMsg]);
                    setIsTyping(true);

                    // 2. Convert first image to base64 if it exists for the API
                    let initialImageBase64 = null;
                    const firstImg = item.gambar?.[0]?.preview || item.gambar?.[0];
                    if (firstImg && typeof firstImg === 'string' && firstImg.startsWith('blob:')) {
                        try {
                            initialImageBase64 = await resizeImageAndBase64(firstImg);
                        } catch (e) {
                            console.error('Failed to resize initial image', e);
                        }
                    }

                    // 3. Call API to create chat session
                    const response = await api.post('/api/chats', {
                        message: item.teks || 'Tolong analisa kulit saya',
                        image: initialImageBase64,
                    });

                    currentChatId = response.data.chatId;
                }

                if (currentChatId) {
                    setChatId(currentChatId);
                    // 4. Fetch the full history from server to ensure consistency
                    const historyRes = await api.get(`/api/chats/${currentChatId}`);
                    const formattedHistory: Message[] = historyRes.data.messages.map((m: any) => ({
                        id: m.id,
                        role: m.role === 'model' ? 'ai' : 'user',
                        content: m.content,
                        timestamp: m.createdAt,
                        images: m.image ? [{ id: `img-${m.id}`, url: m.image, name: 'analysis-image.jpg' }] : undefined,
                    }));

                    setMessages(formattedHistory);
                }
            } catch (error: any) {
                toast.error('Gagal memulai sesi konsultasi');
                console.error('Initialization Error:', error);
            } finally {
                setIsTyping(false);
                setIsInitializing(false);
            }
        };

        if (authUser) {
            initializeChat();
        }
    }, [item, authUser]);

    const handleAddImages = useCallback((images: ImageAttachment[]) => {
        setPendingImages((prev) => [...prev, ...images]);
    }, []);

    const handleRemoveImage = useCallback((id: string) => {
        setPendingImages((prev) => prev.filter((img) => img.id !== id));
    }, []);

    const handleSend = useCallback(async () => {
        if (!input.trim() && pendingImages.length === 0) return;
        if (!chatId) {
            toast.error('Sesi chat belum siap');
            return;
        }

        const currentInput = input;
        const currentImages = [...pendingImages];

        // Optimistic UI Update
        const tempId = `user-${Date.now()}`;
        const userMsg: Message = {
            id: tempId,
            role: 'user',
            content: currentInput.trim(),
            timestamp: new Date().toISOString(),
            images: currentImages.length > 0 ? [...currentImages] : undefined,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setPendingImages([]);
        setIsTyping(true);

        try {
            // Convert image to base64 if present
            let imageBase64 = null;
            if (currentImages.length > 0) {
                const firstImage = currentImages[0].url;
                if (firstImage.startsWith('blob:')) {
                    imageBase64 = await resizeImageAndBase64(firstImage);
                } else {
                    imageBase64 = firstImage;
                }
            }

            // Send to Gemini via backend
            const response = await api.post(`/api/chats/${chatId}/continue`, {
                message: currentInput,
                image: imageBase64,
            });

            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                role: 'ai',
                content: response.data.content,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (error: any) {
            toast.error('Gagal mengirim pesan');
            console.error('Send Error:', error);
        } finally {
            setIsTyping(false);
        }
    }, [input, pendingImages, chatId]);

    if (!item && !chatId && !isInitializing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background/50">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card p-10 rounded-3xl border shadow-xl flex flex-col items-center max-w-md text-center">
                    <div className="size-20 bg-muted flex items-center justify-center rounded-full mb-6">
                        <AlertCircle className="size-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Sesi Tidak Ditemukan</h2>
                    <p className="text-muted-foreground mb-8">Silakan lakukan deteksi kulit terlebih dahulu untuk memulai sesi konsultasi dengan AI.</p>
                    <Button onClick={() => navigate('/deteksi')} className="w-full rounded-full h-12 font-bold text-base shadow-lg shadow-primary/20">
                        Kembali ke Deteksi
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col h-screen bg-muted/20 overflow-hidden">
            {!authUser && <AuthOverlay />}

            {/* Sticky Header */}
            <header className="fixed top-0 left-0 right-0 z-40 h-16 md:h-20 bg-background/80 backdrop-blur-xl border-b flex items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-3 md:gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/deteksi')} className="rounded-full hover:bg-muted">
                        <ArrowLeft className="size-5" />
                    </Button>
                    <Separator orientation="vertical" className="h-6 hidden md:block" />
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                            <Sparkles className="size-5 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-bold text-sm md:text-base tracking-tight">SkinSight AI</h1>
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] h-5 px-1.5 font-bold uppercase tracking-wider">
                                    Online
                                </Badge>
                            </div>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-medium">Asisten Analisis Dermatologi</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border-muted-foreground/20 text-muted-foreground bg-background">
                        <ShieldCheck className="size-3 text-emerald-500" />
                        <span className="text-[10px] font-bold">Encrypted</span>
                    </Badge>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="size-5 text-muted-foreground" />
                    </Button>
                </div>
            </header>

            {/* Messages Scroll Area */}
            <main className="flex-1 overflow-y-auto pt-20 pb-4 custom-scrollbar">
                <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
                    {/* Welcome Banner */}
                    {!isInitializing && messages.length <= 2 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-3xl p-6 md:p-8 my-10 text-center shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sparkles className="size-24 rotate-12" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">Selamat Datang di Sesi Konsultasi</h2>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">AI kami telah menerima data Anda dan siap membantu menganalisis kondisi kulit berdasarkan visual dan gejala yang Anda deskripsikan.</p>
                        </motion.div>
                    )}

                    {/* Messages list */}
                    <div className="flex flex-col gap-8 py-6 prose-none">
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg, index) => {
                                const currentDate = new Date(msg.timestamp);
                                const prevDate = index > 0 ? new Date(messages[index - 1].timestamp) : null;
                                const showDateSeparator = !prevDate || currentDate.toDateString() !== prevDate.toDateString();

                                // Format full timestamp for individual message
                                const formattedTime = currentDate.toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });

                                return (
                                    <React.Fragment key={msg.id}>
                                        {showDateSeparator && (
                                            <div className="flex items-center justify-center my-8">
                                                <div className="h-px bg-border flex-1" />
                                                <span className="px-4 py-1 mx-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-background border rounded-full shadow-sm">
                                                    {currentDate.toLocaleDateString('id-ID', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                <div className="h-px bg-border flex-1" />
                                            </div>
                                        )}
                                        <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }}>
                                            <ChatMessage
                                                message={{
                                                    ...msg,
                                                    timestamp: formattedTime,
                                                }}
                                            />
                                        </motion.div>
                                    </React.Fragment>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {isTyping && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 pl-2">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Sparkles className="size-4 text-primary animate-pulse" />
                            </div>
                            <TypingIndicator />
                        </motion.div>
                    )}

                    <div ref={scrollEndRef} className="h-32" />
                </div>
            </main>

            {/* Floating Footer Input */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
                <div className="mx-auto max-w-3xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-3xl shadow-2xl p-2 md:p-3 relative ring-1 ring-black/[0.05]">
                        <ChatInput input={input} onInputChange={setInput} onSend={handleSend} pendingImages={pendingImages} onAddImages={handleAddImages} onRemoveImage={handleRemoveImage} isTyping={isTyping} disabled={isInitializing} />
                    </motion.div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-40">Powered by Gemini Flash Lite</p>
                        <Separator orientation="vertical" className="h-3 opacity-20" />
                        <p className="text-[10px] text-muted-foreground/60 font-medium">Bukan merupakan saran medis profesional.</p>
                    </div>
                </div>
            </div>

            {/* Full Screen Loading for Initial Call */}
            <AnimatePresence>
                {isInitializing && messages.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl">
                        <div className="flex flex-col items-center gap-6 p-8 bg-card border rounded-3xl shadow-2xl text-center">
                            <div className="relative">
                                <Loader2 className="size-12 text-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="size-5 text-primary/50" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold tracking-tight">Menganalisis Kondisi Kulit</h3>
                                <p className="text-sm text-muted-foreground max-w-[240px]">Asisten AI kami sedang memproses data dan gambar Anda...</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
