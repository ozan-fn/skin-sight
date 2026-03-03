import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../lib/api";

interface DetailItem {
    id: string;
    name: string;
    slug: string;
    content: string;
    image?: string;
    updatedAt: string;
    drugDiseases?: any[];
}

interface EncyclopediaStore {
    details: Record<string, DetailItem>;
    listData: Record<string, any[]>; // Cache for lists (penyakit/obat)
    loading: boolean;
    error: string | null;
    fetchDetail: (type: string, slug: string) => Promise<void>;
    fetchList: (type: string) => Promise<void>;
    clearError: () => void;
}

export const useEncyclopediaStore = create<EncyclopediaStore>()(
    persist(
        (set, get) => ({
            details: {},
            listData: {},
            loading: false,
            error: null,

            fetchDetail: async (type: string, slug: string) => {
                const key = `${type}-${slug}`;
                if (get().details[key]) return;

                set({ loading: true, error: null });
                try {
                    const isPenyakit = type === "penyakit";
                    const endpoint = isPenyakit ? `/api/diseases/${slug}` : `/api/drugs/${slug}`;
                    const response = await api.get(endpoint);

                    set((state) => ({
                        details: { ...state.details, [key]: response.data },
                        loading: false,
                    }));
                } catch (err: any) {
                    set({
                        error: err.response?.data?.message || "Gagal mengambil data detail",
                        loading: false,
                    });
                }
            },

            fetchList: async (type: string) => {
                if (get().listData[type]) return;

                set({ loading: true, error: null });
                try {
                    const endpoint = type === "penyakit" ? "/api/diseases" : "/api/drugs";
                    const response = await api.get(endpoint);

                    set((state) => ({
                        listData: { ...state.listData, [type]: response.data.data },
                        loading: false,
                    }));
                } catch (err: any) {
                    set({
                        error: err.response?.data?.message || "Gagal mengambil daftar data",
                        loading: false,
                    });
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: "encyclopedia-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
