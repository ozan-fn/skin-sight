import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Camera, Loader2, Lock, Save, User, X, Mail, ShieldCheck } from "lucide-react";
import { CropDialog } from "@/components/crop-dialog";
import { toast } from "sonner";

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // Profile State
    const [name, setName] = useState(user?.name || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");

    // Password State
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Avatar Upload State
    const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setTempImageUrl(reader.result as string);
            setIsCropOpen(true);
            e.target.value = "";
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (blob: Blob) => {
        setIsUploading(true);
        const file = new File([blob], `avatar-${user?.id}.jpg`, { type: "image/jpeg" });

        const data = new FormData();
        data.append("image", file);

        try {
            const res = await api.post("/api/upload", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAvatar(res.data.url);
            toast.success("Foto profil berhasil diunggah");
        } catch (error) {
            toast.error("Gagal mengunggah foto profil");
        } finally {
            setIsUploading(false);
            setTempImageUrl(null);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.put("/api/auth/update-profile", { name, avatar });
            setUser({ ...user, ...res.data.user });
            toast.success("Profil berhasil diperbarui");
        } catch (error) {
            toast.error("Gagal memperbarui profil");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Konfirmasi password tidak cocok");
            return;
        }

        setIsPasswordLoading(true);
        try {
            await api.put("/api/auth/update-password", { oldPassword, newPassword });
            toast.success("Password berhasil diperbarui");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal memperbarui password");
        } finally {
            setIsPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 mt-[54px]">
            <div className="container max-w-7xl py-10 px-4 mx-auto">
                <div className="flex flex-col gap-8 md:flex-row">
                    {/* Sidebar / User Card */}
                    <aside className="w-full md:w-80 space-y-6">
                        <Card className="border-none shadow-2xl bg-card overflow-hidden">
                            <div className="h-24 bg-primary/10 relative">
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                    <div className="relative group">
                                        <div className="h-28 w-28 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center ring-4 ring-background shadow-xl">
                                            {avatar ? <img src={avatar} alt={name} className="h-full w-full object-cover" /> : <User className="h-12 w-12 text-muted-foreground" />}
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-bold gap-1">
                                            <Camera className="h-4 w-4" />
                                            UPDATE
                                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarSelect} disabled={isUploading} />
                                        </label>
                                        {avatar && (
                                            <button type="button" onClick={() => setAvatar("")} className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10">
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 pb-6 px-6 text-center">
                                <h2 className="text-xl font-bold truncate">{user?.name}</h2>
                                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">{user?.role}</span>
                                </div>
                            </div>
                        </Card>

                        <div className="hidden md:block p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tight text-primary">
                                <ShieldCheck className="h-4 w-4" />
                                Keamanan Akun
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">Pastikan password Anda kuat dan diganti secara berkala untuk menjaga keamanan data medis Anda.</p>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-extrabold tracking-tight">Pengaturan Profil</h1>
                            <p className="text-muted-foreground">Kelola informasi publik dan keamanan akun Anda secara mandiri.</p>
                        </div>

                        <div className="grid gap-6">
                            {/* Basics */}
                            <Card className="border-none shadow-xl bg-card">
                                <CardHeader className="border-b bg-muted/30">
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nama Lengkap</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-9 h-11 rounded-xl" placeholder="Contoh: Budi Santoso" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Alamat Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input value={user?.email || ""} disabled className="pl-9 h-11 rounded-xl bg-muted/50 cursor-not-allowed border-none" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <Button type="submit" disabled={isLoading} className="rounded-xl px-6 gap-2 shadow-lg shadow-primary/20">
                                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                Simpan Perubahan
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Password */}
                            <Card className="border-none shadow-xl bg-card">
                                <CardHeader className="border-b bg-muted/30">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Ganti Password</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password Saat Ini</Label>
                                            <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="h-11 rounded-xl" placeholder="••••••••" />
                                        </div>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password Baru</Label>
                                                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-11 rounded-xl" placeholder="••••••••" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Konfirmasi Password</Label>
                                                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-11 rounded-xl" placeholder="Tulis ulang password baru" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <Button type="submit" disabled={isPasswordLoading} variant="outline" className="rounded-xl px-6 gap-2 border-primary/20 hover:bg-primary/5">
                                                {isPasswordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                                                Perbarui Keamanan
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>

            <CropDialog image={tempImageUrl} open={isCropOpen} onClose={() => setIsCropOpen(false)} onCropComplete={handleCropComplete} />
        </div>
    );
}
