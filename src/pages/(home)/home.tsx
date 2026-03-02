import { NavbarButton } from "@/components/ui/resizable-navbar";
import { ArrowRight, Activity, ShieldCheck, HeartPulse } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col justify-center -mt-[54px]">
            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 ">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Hero Content */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1, delayChildren: 0.3 }} className="space-y-8 text-left">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Kesehatan Generasi Berikutnya</span>
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                            Kelola Kesehatan <br />
                            <span className="text-primary italic">Lebih Cerdas.</span>
                        </motion.h1>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                            Platform terintegrasi untuk mendeteksi dini risiko kesehatan dan membantu Anda menjaga gaya hidup sehat melalui teknologi kecerdasan buatan.
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <NavbarButton variant="primary" className="h-12 px-8 flex items-center gap-2 group">
                                Mulai Deteksi Sekarang
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </NavbarButton>
                            <NavbarButton variant="outline" className="h-12 px-8">
                                Pelajari Lebih Lanjut
                            </NavbarButton>
                        </motion.div>

                        {/* Stats/Proof */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="flex gap-8 pt-8 border-t border-border">
                            <div>
                                <p className="text-2xl font-bold text-foreground">10k+</p>
                                <p className="text-sm text-muted-foreground">Pengguna Aktif</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">99%</p>
                                <p className="text-sm text-muted-foreground">Akurasi AI</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">24/7</p>
                                <p className="text-sm text-muted-foreground">Dukungan Medis</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Visual Section */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }} className="relative hidden lg:block">
                        <div className="relative z-10 rounded-2xl border border-border bg-card/50 backdrop-blur shadow-2xl overflow-hidden aspect-square flex items-center justify-center p-8">
                            <div className="absolute inset-0 bg-primary/5 opacity-50"></div>
                            {/* Medical Dashboard Mockup (Simple representation) */}
                            <div className="w-full h-full border border-border rounded-xl bg-background shadow-inner flex flex-col p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <HeartPulse className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="h-4 w-24 bg-muted rounded"></div>
                                    </div>
                                    <div className="h-4 w-4 bg-muted rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 flex-1">
                                    <div className="bg-accent/30 rounded-lg p-3 flex flex-col justify-end">
                                        <div className="h-8 w-8 bg-primary/20 rounded-md mb-2"></div>
                                        <div className="h-2 w-16 bg-muted rounded mb-1"></div>
                                        <div className="h-3 w-10 bg-primary/40 rounded"></div>
                                    </div>
                                    <div className="bg-accent/30 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-4">
                                            <Activity className="w-4 h-4 text-green-500" />
                                            <div className="h-2 w-8 bg-muted rounded"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-1.5 w-full bg-muted rounded"></div>
                                            <div className="h-1.5 w-[80%] bg-muted rounded"></div>
                                            <div className="h-1.5 w-[90%] bg-muted rounded"></div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 bg-accent/30 rounded-lg p-3 relative">
                                        <div className="flex items-center justify-between">
                                            <div className="h-3 w-20 bg-muted rounded"></div>
                                            <div className="h-2 w-12 bg-primary/30 rounded"></div>
                                        </div>
                                        <div className="mt-4 flex items-end gap-1 h-12">
                                            {[30, 60, 45, 75, 50, 90, 65, 80].map((h, i) => (
                                                <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-primary/20 rounded-t-sm"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative floating elements */}
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-6 -right-6 w-12 h-12 bg-primary rounded-xl shadow-lg flex items-center justify-center">
                            <Activity className="text-primary-foreground w-6 h-6" />
                        </motion.div>
                        <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent border border-border rounded-2xl shadow-xl p-4 flex flex-col justify-between">
                            <div className="w-8 h-2 bg-primary/40 rounded"></div>
                            <div className="h-8 w-1 flex items-end">
                                <motion.div animate={{ height: ["20%", "80%", "40%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-full bg-primary/60 rounded" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
