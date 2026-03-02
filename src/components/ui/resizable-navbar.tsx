"use client";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";

import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router";

interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
        icon?: React.ReactNode;
    }[];
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            // IMPORTANT: Change this to class of `fixed` if you want the navbar to be fixed
            className={cn("sticky inset-x-0 top-20 z-40 w-full", className)}
        >
            {React.Children.map(children, (child) => (React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ visible?: boolean }>, { visible }) : child))}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    return (
        <motion.div
            animate={{
                width: visible ? "40%" : "100%",
                y: visible ? 20 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            style={{
                minWidth: "800px",
            }}
            className={cn("relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start border-none bg-transparent px-4 py-2 lg:flex", visible && "rounded-full border border-border bg-background/80 shadow-md backdrop-blur-md", className)}
        >
            {children}
        </motion.div>
    );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
    const location = useLocation();
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <motion.div onMouseLeave={() => setHovered(null)} className={cn("hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-muted-foreground transition duration-200 hover:text-foreground lg:flex lg:space-x-2", className)}>
            {items.map((item, idx) => {
                const isActive = location.pathname === item.link || (item.link !== "/" && location.hash === item.link);

                return (
                    <Link onMouseEnter={() => setHovered(idx)} onClick={onItemClick} className={cn("relative px-4 py-2 transition-colors duration-200", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")} key={`link-${idx}`} to={item.link}>
                        {(hovered === idx || isActive) && <motion.div layoutId="hovered" className="absolute inset-0 h-full w-full rounded-md bg-accent" />}
                        <span className="relative z-20 flex items-center gap-2">
                            {item.icon && <span>{item.icon}</span>}
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </motion.div>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                width: visible ? "90%" : "100%",
                y: visible ? 20 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn("relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between rounded-full bg-transparent px-0 py-2 lg:hidden", visible && "rounded border border-border bg-background/80 shadow-md backdrop-blur-md", className)}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => {
    return <div className={cn("flex w-full flex-row items-center justify-between", className)}>{children}</div>;
};

export const MobileNavMenu = ({ children, className, isOpen, onClose }: MobileNavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn("absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg border border-border bg-popover px-4 py-8 shadow-md text-popover-foreground", className)}>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const MobileNavToggle = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
    return isOpen ? <X className="h-6 w-6 text-foreground" onClick={onClick} /> : <Menu className="h-6 w-6 text-foreground" onClick={onClick} />;
};

export const NavbarLogo = () => {
    return (
        <Link to="/" className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-foreground">
            <img src="https://assets.aceternity.com/logo-dark.png" alt="logo" width={30} height={30} className="dark:invert" />
            <span className="font-medium">Startup</span>
        </Link>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "outline";
} & (React.ComponentPropsWithoutRef<"a"> | React.ComponentPropsWithoutRef<"button">)) => {
    const baseStyles = "px-4 py-2 rounded-md text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

    const variantStyles = {
        primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        dark: "bg-foreground text-background shadow-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    };

    return (
        <Tag href={href || undefined} className={cn(baseStyles, variantStyles[variant], className)} {...props}>
            {children}
        </Tag>
    );
};
