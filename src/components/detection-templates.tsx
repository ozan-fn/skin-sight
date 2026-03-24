import { Search, Activity, ShieldAlert, HelpCircle, Upload, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const CHAT_TEMPLATES = [
    {
        icon: <Search className="size-4 text-blue-500" />,
        title: 'Analisa Gejala',
        description: 'Saya memiliki bintik merah gatal di lengan, tolong analisa.',
    },
    {
        icon: <Activity className="size-4 text-emerald-500" />,
        title: 'Identifikasi Ruam',
        description: 'Ada ruam melingkar di punggung saya yang terasa perih.',
    },
    {
        icon: <ShieldAlert className="size-4 text-orange-500" />,
        title: 'Kondisi Kronis',
        description: 'Kulit wajah saya sering mengelupas dan kering di area T.',
    },
    {
        icon: <HelpCircle className="size-4 text-purple-500" />,
        title: 'Contoh: Psoriasis',
        description: 'Bercak merah bersisik putih keperakan yang terasa gatal.',
        image: '/Penyakit-Kulit-Psoriasis.jpg',
    },
];

interface DetectionTemplatesProps {
    onSelect: (description: string, image?: string) => void;
    onUploadClick: () => void;
}

export function UploadCard({ onUploadClick }: { onUploadClick: () => void }) {
    return (
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={onUploadClick} className="w-full flex flex-col items-center justify-center gap-3 p-8 md:p-12 text-center border-2 border-dashed rounded-2xl md:rounded-3xl bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative">
                <Upload className="size-8" />
                <div className="absolute -top-1 -right-1 size-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-background">
                    <Plus className="size-3 stroke-[3]" />
                </div>
            </div>
            <div className="space-y-1 relative">
                <h3 className="font-bold text-sm md:text-base text-primary uppercase tracking-wider">Unggah Foto Kulit Anda</h3>
                <p className="text-xs md:text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">Klik di sini atau seret foto untuk mulai identifikasi penyakit kulit secara otomatis.</p>
            </div>
        </motion.button>
    );
}

export function DetectionTemplates({ onSelect }: { onSelect: (description: string, image?: string) => void }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 text-muted-foreground">
                <HelpCircle className="size-3.5" />
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest">Atau Coba Contoh Analisa</span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                {CHAT_TEMPLATES.map((template, index) => (
                    <motion.button key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(template.description, template.image)} className="flex flex-col items-start gap-2 p-3 md:p-4 text-left border rounded-xl md:rounded-2xl bg-muted/30 hover:bg-muted hover:border-primary/50 transition-all group w-full">
                        {template.image ? (
                            <div className="w-full h-16 sm:h-20 rounded-lg overflow-hidden shrink-0 border bg-background">
                                <img src={template.image} alt={template.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        ) : (
                            <div className="p-2 rounded-lg bg-background group-hover:scale-110 transition-transform shrink-0">{template.icon}</div>
                        )}
                        <div className="overflow-hidden w-full">
                            <p className="font-semibold text-xs md:text-sm truncate leading-none mb-1">{template.title}</p>
                            <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-2 leading-snug">{template.description}</p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
