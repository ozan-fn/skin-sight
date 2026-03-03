import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Activity, Pill, ArrowLeft, Clock, Shield, Share2, Loader2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface DetailItem {
    id: string;
    name: string;
    slug: string;
    content: string;
    image?: string;
    updatedAt: string;
    // Relationships if any
    drugDiseases?: any[];
}

export default function DetailPage() {
    const { type, slug } = useParams<{ type: string; slug: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DetailItem | null>(null);

    const isPenyakit = type === "penyakit";

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const endpoint = isPenyakit ? `/api/diseases/${slug}` : `/api/drugs/${slug}`;
                const response = await api.get(endpoint);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching detail:", error);
                // navigate("/ensiklopedia");
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchDetail();
    }, [slug, isPenyakit]);

    if (loading) {
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

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-img:rounded-3xl" dangerouslySetInnerHTML={{ __html: data.content }} />

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
                    <div className="space-y-8">
                        <div className="p-8 rounded-3xl border border-border bg-accent/30 sticky top-24">
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
