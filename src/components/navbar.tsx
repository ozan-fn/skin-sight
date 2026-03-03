"use client";
import { Navbar, NavBody, NavItems, MobileNav, NavbarButton, MobileNavHeader, MobileNavToggle, MobileNavMenu } from "@/components/ui/resizable-navbar";
import { SkinSightLogo } from "./logo";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { Home, Info, Activity, BookOpen } from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import { Link, useLocation } from "react-router";
import { useAuth } from "./auth-provider";
import { LogOut, User as UserIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function NavbarDemo() {
    const navItems = [
        {
            name: "Beranda",
            link: "/",
            icon: <Home className="h-4 w-4" />,
        },
        {
            name: "Tentang Kami",
            link: "/tentang-kami",
            icon: <Info className="h-4 w-4" />,
        },
        {
            name: "Deteksi",
            link: "/deteksi",
            icon: <Activity className="h-4 w-4" />,
        },
        {
            name: "Ensiklopedia",
            link: "/ensiklopedia",
            icon: <BookOpen className="h-4 w-4" />,
        },
    ];

    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <Navbar className="top-0">
            {/* Desktop Navigation */}
            <NavBody>
                <SkinSightLogo />
                <NavItems items={navItems} />
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">{user.avatar ? <img src={user.avatar} className="h-full w-full rounded-full object-cover" alt={user.name} /> : <UserIcon className="h-5 w-5 text-primary" />}</button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link to="/profile">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profil Saya</span>
                                    </DropdownMenuItem>
                                </Link>
                                {user.role === "ADMIN" && (
                                    <Link to="/admin">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Activity className="mr-2 h-4 w-4" />
                                            <span>Dashboard Admin</span>
                                        </DropdownMenuItem>
                                    </Link>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Keluar</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link to="/login">
                                <NavbarButton variant="secondary">Masuk</NavbarButton>
                            </Link>
                            <Link to="/register">
                                <NavbarButton variant="primary">Daftar</NavbarButton>
                            </Link>
                        </>
                    )}
                </div>
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav>
                <MobileNavHeader>
                    <SkinSightLogo />
                    <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                </MobileNavHeader>

                <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
                    {navItems.map((item, idx) => {
                        const isActive = location.pathname === item.link || (item.link !== "/" && location.hash === item.link);

                        return (
                            <Link key={`mobile-link-${idx}`} to={item.link} onClick={() => setIsMobileMenuOpen(false)} className={cn("relative flex items-center gap-2 transition-colors", isActive ? "text-black dark:text-white" : "text-neutral-600 dark:text-neutral-300")}>
                                {item?.icon || <></>}
                                <span className="block">{item.name}</span>
                            </Link>
                        );
                    })}
                    <div className="flex w-full flex-col gap-4">
                        <div className="ml-auto">
                            <ModeToggle />
                        </div>

                        {user ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 rounded-lg border p-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">{user.avatar ? <img src={user.avatar} className="h-full w-full rounded-full object-cover" alt={user.name} /> : <UserIcon className="h-5 w-5 text-primary" />}</div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="truncate font-medium">{user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <NavbarButton variant="secondary" className="w-full justify-start">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            Profil Saya
                                        </NavbarButton>
                                    </Link>
                                    {user.role === "ADMIN" && (
                                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                                            <NavbarButton variant="secondary" className="w-full justify-start">
                                                <Activity className="mr-2 h-4 w-4" />
                                                Dashboard Admin
                                            </NavbarButton>
                                        </Link>
                                    )}
                                </div>

                                <NavbarButton
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        logout();
                                    }}
                                    variant="secondary"
                                    className="w-full text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Keluar
                                </NavbarButton>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                                    <NavbarButton variant="secondary" className="w-full">
                                        Masuk
                                    </NavbarButton>
                                </Link>
                                <Link to="/register" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                                    <NavbarButton variant="primary" className="w-full">
                                        Daftar
                                    </NavbarButton>
                                </Link>
                            </>
                        )}
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}
