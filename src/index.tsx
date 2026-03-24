import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import './styles.css';
import { TooltipProvider } from './components/ui/tooltip';
import { ScrollToTop } from './components/utils/scroll-to-top';

const rootEl = document.getElementById('root');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <ThemeProvider defaultTheme="light" storageKey="sawit">
                <BrowserRouter>
                    <ScrollToTop />
                    <AuthProvider>
                        <TooltipProvider>
                            <App />
                        </TooltipProvider>
                    </AuthProvider>
                </BrowserRouter>
            </ThemeProvider>
        </React.StrictMode>,
    );
}
