"use client";
import { Navbar, NavBody, NavItems, MobileNav, NavbarButton, MobileNavHeader, MobileNavToggle, MobileNavMenu } from "@/components/ui/resizable-navbar";
import { SkinSightLogo } from "./logo";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { Home, Info, Activity } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Link, useLocation } from "react-router";

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
    ];

    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <Navbar className="top-0">
            {/* Desktop Navigation */}
            <NavBody>
                <SkinSightLogo />
                <NavItems items={navItems} />
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <NavbarButton variant="secondary">Masuk</NavbarButton>
                    <NavbarButton variant="primary">Daftar</NavbarButton>
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

                        <NavbarButton onClick={() => setIsMobileMenuOpen(false)} variant="secondary" className="w-full">
                            Masuk
                        </NavbarButton>
                        <NavbarButton onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full">
                            Daftar
                        </NavbarButton>
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}
