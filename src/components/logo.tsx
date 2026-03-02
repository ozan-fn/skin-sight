import { Link } from "react-router";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export const SkinSightLogo = ({ className }: { className?: string }) => {
    return (
        <Link to="/" className={cn("relative z-20 flex items-center space-x-2 text-foreground group", className)}>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
                Skin<span className="text-primary">Sight</span>
            </span>
        </Link>
    );
};
