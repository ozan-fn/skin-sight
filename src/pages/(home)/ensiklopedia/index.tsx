import { useState, useEffect } from "react";
import { Search, Activity, Pill, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

interface ContentItem {
    id: string;
    name: string;
    slug: string;
    content: string;
    image?: string;
    category?: string;
}

export default function Ensiklopedia() {
    const [activeTab, setActiveTab] = useState<"penyakit" | "obat">("penyakit");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ContentItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const endpoint = activeTab === "penyakit" ? "/api/diseases" : "/api/drugs";
                const response = await api.get(endpoint);
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const filteredData = data.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.content.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4">
                <header className="mb-12 text-center">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Ensiklopedia Kesehatan
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Informasi lengkap mengenai penyakit dan obat-obatan dalam genggaman Anda.
                    </motion.p>
                </header>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    {/* Tabs */}
                    <div className="flex p-1 bg-accent/50 rounded-xl border border-border w-full md:w-auto">
                        <button onClick={() => setActiveTab("penyakit")} className={cn("flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2", activeTab === "penyakit" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent text-muted-foreground")}>
                            <Activity className="w-4 h-4" />
                            Penyakit
                        </button>
                        <button onClick={() => setActiveTab("obat")} className={cn("flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2", activeTab === "obat" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent text-muted-foreground")}>
                            <Pill className="w-4 h-4" />
                            Obat
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder={`Cari ${activeTab === "penyakit" ? "penyakit" : "obat"}...`} className="pl-10 h-11 rounded-xl bg-background" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                <div className="min-h-[400px] relative">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </motion.div>
                        ) : (
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <Link key={item.id} to={`/ensiklopedia/${activeTab}/${item.slug}`} className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                                            {/* Image Section */}
                                            <div className="relative aspect-16/10 overflow-hidden bg-accent/30">
                                                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-primary/20">{activeTab === "penyakit" ? <Activity className="w-16 h-16" /> : <Pill className="w-16 h-16" />}</div>}
                                                <div className="absolute top-4 left-4">
                                                    <div className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold uppercase tracking-wider text-primary">{activeTab === "penyakit" ? "Penyakit" : "Obat"}</div>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-6 flex flex-col flex-1">
                                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                                                <div className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: item.content }} />
                                                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                                    <span className="text-sm font-semibold text-primary inline-flex items-center gap-1">
                                                        Baca Selengkapnya
                                                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                                        <div className="inline-flex p-4 rounded-full bg-accent mb-4 text-muted-foreground">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-semibold">Tidak ditemukan</h3>
                                        <p className="text-muted-foreground">Mungkin kata kunci pencarian Anda kurang tepat.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
