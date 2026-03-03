import { Navigate, Outlet } from "react-router";
import { useAuth } from "./auth-provider";

export const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Memuat...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export const AdminRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Memuat...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export const GuestRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Memuat...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
