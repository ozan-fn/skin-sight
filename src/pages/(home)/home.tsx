import { NavbarButton } from '@/components/ui/resizable-navbar';
import { ArrowRight, ShieldCheck, ScanSearch, Sparkles, Microscope, CheckCircle2, Search, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="relative flex-1 overflow-hidden flex flex-col justify-center -mt-[54px]">
            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Hero Content */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1, delayChildren: 0.3 }} className="space-y-8 text-left">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-bold uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            <span>AI-Powered Dermatology Assistant</span>
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
                            Deteksi Kulit <br />
                            <span className="text-primary italic">Lebih Akurat.</span>
                        </motion.h1>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                            Analisis kondisi kesehatan kulit Anda secara instan menggunakan teknologi AI tercanggih. Unggah foto, dapatkan hasil, dan konsultasikan dengan cerdas.
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="flex flex-col sm:flex-row gap-4 pt-2">
                            <NavbarButton variant="primary" onClick={() => navigate('/deteksi')} className="h-14 px-10 rounded-2xl flex items-center justify-center gap-3 group text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                Mulai Analisis Gratis
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </NavbarButton>
                            <NavbarButton variant="outline" onClick={() => navigate('/docs')} className="h-14 px-10 rounded-2xl text-base font-bold border-2 transition-all hover:bg-muted active:scale-95">
                                Cara Kerja AI
                            </NavbarButton>
                        </motion.div>

                        {/* Stats/Proof */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="flex gap-10 pt-10 border-t border-border">
                            <div className="space-y-1">
                                <p className="text-3xl font-black text-foreground">98.5%</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Akurasi Visual</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-black text-foreground">1.2s</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Waktu Proses</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-black text-foreground">50+</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Jenis Penyakit</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Visual Section - Dermatology Specific */}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }} className="relative hidden lg:block">
                        <div className="relative z-10 rounded-3xl border border-border bg-card/40 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden aspect-[4/5] flex items-center justify-center p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>

                            {/* AI Scanning UI Mockup */}
                            <div className="w-full h-full border border-border/50 rounded-2xl bg-background/80 shadow-inner flex flex-col overflow-hidden relative">
                                {/* Header UI */}
                                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <ScanSearch className="size-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-2 w-20 bg-foreground/10 rounded-full"></div>
                                            <div className="h-1.5 w-12 bg-foreground/5 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="size-6 bg-foreground/5 rounded-full"></div>
                                </div>

                                {/* Main Scan Image Representation */}
                                <div className="flex-1 relative bg-muted/10 p-4 flex flex-col gap-4">
                                    <div className="relative w-full aspect-square rounded-xl bg-muted/20 border-2 border-dashed border-primary/20 overflow-hidden group">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Microscope className="size-16 text-primary/10" />
                                        </div>
                                        {/* Scanner Line Animation */}
                                        <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute left-0 right-0 h-0.5 bg-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.5)] z-20" />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.05)_100%)]"></div>

                                        {/* Focus Corners */}
                                        <div className="absolute top-4 left-4 size-6 border-t-2 border-l-2 border-primary rounded-tl-sm"></div>
                                        <div className="absolute top-4 right-4 size-6 border-t-2 border-r-2 border-primary rounded-tr-sm"></div>
                                        <div className="absolute bottom-4 left-4 size-6 border-b-2 border-l-2 border-primary rounded-bl-sm"></div>
                                        <div className="absolute bottom-4 right-4 size-6 border-b-2 border-r-2 border-primary rounded-br-sm"></div>
                                    </div>

                                    {/* AI Results Cards */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-background border rounded-xl p-3 shadow-sm space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="h-2 w-16 bg-muted rounded-full"></div>
                                                <CheckCircle2 className="size-3 text-emerald-500" />
                                            </div>
                                            <div className="h-3 w-24 bg-primary/10 rounded-full"></div>
                                        </div>
                                        <div className="bg-background border rounded-xl p-3 shadow-sm space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="h-2 w-12 bg-muted rounded-full"></div>
                                                <Zap className="size-3 text-orange-500" />
                                            </div>
                                            <div className="h-3 w-16 bg-primary/10 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Footer */}
                                <div className="p-4 bg-muted/20 border-t flex items-center justify-center">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Analisis Selesai - Akurasi Tinggi</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Feature Tags */}
                        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-8 right-12 z-20 bg-background border shadow-xl rounded-2xl p-4 flex items-center gap-3">
                            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Search className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-foreground">Deteksi Instan</p>
                                <p className="text-[10px] text-muted-foreground">Analisis Visual AI</p>
                            </div>
                        </motion.div>

                        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-4 -left-12 z-20 bg-background border shadow-xl rounded-2xl p-4 flex items-center gap-3">
                            <div className="size-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="size-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-foreground">Aman & Privat</p>
                                <p className="text-[10px] text-muted-foreground">Enkripsi Data Medis</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
