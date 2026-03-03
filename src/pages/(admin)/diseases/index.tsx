import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar";
import { AppSidebar } from "../../../components/app-sidebar";
import api from "../../../lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { ModeToggle } from "../../../components/mode-toggle";
import { Link } from "react-router";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";

interface Disease {
    id: string;
    name: string;
    slug: string;
    image?: string;
    createdAt: string;
}

export default function DiseaseListPage() {
    const [diseases, setDiseases] = useState<Disease[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchDiseases = async () => {
        try {
            const response = await api.get("/api/diseases");
            setDiseases(response.data.data);
        } catch (error) {
            console.error("Gagal mengambil data penyakit:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiseases();
    }, []);

    const handleDelete = async () => {
        if (!selectedDisease) return;
        setIsSubmitting(true);
        try {
            await api.delete(`/api/diseases/${selectedDisease.id}`);
            setDiseases(diseases.filter((d) => d.id !== selectedDisease.id));
            setIsDeleteDialogOpen(false);
        } catch (error) {
            alert("Gagal menghapus penyakit");
        } finally {
            setIsSubmitting(false);
            setSelectedDisease(null);
        }
    };

    const filteredDiseases = diseases.filter((d) => d.name?.toLowerCase().includes(searchTerm.toLowerCase()) || d.slug?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="flex h-16 items-center justify-between border-b px-6 bg-card sticky top-0 z-10 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div className="h-4 w-px bg-border" />
                            <h2 className="text-sm font-medium tracking-tight uppercase text-muted-foreground">Disease Management</h2>
                        </div>
                        <ModeToggle />
                    </div>

                    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight italic">Daftar Penyakit</h1>
                                <p className="text-muted-foreground">Kelola basis data penyakit SkinSight.</p>
                            </div>
                            <Button asChild className="rounded-full shadow-lg gap-2">
                                <Link to="/admin/diseases/create">
                                    <Plus className="h-4 w-4" />
                                    Tambah Penyakit
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 max-w-sm">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Cari penyakit..." className="pl-9 rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border shadow-xl overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[100px]">Gambar</TableHead>
                                        <TableHead>Nama Penyakit</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Dibuat Pada</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                Memuat data...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredDiseases.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                Belum ada data penyakit.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDiseases.map((disease) => (
                                            <TableRow key={disease.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell>
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">{disease.image ? <img src={disease.image} alt={disease.name} className="h-full w-full object-cover" /> : <span className="text-[10px] text-muted-foreground">No Icon</span>}</div>
                                                </TableCell>
                                                <TableCell className="font-semibold">{disease.name}</TableCell>
                                                <TableCell className="text-xs font-mono">{disease.slug}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground">{new Date(disease.createdAt).toLocaleDateString("id-ID")}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link to={`/admin/diseases/edit/${disease.id}`}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                setSelectedDisease(disease);
                                                                setIsDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </main>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Penyakit?</DialogTitle>
                        <DialogDescription>
                            Aksi ini akan menghapus data penyakit <b>{selectedDisease?.name}</b> secara permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                            {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SidebarProvider>
    );
}
