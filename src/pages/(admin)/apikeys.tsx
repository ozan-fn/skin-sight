import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar';
import { AppSidebar } from '../../components/app-sidebar';
import api from '../../lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Key, Trash2, Plus, RefreshCcw, Power, PowerOff, AlertTriangle } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { ModeToggle } from '../../components/mode-toggle';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { toast } from 'sonner';

interface GeminiApiKey {
    id: string;
    key: string;
    active: boolean;
    usage: number;
    createdAt: string;
    updatedAt: string;
}

export default function ApiKeysPage() {
    const [apiKeys, setApiKeys] = useState<GeminiApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState<GeminiApiKey | null>(null);
    const [newKey, setNewKey] = useState('');

    const fetchApiKeys = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/api-keys');
            setApiKeys(response.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal mengambil data API Key');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const handleCreateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKey.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await api.post('/api/api-keys', { key: newKey });
            setApiKeys([response.data, ...apiKeys]);
            setNewKey('');
            setIsAddDialogOpen(false);
            toast.success('API Key berhasil ditambahkan');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menambahkan API Key');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (key: GeminiApiKey) => {
        try {
            const response = await api.patch(`/api/api-keys/${key.id}/toggle`);
            setApiKeys(apiKeys.map((k) => (k.id === key.id ? response.data : k)));
            toast.success(`API Key ${response.data.active ? 'diaktifkan' : 'dinonaktifkan'}`);
        } catch (error: any) {
            toast.error('Gagal mengubah status API Key');
        }
    };

    const handleDeleteKey = async () => {
        if (!selectedKey) return;

        setIsSubmitting(true);
        try {
            await api.delete(`/api/api-keys/${selectedKey.id}`);
            setApiKeys(apiKeys.filter((k) => k.id !== selectedKey.id));
            setIsDeleteDialogOpen(false);
            toast.success('API Key berhasil dihapus');
        } catch (error: any) {
            toast.error('Gagal menghapus API Key');
        } finally {
            setIsSubmitting(false);
            setSelectedKey(null);
        }
    };

    const openDeleteDialog = (key: GeminiApiKey) => {
        setSelectedKey(key);
        setIsDeleteDialogOpen(true);
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="flex h-16 items-center justify-between border-b px-6 bg-card sticky top-0 z-10 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div className="h-4 w-px bg-border" />
                            <h2 className="text-sm font-medium tracking-tight uppercase text-muted-foreground">API Management</h2>
                        </div>
                        <ModeToggle />
                    </div>

                    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight italic">Gemini API Keys</h1>
                                <p className="text-muted-foreground">Kelola kumpulan API Key untuk integrasi Gemini AI.</p>
                            </div>
                            <Button onClick={() => setIsAddDialogOpen(true)} className="rounded-xl font-bold gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Key Baru
                            </Button>
                        </div>

                        <div className="bg-card rounded-2xl border shadow-xl overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>API Key</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Usage Count</TableHead>
                                        <TableHead>Dibuat Pada</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                <RefreshCcw className="h-5 w-5 animate-spin mx-auto mb-2" />
                                                Memuat data API Key...
                                            </TableCell>
                                        </TableRow>
                                    ) : apiKeys.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                Belum ada API Key yang terdaftar.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        apiKeys.map((key) => (
                                            <TableRow key={key.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-mono text-xs">
                                                    {key.key.substring(0, 10)}****************{key.key.slice(-4)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`rounded-full px-3 py-0.5 border-none ${key.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                                        {key.active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{key.usage}</span>
                                                        <span className="text-xs text-muted-foreground">calls</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {new Date(key.createdAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${key.active ? 'text-amber-600' : 'text-emerald-600'}`} onClick={() => handleToggleStatus(key)} title={key.active ? 'Nonaktifkan' : 'Aktifkan'}>
                                                            {key.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => openDeleteDialog(key)} title="Hapus">
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

            {/* Add Key Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary" />
                            Tambah Gemini API Key
                        </DialogTitle>
                        <DialogDescription>Masukkan API Key Gemini yang valid dari Google AI Studio.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateKey} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Input placeholder="AIzaSy..." value={newKey} onChange={(e) => setNewKey(e.target.value)} className="rounded-xl" required autoFocus />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary font-bold">
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Key'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Hapus API Key?
                        </DialogTitle>
                        <DialogDescription>Tindakan ini akan menghapus API Key ini dari sistem secara permanen.</DialogDescription>
                    </DialogHeader>
                    {selectedKey && (
                        <div className="py-4 px-4 bg-destructive/5 rounded-2xl border border-destructive/10">
                            <p className="text-sm font-mono break-all text-destructive/80">{selectedKey.key.substring(0, 15)}...</p>
                        </div>
                    )}
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteKey} disabled={isSubmitting} className="font-bold shadow-lg shadow-destructive/20">
                            {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SidebarProvider>
    );
}
