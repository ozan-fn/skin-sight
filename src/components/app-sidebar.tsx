import { LayoutDashboard, Users, Pill, Stethoscope, LogOut } from "lucide-react";
import { useAuth } from "./auth-provider";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Link, useLocation } from "react-router";

export function AppSidebar() {
    const { logout, user } = useAuth();
    const location = useLocation();

    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b">
                <Link to="/admin" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Stethoscope className="h-5 w-5" />
                    </div>
                    <span>SkinSight Admin</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={location.pathname === "/admin"}>
                                    <Link to="/admin">
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={location.pathname.startsWith("/admin/diseases")}>
                                    <Link to="/admin/diseases">
                                        <Stethoscope className="h-4 w-4" />
                                        <span>Daftar Penyakit</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={location.pathname.startsWith("/admin/drugs")}>
                                    <Link to="/admin/drugs">
                                        <Pill className="h-4 w-4" />
                                        <span>Daftar Obat</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>User Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={location.pathname === "/admin/users"}>
                                    <Link to="/admin/users">
                                        <Users className="h-4 w-4" />
                                        <span>Pengguna</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">{user?.name?.[0] || "A"}</div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                    </div>
                    <button onClick={() => logout()} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors" title="Logout">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
