import { useEffect, useState } from 'react';
import { formatBytes, useFileUpload, type FileMetadata, type FileWithPreview } from '@/hooks/use-file-upload';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/reui/alert';
import { Badge } from '@/components/reui/badge';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, VideoIcon, HeadphonesIcon, FileTextIcon, FileSpreadsheetIcon, FileArchiveIcon, UploadIcon, XIcon, CircleAlertIcon, RefreshCwIcon } from 'lucide-react';

interface FileUploadItem extends FileWithPreview {
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    error?: string;
}

interface ProgressUploadProps {
    maxFiles?: number;
    maxSize?: number;
    accept?: string;
    multiple?: boolean;
    className?: string;
    onFilesChange?: (files: FileWithPreview[]) => void;
    simulateUpload?: boolean;
}

export function FileUpload({
    maxFiles = 5,
    maxSize = 10 * 1024 * 1024, // 10MB
    accept = '*',
    multiple = true,
    className,
    onFilesChange,
    simulateUpload = false,
}: ProgressUploadProps) {
    const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);

    const [{ isDragging, errors }, { removeFile, clearFiles, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }] = useFileUpload({
        maxFiles,
        maxSize,
        accept,
        multiple,
        initialFiles: [],
        onFilesChange: (newFiles) => {
            // Convert to upload items when files change, preserving existing status
            const newUploadFiles = newFiles.map((file) => {
                // Check if this file already exists in uploadFiles
                const existingFile = uploadFiles.find((existing) => existing.id === file.id);

                if (existingFile) {
                    // Preserve existing file status and progress
                    return {
                        ...existingFile,
                        ...file, // Update any changed properties from the file
                    };
                } else {
                    // New file - set to completed if no simulation, otherwise uploading
                    return {
                        ...file,
                        progress: simulateUpload ? 0 : 100,
                        status: simulateUpload ? ('uploading' as const) : ('completed' as const),
                    };
                }
            });
            setUploadFiles(newUploadFiles);
            onFilesChange?.(newFiles);
        },
    });

    // Simulate upload progress if enabled
    useEffect(() => {
        if (!simulateUpload) return;

        const interval = setInterval(() => {
            setUploadFiles((prev) => {
                const next = prev.map((file) => {
                    if (file.status !== 'uploading') return file;

                    const increment = Math.random() * 15 + 5; // 5-20% increment
                    const newProgress = Math.min(file.progress + increment, 100);

                    // Simulate occasional errors (10% chance when progress > 50%)
                    if (newProgress > 50 && Math.random() < 0.1) {
                        return {
                            ...file,
                            status: 'error' as const,
                            error: 'Upload failed. Please try again.',
                        };
                    }

                    // Complete when progress reaches 100%
                    if (newProgress >= 100) {
                        return {
                            ...file,
                            progress: 100,
                            status: 'completed' as const,
                        };
                    }

                    return {
                        ...file,
                        progress: newProgress,
                    };
                });
                onFilesChange?.(next as any);
                return next;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [simulateUpload, onFilesChange]);

    const retryUpload = (fileId: string) => {
        setUploadFiles((prev) =>
            prev.map((file) =>
                file.id === fileId
                    ? {
                          ...file,
                          progress: 0,
                          status: 'uploading' as const,
                          error: undefined,
                      }
                    : file,
            ),
        );
    };

    const removeUploadFile = (fileId: string) => {
        setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
        removeFile(fileId);
    };

    const getFileIcon = (file: File | FileMetadata) => {
        const type = file instanceof File ? file.type : file.type;
        if (type.startsWith('image/')) return <ImageIcon className="size-4" />;
        if (type.startsWith('video/')) return <VideoIcon className="size-4" />;
        if (type.startsWith('audio/')) return <HeadphonesIcon className="size-4" />;
        if (type.includes('pdf')) return <FileTextIcon className="size-4" />;
        if (type.includes('word') || type.includes('doc')) return <FileTextIcon className="size-4" />;
        if (type.includes('excel') || type.includes('sheet')) return <FileSpreadsheetIcon className="size-4" />;
        if (type.includes('zip') || type.includes('rar')) return <FileArchiveIcon className="size-4" />;
        return <FileTextIcon className="size-4" />;
    };

    const completedCount = uploadFiles.filter((f) => f.status === 'completed').length;
    const errorCount = uploadFiles.filter((f) => f.status === 'error').length;
    const uploadingCount = uploadFiles.filter((f) => f.status === 'uploading').length;

    return (
        <div className={cn('w-full mx-auto', className)}>
            {/* Upload Area */}
            <div className={cn('rounded-2xl relative border border-dashed p-8 text-center transition-colors', isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50')} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
                <input {...getInputProps()} className="sr-only" />

                <div className="flex flex-col items-center gap-4">
                    <div className={cn('flex h-16 w-16 items-center justify-center rounded-full shadow-inner', isDragging ? 'bg-primary/10' : 'bg-muted/50')}>
                        <UploadIcon className={cn('h-6 w-6', isDragging ? 'text-primary animate-bounce' : 'text-muted-foreground')} />
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-lg font-bold">Unggah Gambar Kulit</h3>
                        <p className="text-muted-foreground text-sm">Tarik & letakkan foto di sini atau klik untuk mencari</p>
                        <p className="text-muted-foreground text-xs opacity-60">Format: JPG, PNG, WEBP (Maks. {formatBytes(maxSize)})</p>
                    </div>

                    <Button onClick={openFileDialog} className="rounded-full px-8 font-bold">
                        Pilih Foto
                    </Button>
                </div>
            </div>

            {/* File List */}
            {uploadFiles.length > 0 && (
                <div className="mt-4 space-y-3">
                    {uploadFiles.map((fileItem: FileUploadItem) => (
                        <div key={fileItem.id} className="border-border bg-card rounded-xl border p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-3">
                                {/* File Icon */}
                                <div className="shrink-0">{fileItem.preview && fileItem.file.type.startsWith('image/') ? <img src={fileItem.preview} alt={fileItem.file.name} className="rounded-lg h-12 w-12 border object-cover shadow-sm" /> : <div className="border-border text-muted-foreground rounded-lg flex h-12 w-12 items-center justify-center border bg-muted/30">{getFileIcon(fileItem.file)}</div>}</div>

                                {/* File Info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col truncate">
                                            <span className="text-sm font-semibold truncate">{fileItem.file.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{formatBytes(fileItem.file.size)}</span>
                                        </div>
                                        <Button onClick={() => removeUploadFile(fileItem.id)} variant="ghost" size="icon" className="text-muted-foreground size-8 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full">
                                            <XIcon className="size-4" />
                                        </Button>
                                    </div>

                                    {/* Progress Bar */}
                                    {fileItem.status === 'uploading' && (
                                        <div className="mt-2">
                                            <Progress value={fileItem.progress} className="h-1" />
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {fileItem.status === 'error' && fileItem.error && (
                                        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-destructive bg-destructive/5 p-2 rounded-lg border border-destructive/10">
                                            <div className="flex items-center gap-2">
                                                <CircleAlertIcon className="size-3" />
                                                <span>{fileItem.error}</span>
                                            </div>
                                            <Button onClick={() => retryUpload(fileItem.id)} variant="ghost" size="icon" className="size-5 hover:bg-transparent">
                                                <RefreshCwIcon className="size-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Global Errors */}
            {errors.length > 0 && (
                <Alert variant="destructive" className="mt-4 rounded-xl">
                    <CircleAlertIcon className="size-4" />
                    <AlertTitle className="text-sm font-bold">Terjadi Kesalahan</AlertTitle>
                    <AlertDescription className="text-xs">
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
