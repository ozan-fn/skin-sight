import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { Activity, Pill, ArrowLeft, Clock, Shield, Share2, Loader2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { useEncyclopediaStore } from "@/stores/encyclopedia-store";

export default function DetailPage() {
    const { type, slug } = useParams<{ type: string; slug: string }>();
    const { details, loading, fetchDetail } = useEncyclopediaStore();

    const isPenyakit = type === "penyakit";
    const data = details[`${type}-${slug}`];

    useEffect(() => {
        if (type && slug) {
            fetchDetail(type, slug);
        }
    }, [type, slug, fetchDetail]);

    if (loading && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
                <h2 className="text-2xl font-bold mb-4">Informasi tidak ditemukan</h2>
                <Link to="/ensiklopedia" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Ensiklopedia
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 pt-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row gap-12 items-start justify-between mb-12">
                    <div className="flex-1 space-y-6">
                        <Link to="/ensiklopedia" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" /> Kembali ke Ensiklopedia
                        </Link>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                                {isPenyakit ? <Activity className="w-3 h-3" /> : <Pill className="w-3 h-3" />}
                                {isPenyakit ? "Informasi Penyakit" : "Informasi Obat"}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">{data.name}</h1>
                            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {new Date(data.updatedAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </div>
                                <div className="flex items-center gap-2 text-green-500 font-medium">
                                    <Shield className="w-4 h-4" />
                                    Terverifikasi Medis
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Smaller Image on Right */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full lg:w-[400px] shrink-0">
                        <div className="relative aspect-square md:aspect-16/10 lg:aspect-square rounded-3xl overflow-hidden border border-border bg-accent/30 shadow-2xl">
                            {data.image ? <img src={data.image} alt={data.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">{isPenyakit ? <Activity className="w-24 h-24 text-primary/10" /> : <Pill className="w-24 h-24 text-primary/10" />}</div>}
                        </div>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-img:rounded-3xl">
                            <ReactMarkdown>{data.content}</ReactMarkdown>
                        </div>

                        {/* Social Share (Mockup) */}
                        <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                            <span className="text-sm font-bold text-muted-foreground">Bagikan informasi ini:</span>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full border border-border hover:bg-accent transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Related (Mockup) */}
                    <div className="space-y-8 sticky top-24">
                        {/* Related Items Section */}
                        {data.drugDiseases && data.drugDiseases.length > 0 && (
                            <div className="p-8 rounded-3xl border border-border bg-card shadow-sm">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    {isPenyakit ? <Pill className="w-5 h-5 text-primary" /> : <Activity className="w-5 h-5 text-primary" />}
                                    {isPenyakit ? "Obat Terkait" : "Penyakit Terkait"}
                                </h3>
                                <div className="space-y-3">
                                    {data.drugDiseases.map((dd: any) => {
                                        const related = isPenyakit ? dd.drug : dd.disease;
                                        const targetType = isPenyakit ? "obat" : "penyakit";
                                        return (
                                            <Link key={related.id} to={`/ensiklopedia/${targetType}/${related.slug}`} className="group flex items-center gap-3 p-3 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm active:scale-95">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-accent/30 shrink-0 border border-border">
                                                    {related.image ? <img src={related.image} alt={related.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-primary/20">{isPenyakit ? <Pill className="w-6 h-6" /> : <Activity className="w-6 h-6" />}</div>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{related.name}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Klik untuk detail</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="p-8 rounded-3xl border border-border bg-accent/30">
                            <h3 className="text-xl font-bold mb-4">Informasi Penting</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">Informasi yang disajikan dalam ensiklopedia ini bersifat edukatif dan tidak menggantikan saran dari profesional medis atau dokter.</p>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors cursor-pointer group">
                                    <p className="text-xs font-bold text-primary uppercase mb-1">Konsultasi</p>
                                    <p className="text-sm font-semibold flex items-center justify-between">
                                        Hubungi Dokter Sekarang
                                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
