import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import api from "../../lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Search, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { ModeToggle } from "../../components/mode-toggle";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";

interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
    avatar?: string;
    free: number;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal states
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/api/users");
            setUsers(response.data.data);
        } catch (error) {
            console.error("Gagal mengambil data user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async () => {
        if (!selectedUser) return;

        setIsSubmitting(true);
        const newRole = selectedUser.role === "ADMIN" ? "USER" : "ADMIN";

        try {
            await api.patch(`/api/users/${selectedUser.id}/role`, { role: newRole });
            setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u)));
            setIsRoleDialogOpen(false);
        } catch (error) {
            alert("Gagal mengubah role");
        } finally {
            setIsSubmitting(false);
            setSelectedUser(null);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        setIsSubmitting(true);
        try {
            await api.delete(`/api/users/${selectedUser.id}`);
            setUsers(users.filter((u) => u.id !== selectedUser.id));
            setIsDeleteDialogOpen(false);
        } catch (error) {
            alert("Gagal menghapus user");
        } finally {
            setIsSubmitting(false);
            setSelectedUser(null);
        }
    };

    const openRoleDialog = (user: User) => {
        setSelectedUser(user);
        setIsRoleDialogOpen(true);
    };

    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const filteredUsers = users.filter((u) => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="flex h-16 items-center justify-between border-b px-6 bg-card sticky top-0 z-10 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div className="h-4 w-px bg-border" />
                            <h2 className="text-sm font-medium tracking-tight uppercase text-muted-foreground">User Management</h2>
                        </div>
                        <ModeToggle />
                    </div>

                    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                        <div className="flex flex-col items-start gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight italic">Daftar Pengguna</h1>
                                <p className="text-muted-foreground">Kelola hak akses dan informasi pengguna SkinSight.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 max-w-sm">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Cari nama atau email..." className="pl-9 rounded-xl border-muted-foreground/20" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border shadow-xl overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[80px]">User</TableHead>
                                        <TableHead>Info</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Kuota Free</TableHead>
                                        <TableHead>Terdaftar</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                                Memuat data pengguna...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                                Tidak ada pengguna ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-muted/30 transition-colors group">
                                                <TableCell>
                                                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback className="font-bold bg-primary/10 text-primary">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm">{user.name}</span>
                                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`rounded-full px-3 py-0.5 border-none ${user.role === "ADMIN" ? "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20" : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"}`}>{user.role}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                                                            <div className="bg-primary h-full transition-all" style={{ width: `${Math.min(100, (user.free / 5) * 100)}%` }} />
                                                        </div>
                                                        <span className="text-xs font-medium">{user.free}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" onClick={() => openRoleDialog(user)} title="Ganti Role">
                                                            <ShieldCheck className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => openDeleteDialog(user)} title="Hapus">
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

            {/* Role Change Modal */}
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Konfirmasi Perubahan Role
                        </DialogTitle>
                        <DialogDescription>Pastikan Anda yakin ingin mengubah izin akses pengguna ini.</DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="flex items-center gap-4 py-6 px-4 bg-muted/40 rounded-2xl border border-border/50">
                            <Avatar className="h-14 w-14 border-2 border-background shadow-lg">
                                <AvatarImage src={selectedUser.avatar} />
                                <AvatarFallback className="font-bold bg-primary/10 text-primary text-lg">{selectedUser.name?.[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold truncate text-lg leading-tight">{selectedUser.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{selectedUser.email}</p>
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                    <Badge variant="outline" className="rounded-md px-2 py-0">
                                        {selectedUser.role}
                                    </Badge>
                                    <span className="text-muted-foreground">➜</span>
                                    <Badge className="rounded-md px-2 py-0 bg-primary/20 text-primary hover:bg-primary/30 border-none">{selectedUser.role === "ADMIN" ? "USER" : "ADMIN"}</Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => setIsRoleDialogOpen(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button onClick={handleRoleUpdate} disabled={isSubmitting} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold">
                            {isSubmitting ? "Memproses..." : "Konfirmasi Perubahan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Hapus Pengguna?
                        </DialogTitle>
                        <DialogDescription>Tindakan ini tidak dapat dibatalkan. Semua data terkait pengguna ini akan dihapus permanen.</DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="flex items-center gap-4 py-4 px-4 bg-destructive/5 rounded-2xl border border-destructive/10">
                            <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                                <AvatarImage src={selectedUser.avatar} />
                                <AvatarFallback className="font-bold bg-destructive/10 text-destructive">{selectedUser.name?.[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold truncate text-base leading-tight">{selectedUser.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting} className="font-bold shadow-lg shadow-destructive/20">
                            {isSubmitting ? "Menghapus..." : "Ya, Hapus Permanen"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SidebarProvider>
    );
}
