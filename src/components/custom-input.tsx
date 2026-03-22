'use client';

import { useRef, useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';
import TextareaAutosize from 'react-textarea-autosize';
import { Send, ImagePlus, X, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InputGroupCustomProps {
    textValue: string;
    onTextChange: (val: string) => void;
    onSend: (files?: File[]) => void;
    isLoading?: boolean;
}

export function InputGroupCustom({ textValue, onTextChange, onSend, isLoading }: InputGroupCustomProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Limit to 5 files
        const newFiles = [...selectedFiles, ...files].slice(0, 5);
        setSelectedFiles(newFiles);

        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const removeFile = (index: number) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);

        URL.revokeObjectURL(previews[index]);
        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSendInternal = () => {
        onSend(selectedFiles);
        // Reset after send
        setSelectedFiles([]);
        setPreviews([]);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-2">
            <div className={cn('relative flex flex-col w-full rounded-2xl border bg-card shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 overflow-hidden', isLoading && 'opacity-70 pointer-events-none')}>
                {/* Preview Area */}
                {previews.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border-b">
                        {previews.map((src, index) => (
                            <div key={index} className="relative group size-16 rounded-lg overflow-hidden border bg-background">
                                <img src={src} alt="preview" className="size-full object-cover" />
                                <button onClick={() => removeFile(index)} className="absolute top-0.5 right-0.5 size-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="size-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-end px-1 py-1">
                    {/* File Upload Button */}
                    <div className="flex items-center pb-1 pl-1">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
                        <Button type="button" variant="ghost" size="icon" className="size-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => fileInputRef.current?.click()}>
                            <ImagePlus className="size-5" />
                        </Button>
                    </div>

                    {/* Textarea */}
                    <TextareaAutosize
                        className="flex-1 min-h-[44px] max-h-48 w-full resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground/60"
                        placeholder="Tulis deskripsi atau lampirkan foto kulit..."
                        value={textValue}
                        onChange={(e) => onTextChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendInternal();
                            }
                        }}
                    />

                    {/* Send Button */}
                    <div className="pb-1 pr-1">
                        <Button size="icon" disabled={(!textValue.trim() && selectedFiles.length === 0) || isLoading} onClick={handleSendInternal} className="size-9 rounded-xl shadow-lg shadow-primary/20">
                            <Send className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Hint */}
            <div className="flex justify-between px-2">
                <p className="text-[10px] text-muted-foreground/60 font-medium">Shift + Enter untuk baris baru</p>
                {selectedFiles.length > 0 && <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{selectedFiles.length}/5 Foto Terpilih</p>}
            </div>
        </div>
    );
}
