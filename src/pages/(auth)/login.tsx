import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../components/auth-provider";
import { Button } from "../../components/ui/button";
import api from "../../lib/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/api/auth/login", { email, password });
            const data = response.data;

            login(data.accessToken, data.user);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Selamat Datang Kembali</h1>
                    <p className="mt-2 text-muted-foreground">Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center border border-destructive/20">{error}</div>}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.02]" disabled={loading}>
                        {loading ? "Memproses..." : "Masuk"}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Belum punya akun?{" "}
                    <Link to="/register" className="font-semibold text-primary hover:underline underline-offset-4">
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </div>
    );
}
