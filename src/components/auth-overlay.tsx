"use client";

import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";
import { Lock, ArrowRight, LogIn } from "lucide-react";
import { Link } from "react-router";

export function AuthOverlay() {
    const { isLoading } = useAuth();

    if (isLoading) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-4">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 mb-2">
                        <Lock className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Login Diperlukan</h2>
                        <p className="text-muted-foreground text-lg">Fitur deteksi kulit berbasis AI ini memerlukan akun untuk memberikan hasil yang personal dan aman.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Button asChild className="w-full h-10 font-semibold transition-all active:scale-95">
                        <Link to="/login" className="flex items-center justify-center gap-2">
                            <LogIn className="h-4 w-4" /> Masuk ke Akun
                        </Link>
                    </Button>

                    <Button variant="outline" asChild className="w-full h-10 font-medium transition-all hover:bg-secondary">
                        <Link to="/register" className="flex items-center justify-center gap-2">
                            Daftar Sekarang <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground pt-4">Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.</p>
            </div>
        </div>
    );
}
