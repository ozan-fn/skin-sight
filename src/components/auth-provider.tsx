import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api, { setToken } from "../lib/api";

interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    free: number;
    role: "USER" | "ADMIN";
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (token: string, userData: User) => void;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initializeAuth = async () => {
        try {
            const refreshResponse = await api.post("/api/auth/refresh");
            if (refreshResponse.data.accessToken) {
                setToken(refreshResponse.data.accessToken);

                const response = await api.get("/api/auth/me");
                setUser(response.data);
            }
        } catch (error) {
            console.error("Gagal melakukan autentikasi otomatis:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const login = (token: string, userData: User) => {
        setToken(token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post("/api/auth/logout");
        } finally {
            setToken("");
            setUser(null);
        }
    };

    return <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
