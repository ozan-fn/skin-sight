import { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

export function CropDialog({ image, open, onClose, onCropComplete, aspectRatio = 1 / 1 }: any) {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [scale, setScale] = useState(1);
    const imgRef = useRef<HTMLImageElement>(null);

    const onImageLoad = (e: any) => {
        const { width, height } = e.currentTarget;
        setCrop(centerCrop(makeAspectCrop({ unit: "%", width: 100 }, aspectRatio, width, height), width, height));
    };

    const handleConfirm = async () => {
        if (!completedCrop || !imgRef.current) return;
        const canvas = document.createElement("canvas");
        const img = imgRef.current;
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        // Tentukan batas lebar maksimal untuk mencegah ukuran file membengkak
        const MAX_WIDTH = 1200;
        let targetWidth = completedCrop.width * scaleX;
        let targetHeight = completedCrop.height * scaleY;

        if (targetWidth > MAX_WIDTH) {
            const ratio = MAX_WIDTH / targetWidth;
            targetWidth = MAX_WIDTH;
            targetHeight = targetHeight * ratio;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, 0, 0, targetWidth, targetHeight);
        canvas.toBlob((blob) => blob && (onCropComplete(blob), onClose()), "image/jpeg", 0.85);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-4 border-b bg-background">
                    <DialogTitle className="text-lg font-semibold">Sesuaikan Foto ({aspectRatio === 1 ? "1:1" : aspectRatio === 16 / 9 ? "16:9" : `${aspectRatio.toFixed(2)}`})</DialogTitle>
                </DialogHeader>

                <div className="bg-neutral-900 flex items-center justify-center p-8 min-h-[400px] max-h-[60vh] overflow-auto">
                    {image && (
                        <ReactCrop crop={crop} onChange={(_, c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={aspectRatio}>
                            <img ref={imgRef} src={image} alt="Crop" onLoad={onImageLoad} style={{ transform: `scale(${scale})` }} className="max-w-full h-auto" />
                        </ReactCrop>
                    )}
                </div>

                <div className="p-6 bg-background space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold uppercase text-muted-foreground tracking-widest">
                        <span>Zoom</span>
                        <span className="text-primary">{scale.toFixed(1)}x</span>
                    </div>
                    <Slider value={[scale]} min={1} max={3} step={0.1} onValueChange={(val) => setScale(val[0])} />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={onClose} className="rounded-full">
                            Batal
                        </Button>
                        <Button onClick={handleConfirm} className="rounded-full px-8 shadow-lg active:scale-95 transition-transform">
                            Simpan
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
