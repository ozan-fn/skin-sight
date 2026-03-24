import { useState, useEffect } from 'react';
import { Search, Activity, ChevronRight, Loader2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';

interface ContentItem {
    id: string;
    name: string;
    slug: string;
    content: string;
    image?: string;
}

export default function Ensiklopedia() {
    const [data, setData] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 9;

    const fetchData = async (page: number, search: string) => {
        setLoading(true);
        try {
            const response = await api.get('/api/diseases', {
                params: {
                    page,
                    limit: itemsPerPage,
                    search: search, // Assuming backend supports search param
                },
            });
            setData(response.data.data);
            setTotalPages(response.data.meta.totalPages);
        } catch (error) {
            console.error('Gagal mengambil data ensiklopedia:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData(currentPage, searchQuery);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, searchQuery]);

    // Reset page when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <div className="flex-1 py-20">
            <div className="max-w-7xl mx-auto px-4">
                <header className="mb-12 text-center">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Ensiklopedia Kesehatan
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Informasi lengkap mengenai penyakit dan obat-obatan dalam genggaman Anda.
                    </motion.p>
                </header>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                    {/* Search Only */}
                    <div className="relative w-full md:w-[600px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-4 text-muted-foreground" />
                        <Input placeholder="Cari penyakit kulit..." className="pl-12 h-14 rounded-2xl bg-card border-2 focus-visible:ring-primary shadow-sm text-base" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                <div className="min-h-[500px] relative">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                <p className="text-sm font-medium text-muted-foreground">Memuat data...</p>
                            </motion.div>
                        ) : (
                            <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {data.length > 0 ? (
                                        data.map((item) => (
                                            <Link key={item.id} to={`/ensiklopedia/penyakit/${item.slug}`} className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                                {/* Image Section */}
                                                <div className="relative aspect-16/10 overflow-hidden bg-muted">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-primary/10">
                                                            <Activity className="w-20 h-20" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-4 left-4">
                                                        <div className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">Penyakit Kulit</div>
                                                    </div>
                                                </div>

                                                {/* Content Section */}
                                                <div className="p-6 flex flex-col flex-1">
                                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                                                    <div className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 prose prose-sm dark:prose-invert">
                                                        <ReactMarkdown>{item.content}</ReactMarkdown>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                                        <span className="text-sm font-bold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                                            Baca Detail
                                                            <ChevronRight className="w-4 h-4" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
                                            <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-6">
                                                <Search className="size-10 text-muted-foreground/50" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-foreground mb-2">Penyakit Tidak Ditemukan</h3>
                                            <p className="text-muted-foreground max-w-xs">Kami tidak menemukan penyakit kulit dengan kata kunci "{searchQuery}".</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 pt-8">
                                        <Button variant="outline" size="icon" className="rounded-xl border-2" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                                            <ChevronLeft className="size-5" />
                                        </Button>

                                        <div className="flex items-center gap-1 px-4">
                                            <span className="text-sm font-bold">Halaman {currentPage}</span>
                                            <span className="text-sm text-muted-foreground">dari {totalPages}</span>
                                        </div>

                                        <Button variant="outline" size="icon" className="rounded-xl border-2" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                                            <ChevronRight className="size-5" />
                                        </Button>
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
