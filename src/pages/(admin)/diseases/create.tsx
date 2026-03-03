import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar";
import { AppSidebar } from "../../../components/app-sidebar";
import api from "../../../lib/api";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Save, Upload, Loader2, X, Pill, Search, CheckCircle2 } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { ModeToggle } from "../../../components/mode-toggle";
import { Link, useNavigate } from "react-router";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useTheme } from "../../../components/theme-provider";
import { CropDialog } from "../../../components/crop-dialog";
import { cn } from "@/lib/utils";

export default function CreateDiseasePage() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Drug selection state
    const [drugs, setDrugs] = useState<any[]>([]);
    const [searchDrug, setSearchDrug] = useState("");
    const [selectedDrugIds, setSelectedDrugIds] = useState<string[]>([]);
    const [isLoadingDrugs, setIsLoadingDrugs] = useState(true);

    // Crop state
    const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
    const [isCropOpen, setIsCropOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: "",
        content: "",
    });

    useEffect(() => {
        const fetchDrugs = async () => {
            try {
                const res = await api.get("/api/drugs?limit=100");
                setDrugs(res.data.data);
            } catch (error) {
                console.error("Gagal mengambil data obat", error);
            } finally {
                setIsLoadingDrugs(false);
            }
        };
        fetchDrugs();
    }, []);

    const filteredDrugs = drugs.filter((drug) => drug.name.toLowerCase().includes(searchDrug.toLowerCase()));

    const toggleDrug = (id: string) => {
        setSelectedDrugIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name),
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setTempImageUrl(reader.result as string);
            setIsCropOpen(true);
            e.target.value = ""; // Reset value agar bisa pilih file yang sama lagi
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (blob: Blob) => {
        setIsUploading(true);
        const file = new File([blob], `${formData.slug || "disease"}.jpg`, { type: "image/jpeg" });

        const data = new FormData();
        data.append("slug", formData.slug);
        data.append("image", file);

        try {
            const res = await api.post("/api/upload", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setFormData({ ...formData, image: res.data.url });
        } catch (error) {
            alert("Gagal mengunggah gambar");
        } finally {
            setIsUploading(false);
            setTempImageUrl(null);
        }
    };

    const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
        const res = await Promise.all(
            files.map((file) => {
                return new Promise((resolve) => {
                    const form = new FormData();
                    form.append("image", file);
                    api.post("/api/upload", form, {
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                        .then((res) => resolve(res.data.url))
                        .catch(() => resolve(""));
                });
            }),
        );
        callback(res as string[]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.slug || !formData.content) {
            alert("Harap isi semua field wajib");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post("/api/diseases", {
                ...formData,
                drugIds: selectedDrugIds,
            });
            navigate("/admin/diseases");
        } catch (error) {
            alert("Gagal menyimpan data");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="flex h-16 items-center justify-between border-b px-6 bg-card sticky top-0 z-10 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div className="h-4 w-px bg-border" />
                            <h2 className="text-sm font-medium tracking-tight uppercase text-muted-foreground">Tambah Penyakit</h2>
                        </div>
                        <ModeToggle />
                    </div>

                    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
                        <div className="mb-8 flex items-center justify-between">
                            <Button variant="ghost" asChild className="gap-2">
                                <Link to="/admin/diseases">
                                    <ArrowLeft className="h-4 w-4" />
                                    Kembali
                                </Link>
                            </Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-full shadow-lg gap-2 px-8">
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Simpan Penyakit
                            </Button>
                        </div>

                        <div className="grid gap-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Nama Penyakit</label>
                                        <Input placeholder="Contoh: Eksim (Eczema)" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Slug (URL)</label>
                                        <Input placeholder="eksim-eczema" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="rounded-xl h-12 font-mono text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Gambar Penyakit (16:9)</label>
                                    <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/20 aspect-video bg-muted/30 flex flex-col items-center justify-center transition-all hover:border-primary/50">
                                        {formData.image ? (
                                            <>
                                                <img src={formData.image} className="absolute inset-0 h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button variant="destructive" size="icon" onClick={() => setFormData({ ...formData, image: "" })}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 p-6">
                                                <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-background shadow-sm ${isUploading ? "animate-pulse" : ""}`}>{isUploading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <Upload className="h-6 w-6 text-muted-foreground" />}</div>
                                                <p className="text-sm font-medium">Klik untuk upload (Crop 16:9)</p>
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileSelect} accept="image/*" disabled={isUploading} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Isi Konten (Markdown)</label>
                                <div className="rounded-2xl overflow-hidden border shadow-inner">
                                    <MdEditor modelValue={formData.content} onChange={(val) => setFormData({ ...formData, content: val })} onUploadImg={onUploadImg} theme={theme === "dark" ? "dark" : "light"} language="en-US" style={{ height: "500px" }} preview={true} />
                                </div>
                            </div>

                            {/* Drug Selection Section */}
                            <div className="space-y-4 pt-6 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                            <Pill className="h-4 w-4" /> Relasi Obat Terkait
                                        </label>
                                        <p className="text-xs text-muted-foreground">Pilih obat-obatan yang berhubungan dengan penyakit ini.</p>
                                    </div>
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input placeholder="Cari obat..." value={searchDrug} onChange={(e) => setSearchDrug(e.target.value)} className="pl-9 h-9 text-xs rounded-full" />
                                    </div>
                                </div>

                                {isLoadingDrugs ? (
                                    <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-3xl">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-1 pr-3 scrollbar-thin scrollbar-thumb-primary/10">
                                        {filteredDrugs.length > 0 ? (
                                            filteredDrugs.map((drug) => {
                                                const isSelected = selectedDrugIds.includes(drug.id);
                                                return (
                                                    <div key={drug.id} onClick={() => toggleDrug(drug.id)} className={cn("group relative flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-md", isSelected ? "bg-primary/5 border-primary shadow-sm" : "bg-card border-border hover:border-primary/50")}>
                                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-muted overflow-hidden border">
                                                            {drug.image ? (
                                                                <img src={drug.image} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center">
                                                                    <Pill className="h-4 w-4 text-muted-foreground" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={cn("text-xs font-bold truncate", isSelected ? "text-primary" : "text-foreground group-hover:text-primary transition-colors")}>{drug.name}</p>
                                                            <p className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">{drug.slug}</p>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5 shadow-lg border-2 border-background">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-3xl">
                                                <p className="text-sm text-muted-foreground">Obat tidak ditemukan.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <CropDialog image={tempImageUrl} open={isCropOpen} onClose={() => setIsCropOpen(false)} onCropComplete={handleCropComplete} aspectRatio={16 / 9} />
        </SidebarProvider>
    );
}
