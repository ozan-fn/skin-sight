import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import "./styles.css";

const rootEl = document.getElementById("root");
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <ThemeProvider defaultTheme="light" storageKey="sawit">
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </React.StrictMode>,
    );
}
