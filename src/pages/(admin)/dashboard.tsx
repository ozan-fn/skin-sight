import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { useAuth } from "../../components/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ModeToggle } from "../../components/mode-toggle";
import api from "../../lib/api";

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/api/stats");
                setStats(res.data);
            } catch (error) {
                console.error("Gagal mengambil statistik", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="flex h-16 items-center justify-between border-b px-6 bg-card sticky top-0 z-10 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div className="h-4 w-px bg-border" />
                            <h2 className="text-sm font-medium tracking-tight uppercase text-muted-foreground">Admin Overview</h2>
                        </div>
                        <ModeToggle />
                    </div>

                    <div className="p-8">
                        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Halo, {user?.name}!</h1>
                                <p className="text-muted-foreground text-lg">Selamat datang di panel kontrol SkinSight. Monitor data kesehatan dengan presisi.</p>
                            </div>

                            {isLoading ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <Card key={i} className="h-32 flex items-center justify-center border-none shadow-md animate-pulse bg-muted/50" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    <StatCard title="Total Penyakit" value={stats?.diseases || 0} icon="🏥" color="bg-blue-500/10 text-blue-600" />
                                    <StatCard title="Total Obat" value={stats?.drugs || 0} icon="💊" color="bg-emerald-500/10 text-emerald-600" />
                                    <StatCard title="Total Pengguna" value={stats?.users || 0} icon="👥" color="bg-purple-500/10 text-purple-600" />
                                    <StatCard title="User Baru Hari Ini" value={stats?.newUsersToday || 0} icon="✨" color="bg-amber-500/10 text-amber-600" />
                                </div>
                            )}

                            <div className="grid gap-6 md:grid-cols-7">
                                <Card className="md:col-span-4 border-none shadow-xl bg-linear-to-br from-card to-muted/50">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Profil Administrator</CardTitle>
                                        <CardDescription>Detail akun yang sedang aktif</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-8 py-4">
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-linear-to-r from-primary to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                                                <div className="relative h-24 w-24 rounded-2xl bg-card border flex items-center justify-center text-4xl font-bold text-primary shadow-inner">{user?.name?.[0] || "A"}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-2xl font-bold tracking-tight">{user?.name}</p>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-muted-foreground flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        {user?.email}
                                                    </p>
                                                    <div className="mt-1 w-fit inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-transparent">{user?.role}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="md:col-span-3 border-none shadow-xl bg-primary text-primary-foreground overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl -mr-10 -mt-10">⚡</div>
                                    <CardHeader>
                                        <CardTitle className="text-xl">Status Sistem</CardTitle>
                                        <CardDescription className="text-primary-foreground/70">Kesehatan infrastruktur</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col justify-center items-center text-center space-y-4 py-6">
                                        <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-3xl shadow-lg backdrop-blur-md">🚀</div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-lg">Server Berjalan Normal</p>
                                            <p className="text-sm text-primary-foreground/80 max-w-[200px]">Node.js Express & MongoDB Atlas terintegrasi dengan baik.</p>
                                        </div>
                                        <div className="w-full bg-white/10 h-10 flex items-center justify-center rounded-xl font-mono text-xs">Latensi: Stabil</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: string; color: string }) {
    return (
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${color}`}>{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tracking-tighter">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">Data real-time dari database</p>
            </CardContent>
        </Card>
    );
}
