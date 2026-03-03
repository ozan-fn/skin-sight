import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar";
import { AppSidebar } from "../../../components/app-sidebar";
import api from "../../../lib/api";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Save, Upload, Loader2, X } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { ModeToggle } from "../../../components/mode-toggle";
import { Link, useNavigate, useParams } from "react-router";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useTheme } from "../../../components/theme-provider";
import { CropDialog } from "../../../components/crop-dialog";

export default function EditDiseasePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Crop state
    const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
    const [isCropOpen, setIsCropOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: "",
        content: "",
    });

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

    useEffect(() => {
        const fetchDisease = async () => {
            try {
                const res = await api.get(`/api/diseases`);
                const disease = res.data.data.find((d: any) => d.id === id);
                if (disease) {
                    setFormData({
                        name: disease.name,
                        slug: disease.slug,
                        image: disease.image || "",
                        content: disease.content || "",
                    });
                }
            } catch (error) {
                console.error("Gagal mengambil data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDisease();
    }, [id]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setTempImageUrl(reader.result as string);
            setIsCropOpen(true);
            e.target.value = "";
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
        setIsSubmitting(true);
        try {
            await api.patch(`/api/diseases/${id}`, formData);
            navigate("/admin/diseases");
        } catch (error) {
            alert("Gagal memperbarui data");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-20 text-center">Memuat data...</div>;

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="flex h-16 items-center justify-between border-b px-6 bg-card sticky top-0 z-10 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div className="h-4 w-px bg-border" />
                            <h2 className="text-sm font-medium tracking-tight uppercase text-muted-foreground">Edit Penyakit</h2>
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
                                Simpan Perubahan
                            </Button>
                        </div>

                        <div className="grid gap-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Nama Penyakit</label>
                                        <Input placeholder="Nama Penyakit (Contoh: Eksim)" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Slug (URL)</label>
                                        <Input placeholder="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="rounded-xl h-12 font-mono text-sm" />
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
                        </div>
                    </div>
                </main>
            </div>

            <CropDialog image={tempImageUrl} open={isCropOpen} onClose={() => setIsCropOpen(false)} onCropComplete={handleCropComplete} aspectRatio={16 / 9} />
        </SidebarProvider>
    );
}
