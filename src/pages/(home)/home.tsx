import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, ScanSearch, Sparkles, Microscope, CheckCircle2, Zap, Shield, MessageSquare, Smartphone, Lock, Stethoscope, ChevronRight, Instagram, Twitter, Facebook, Mail, ArrowUpRight, Star, Heart, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function Home() {
    const navigate = useNavigate();

    const stats = [
        { label: 'Akurasi AI', value: '98.5%', description: 'Teruji secara klinis' },
        { label: 'Waktu Analisis', value: '1.2s', description: 'Hasil instan & real-time' },
        { label: 'Penyakit Tercover', value: '50+', description: 'Kondisi kulit umum' },
        { label: 'Pengguna Aktif', value: '10k+', description: 'Komunitas terpercaya' },
    ];

    const steps = [
        {
            number: '01',
            title: 'Ambil Foto',
            desc: 'Potret area kulit yang bermasalah dengan cahaya yang cukup.',
            icon: <Smartphone className="size-6" />,
        },
        {
            number: '02',
            title: 'AI Menganalisis',
            desc: 'Sistem kami memproses gambar menggunakan model deep learning.',
            icon: <ScanSearch className="size-6" />,
        },
        {
            number: '03',
            title: 'Dapatkan Hasil',
            desc: 'Terima laporan awal dan saran langkah penanganan selanjutnya.',
            icon: <CheckCircle2 className="size-6" />,
        },
    ];

    return (
        <div className="flex flex-col w-full overflow-x-hidden bg-background">
            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-32 pb-20 overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
                <div className="absolute top-1/4 left-1/4 size-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />

                <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8 text-left order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
                            <Sparkles className="size-4 animate-spin-slow" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Next Generation Skin Analysis</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
                            Cek Kulit <br />
                            <span className="text-primary inline-block transform -skew-x-6 italic">Cuma Sedetik.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
                            SkinSight menggunakan teknologi <span className="text-foreground font-bold underline decoration-primary/30">Computer Vision</span> tercanggih untuk membantu Anda mendeteksi 50+ jenis penyakit kulit secara instan dan privat.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 pt-4">
                            <Button size="lg" onClick={() => navigate('/deteksi')} className="h-16 px-10 rounded-[20px] text-lg font-black shadow-[0_20px_40px_-10px_rgba(var(--primary),0.3)] hover:scale-105 active:scale-95 transition-all gap-3 bg-primary group">
                                Mulai Analisis Gratis
                                <ArrowRight className="size-6 group-hover:translate-x-2 transition-transform" />
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => navigate('/ensiklopedia')} className="h-16 px-10 rounded-[20px] text-lg font-black border-2 hover:bg-muted active:scale-95 transition-all gap-2">
                                <BookOpenIcon className="size-5" />
                                Ensiklopedia
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 pt-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="size-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm font-medium">
                                <span className="text-primary font-bold">10,000+</span> pengguna telah mempercayai kami
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Visual Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative order-1 md:order-2">
                        <div className="relative z-10 rounded-[40px] md:rounded-[60px] border-4 md:border-8 border-white dark:border-zinc-900 bg-card shadow-[0_60px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden aspect-[4/5] p-2">
                            <div className="w-full h-full bg-zinc-50 dark:bg-zinc-950 rounded-[32px] md:rounded-[48px] overflow-hidden flex flex-col relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

                                {/* Header Mockup */}
                                <div className="p-6 flex items-center justify-between border-b bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                                            <ScanSearch className="size-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-3 w-24 bg-foreground/10 rounded-full" />
                                            <div className="h-2 w-16 bg-foreground/5 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                                        <div className="size-2 bg-emerald-500 rounded-full animate-ping" />
                                    </div>
                                </div>

                                {/* Content Mockup */}
                                <div className="p-8 flex-1 flex flex-col gap-8">
                                    <div className="relative flex-1 rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 flex items-center justify-center overflow-hidden">
                                        <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_30px_2px_rgba(var(--primary),0.8)] z-20" />
                                        <Microscope className="size-32 text-primary/10" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm">
                                                <div className="size-8 rounded-lg bg-primary/10 mb-3" />
                                                <div className="h-2 w-full bg-muted rounded mb-2" />
                                                <div className="h-2 w-1/2 bg-muted rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Tooltips */}
                        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -top-6 -left-6 md:-top-12 md:-left-12 z-20 bg-background/95 border shadow-2xl rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-center gap-4 backdrop-blur-md">
                            <div className="size-10 md:size-14 bg-emerald-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="size-7 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-tighter">Privasi Terjamin</p>
                                <p className="text-xs text-muted-foreground">Enkripsi End-to-End</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="py-20 border-y bg-muted/20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center lg:text-left space-y-2">
                                <p className="text-4xl md:text-5xl font-black tracking-tight text-primary">{stat.value}</p>
                                <p className="text-sm font-bold uppercase tracking-widest text-foreground">{stat.label}</p>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS SECTION --- */}
            <section className="py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="flex-1 space-y-8">
                            <Badge className="bg-primary/10 text-primary border-none font-bold px-4 py-1">Workflow</Badge>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                                Hanya 3 Langkah <br /> Untuk Mengetahui <span className="text-primary italic">Kondisi Anda.</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">Kami menyederhanakan proses analisis medis yang kompleks menjadi pengalaman digital yang mudah bagi siapa saja.</p>

                            <div className="space-y-12 pt-6">
                                {steps.map((step, idx) => (
                                    <motion.div key={idx} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="flex gap-6 items-start">
                                        <div className="text-4xl font-black text-primary/20">{step.number}</div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black flex items-center gap-3">
                                                <span className="p-2 bg-primary/5 rounded-lg text-primary">{step.icon}</span>
                                                {step.title}
                                            </h3>
                                            <p className="text-muted-foreground">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-xl">
                            <div className="relative aspect-square rounded-[60px] bg-primary/5 border-4 border-dashed border-primary/20 flex items-center justify-center group overflow-hidden">
                                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative z-10">
                                    <div className="size-48 bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl flex items-center justify-center p-10 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                                        <Smartphone className="size-full text-primary" />
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 size-48 bg-primary rounded-[40px] shadow-2xl flex items-center justify-center p-10 transform rotate-12 group-hover:rotate-6 transition-transform duration-500">
                                        <Zap className="size-full text-white" />
                                    </div>
                                </motion.div>

                                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CORE FEATURES TABS --- */}
            <section className="py-32 bg-zinc-50 dark:bg-zinc-900/30">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-16">
                    <div className="space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">Eksplorasi Fitur</h2>
                        <p className="text-muted-foreground">Semua yang Anda butuhkan untuk memantau kesehatan kulit dalam satu platform terintegrasi.</p>
                    </div>

                    <Tabs defaultValue="ai" className="w-full">
                        <TabsList className="h-16 bg-background border p-2 rounded-[24px] gap-2 mb-12">
                            <TabsTrigger value="ai" className="rounded-[18px] px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                                AI Detection
                            </TabsTrigger>
                            <TabsTrigger value="chat" className="rounded-[18px] px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                                Smart Chat
                            </TabsTrigger>
                            <TabsTrigger value="wiki" className="rounded-[18px] px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                                Encyclopedia
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-12">
                            <TabsContent value="ai">
                                <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-background">
                                    <div className="grid lg:grid-cols-2 items-center">
                                        <div className="p-12 text-left space-y-6">
                                            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                <ScanSearch className="size-8" />
                                            </div>
                                            <h3 className="text-3xl font-black">AI Diagnosis Support</h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed">Model kami dilatih menggunakan dataset dermatologi terbesar untuk memberikan probabilitas kondisi kulit yang paling akurat.</p>
                                            <ul className="space-y-4 pt-4">
                                                {['Pemindaian Cepat < 2 Detik', 'Akurasi Mendekati Dokter Ahli', 'Privasi Data Foto Terjamin'].map((item) => (
                                                    <li key={item} className="flex items-center gap-3 font-bold">
                                                        <CheckCircle2 className="size-5 text-emerald-500" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="h-[400px] bg-primary/5 relative overflow-hidden group">
                                            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="medical" />
                                            <div className="absolute inset-0 bg-primary/10" />
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>
                            <TabsContent value="chat">
                                <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-background">
                                    <div className="grid lg:grid-cols-2 items-center">
                                        <div className="h-[400px] bg-primary/5 relative overflow-hidden group order-2 lg:order-1">
                                            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="chat" />
                                            <div className="absolute inset-0 bg-primary/10" />
                                        </div>
                                        <div className="p-12 text-left space-y-6 order-1 lg:order-2">
                                            <div className="size-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                <MessageSquare className="size-8" />
                                            </div>
                                            <h3 className="text-3xl font-black">AI Chatbot Consultant</h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed">Tanyakan apapun mengenai kondisi kulit Anda. AI kami dapat membantu menjelaskan istilah medis yang rumit.</p>
                                            <Button onClick={() => navigate('/deteksi')} className="rounded-2xl h-14 px-8 font-bold gap-2">
                                                Coba Chat Sekarang
                                                <ArrowUpRight className="size-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>
                            <TabsContent value="wiki">
                                <div className="grid md:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i} className="p-8 rounded-[32px] border-none shadow-xl hover:-translate-y-2 transition-transform cursor-pointer">
                                            <div className="size-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6">
                                                <BookOpenIcon className="size-6" />
                                            </div>
                                            <h4 className="text-xl font-black mb-4">Psoriasis Vulgaris</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">Penjelasan mendalam mengenai gejala, penyebab, dan penanganan medis untuk kondisi psoriasis.</p>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </section>

            {/* --- CALL TO ACTION --- */}
            <section className="py-32 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto rounded-[60px] bg-zinc-950 p-12 md:p-24 flex flex-col items-center text-center space-y-10 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 size-96 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 size-96 bg-primary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="space-y-6 relative z-10">
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
                            Sayangi Kulit Anda, <br /> Mulai <span className="text-primary italic underline underline-offset-8 decoration-white/20">Cek Hari Ini.</span>
                        </h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">Jangan biarkan gejala kecil menjadi masalah besar. Gunakan SkinSight AI untuk pemantauan kesehatan kulit yang lebih baik.</p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full justify-center">
                        <Button onClick={() => navigate('/deteksi')} className="h-20 px-12 rounded-[24px] bg-primary text-white text-xl font-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_-10px_rgba(var(--primary),0.5)]">
                            Mulai Deteksi Sekarang
                        </Button>
                        <Button variant="outline" className="h-20 px-12 rounded-[24px] border-zinc-800 text-white text-xl font-black hover:bg-zinc-900 transition-all">
                            Gabung Komunitas
                        </Button>
                    </div>

                    <div className="flex items-center gap-8 pt-10 text-zinc-500 relative z-10 grayscale opacity-50">
                        <div className="flex items-center gap-2">
                            <Lock className="size-5" /> <span>Secure</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-5" /> <span>Private</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="size-5" /> <span>Verified</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-32 border-t bg-muted/10">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-20 space-y-4">
                        <Badge variant="outline" className="px-4 py-1 rounded-full text-primary border-primary/20 uppercase font-black text-[10px] tracking-widest">
                            Support
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight">Butuh Jawaban?</h2>
                        <p className="text-muted-foreground text-lg">Berikut adalah beberapa pertanyaan yang paling sering diajukan penderita.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-6">
                        {[
                            {
                                q: 'Apakah hasil SkinSight 100% akurat?',
                                a: 'Meskipun AI kami memiliki tingkat akurasi 98.5% dalam pengujian klinis, hasilnya bukan merupakan diagnosis medis final. Gunakan sebagai alat bantu analisis awal dan selalu konsultasikan dengan dokter spesialis kulit (Sp.KK/Sp.DVE).',
                            },
                            {
                                q: 'Bagaimana cara mengambil foto yang benar?',
                                a: 'Gunakan cahaya alami yang cukup terang, pastikan kamera fokus pada area yang bermasalah, dan ambil foto dari jarak sekitar 10-15cm tanpa menggunakan flash jika memungkinkan.',
                            },
                            {
                                q: 'Apakah data medis saya disebarluaskan?',
                                a: 'Tidak. Kami sangat menjunjung tinggi privasi medis. Semua data dan foto yang Anda unggah dienkripsi dan hanya dapat diakses oleh Anda untuk riwayat konsultasi pribadi.',
                            },
                            {
                                q: 'Apakah aplikasi ini gratis?',
                                a: 'Kami menyediakan jatah deteksi gratis setiap harinya untuk semua pengguna. Untuk penggunaan tanpa batas dan fitur eksklusif, kami menyediakan paket berlangganan premium.',
                            },
                        ].map((faq, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="border-2 rounded-[24px] px-8 bg-background shadow-sm hover:border-primary/30 transition-colors">
                                <AccordionTrigger className="hover:no-underline font-black text-xl text-left py-8">{faq.q}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-8 text-lg">{faq.a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* --- FOOTER SECTION --- */}
            <footer className="bg-zinc-950 text-zinc-400 pt-32 pb-16 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="size-12 bg-primary rounded-[14px] flex items-center justify-center shadow-xl shadow-primary/20 rotate-3">
                                    <Sparkles className="text-white size-7" />
                                </div>
                                <span className="font-black text-3xl tracking-tighter text-white">
                                    SkinSight<span className="text-primary">.</span>
                                </span>
                            </div>
                            <p className="text-lg leading-relaxed font-medium">Melindungi masa depan kesehatan kulit Anda melalui inovasi Kecerdasan Buatan tercanggih.</p>
                            <div className="flex gap-4">
                                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                    <Button key={i} variant="ghost" size="icon" className="size-12 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-primary hover:text-white transition-all">
                                        <Icon className="size-6" />
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h4 className="font-black text-sm uppercase tracking-[0.2em] text-white">Layanan</h4>
                            <ul className="space-y-4 font-bold">
                                {['Analisis AI', 'Ensiklopedia Kulit', 'Chatbot Medis', 'Dashboard Kesehatan'].map((item) => (
                                    <li key={item} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group">
                                        <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="font-black text-sm uppercase tracking-[0.2em] text-white">Perusahaan</h4>
                            <ul className="space-y-4 font-bold">
                                {['Tentang Kami', 'Kebijakan Privasi', 'Disclaimer Medis', 'Karir'].map((item) => (
                                    <li key={item} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group">
                                        <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="font-black text-sm uppercase tracking-[0.2em] text-white">Bantuan</h4>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-zinc-900 flex items-center justify-center text-primary">
                                        <Mail className="size-5" />
                                    </div>
                                    <span className="font-bold">support@skinsight.ai</span>
                                </div>
                                <div className="p-6 rounded-[24px] bg-zinc-900 border border-zinc-800">
                                    <p className="text-xs font-black uppercase text-zinc-500 mb-2 tracking-widest">Status Sistem</p>
                                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                                        <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                                        All Systems Operational
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="space-y-2">
                            <p className="text-sm font-bold">© {new Date().getFullYear()} SkinSight Global Inc.</p>
                            <p className="text-xs text-zinc-600 max-w-md italic">Aplikasi ini hanya untuk tujuan edukasi. Konsultasikan dengan dokter profesional untuk diagnosis medis.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <Heart className="size-6 text-primary animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest">Dibuat di Indonesia</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function BookOpenIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}
