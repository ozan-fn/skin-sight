import { ApiReferenceReact } from "@scalar/api-reference-react";
import { useEffect, useState } from "react";
import "@scalar/api-reference-react/style.css";

export default function Docs() {
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch("/api/auth/refresh", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAccessToken(data.accessToken);
                    setTimeout(fetchToken, 900_000);
                }
            } catch (error) {
                console.error("Gagal mengambil token otomatis untuk docs:", error);
            }
        };

        fetchToken();
    }, []);

    // Tunggu sampai pengecekan token selesai agar tidak ada flicker
    // if (loading) return null;

    return (
        <ApiReferenceReact
            configuration={{
                url: "/api/docs-json",
                authentication: {
                    preferredSecurityScheme: ["bearerAuth"],
                    securitySchemes: {
                        bearerAuth: {
                            token: accessToken,
                        },
                    },
                },
            }}
        />
    );
}
