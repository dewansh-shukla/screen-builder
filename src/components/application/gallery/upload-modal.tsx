"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload01, Image01, VideoRecorder, CheckCircle, AlertCircle, Link01 } from "@untitledui/icons";
import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    uploadType: "image" | "video";
    /** Called when files are submitted for upload */
    onUpload?: (files: File[], captions: Record<string, string>) => void;
    /** Called when a YouTube URL is submitted */
    onYouTubeSubmit?: (url: string, caption: string) => void;
    /** Initial upload mode for video uploads */
    initialUploadMode?: "file" | "youtube";
}

const UploadModal = ({
    isOpen,
    onClose,
    uploadType,
    onUpload,
    onYouTubeSubmit,
    initialUploadMode,
}: UploadModalProps) => {
    const [caption, setCaption] = useState("");
    const [captions, setCaptions] = useState<Record<string, string>>({});
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMode, setUploadMode] = useState<"file" | "youtube">(
        uploadType === "video" ? "youtube" : initialUploadMode || "file",
    );
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [youtubeError, setYoutubeError] = useState("");

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter((file) =>
            uploadType === "image" ? file.type.startsWith("image/") : file.type.startsWith("video/"),
        );
        setSelectedFiles(validFiles);
        if (uploadType === "image") {
            validFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setImagePreviews((prev) => ({ ...prev, [file.name]: e.target!.result as string }));
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeFile = (fileName: string) => {
        setSelectedFiles((prev) => prev.filter((f) => f.name !== fileName));
        setImagePreviews((prev) => {
            const next = { ...prev };
            delete next[fileName];
            return next;
        });
        setCaptions((prev) => {
            const next = { ...prev };
            delete next[fileName];
            return next;
        });
    };

    useEffect(() => {
        return () => {
            Object.values(imagePreviews).forEach((url) => {
                if (url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
        };
    }, [imagePreviews]);

    const resetState = () => {
        setCaption("");
        setCaptions({});
        setSelectedFiles([]);
        setImagePreviews({});
        setIsDragOver(false);
        setIsUploading(false);
        setUploadMode(uploadType === "video" ? "youtube" : initialUploadMode || "file");
        setYoutubeUrl("");
        setYoutubeError("");
    };

    useEffect(() => {
        if (isOpen) {
            if (uploadType === "video") setUploadMode("youtube");
            else if (initialUploadMode) setUploadMode(initialUploadMode);
        }
    }, [isOpen, initialUploadMode, uploadType]);

    const handleClose = () => {
        if (!isUploading) {
            resetState();
            onClose();
        }
    };

    const isUploadEnabled =
        ((uploadMode === "file" && selectedFiles.length > 0) ||
            (uploadMode === "youtube" && youtubeUrl.trim() !== "")) &&
        !isUploading;

    const handleYoutubeUrlChange = (url: string) => {
        setYoutubeUrl(url);
        if (url.trim() === "") {
            setYoutubeError("");
            return;
        }
        // Simple YouTube URL validation
        const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/;
        if (!ytRegex.test(url)) {
            setYoutubeError("Please enter a valid YouTube URL");
        } else {
            setYoutubeError("");
        }
    };

    const handleUpload = async () => {
        setIsUploading(true);
        try {
            if (uploadMode === "youtube" && onYouTubeSubmit) {
                onYouTubeSubmit(youtubeUrl, caption);
            } else if (uploadMode === "file" && onUpload) {
                onUpload(selectedFiles, captions);
            }
            setTimeout(handleClose, 500);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
            <Modal>
                <Dialog>
                    <div
                        className={`bg-primary rounded-2xl shadow-xl mx-auto transition-all duration-200 ${
                            selectedFiles.length > 0 ? "w-[600px]" : "w-[361px]"
                        }`}
                    >
                        {/* Header */}
                        <div className="flex flex-col items-center relative w-full">
                            <div className="flex flex-col gap-4 items-start pt-5 px-4 w-full">
                                <h3 className="text-md font-semibold text-primary leading-6 w-full">
                                    {uploadType === "image" ? "Upload Photos" : "Add YouTube Video"}
                                </h3>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isUploading}
                                className="absolute flex items-center justify-center p-2 right-3 rounded-lg size-11 top-3"
                            >
                                <X className="size-6 text-fg-quaternary" />
                            </button>
                            <div className="h-5 w-full" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-2.5 items-start px-4 w-full">
                            {uploadType === "video" || uploadMode === "youtube" ? (
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-sm font-medium text-secondary">YouTube Video URL</label>
                                        <input
                                            type="text"
                                            value={youtubeUrl}
                                            onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                                                youtubeError ? "border-error" : "border-primary"
                                            }`}
                                            disabled={isUploading}
                                        />
                                        {youtubeError && <p className="text-error-primary text-xs">{youtubeError}</p>}
                                        <p className="text-xs text-tertiary">
                                            Paste a YouTube video link (e.g., youtube.com/watch?v=... or youtu.be/...)
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-sm font-medium text-secondary">
                                            Caption <span className="text-xs text-tertiary">(optional)</span>
                                        </label>
                                        <textarea
                                            value={caption}
                                            onChange={(e) => e.target.value.length <= 1024 && setCaption(e.target.value)}
                                            placeholder="Add a caption for your video"
                                            className="w-full px-3 py-2 border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                                            rows={3}
                                            disabled={isUploading}
                                        />
                                    </div>
                                </div>
                            ) : selectedFiles.length === 0 ? (
                                <div
                                    className={`rounded-xl border w-full px-6 py-4 ${
                                        isDragOver ? "bg-brand-section_subtle border-brand" : "border-secondary"
                                    }`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragOver(true);
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        setIsDragOver(false);
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragOver(false);
                                        handleFileSelect(e.dataTransfer.files);
                                    }}
                                >
                                    <div className="flex flex-col gap-3 items-center w-full">
                                        <FeaturedIcon
                                            icon={
                                                uploadType === "image" ? (
                                                    <Image01 className="size-5" />
                                                ) : (
                                                    <VideoRecorder className="size-5" />
                                                )
                                            }
                                            size="md"
                                            color="gray"
                                            theme="modern"
                                        />
                                        <div className="flex flex-col gap-1 items-center w-full">
                                            <div className="flex gap-1 items-center">
                                                <label className="text-sm font-semibold text-brand-secondary hover:underline cursor-pointer">
                                                    Choose files
                                                    <input
                                                        type="file"
                                                        multiple={uploadType === "image"}
                                                        accept={uploadType === "image" ? "image/*" : "video/*"}
                                                        onChange={(e) => handleFileSelect(e.target.files)}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <span className="text-sm text-tertiary">or drag and drop</span>
                                            </div>
                                            <p className="text-xs text-tertiary text-center">
                                                {uploadType === "image"
                                                    ? "JPG, PNG, GIF (max. 10MB each)"
                                                    : "MP4, MOV, AVI (max. 100MB each)"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-sm font-medium text-brand-secondary">
                                            {selectedFiles.length} image{selectedFiles.length > 1 ? "s" : ""} selected
                                        </p>
                                        <label className="text-sm font-semibold text-brand-secondary hover:underline cursor-pointer">
                                            Add more
                                            <input
                                                type="file"
                                                multiple
                                                accept={uploadType === "image" ? "image/*" : "video/*"}
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        const dt = new DataTransfer();
                                                        selectedFiles.forEach((f) => dt.items.add(f));
                                                        Array.from(e.target.files).forEach((f) => dt.items.add(f));
                                                        handleFileSelect(dt.files);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <div className="flex flex-col gap-4 w-full max-h-[500px] overflow-y-auto">
                                        {selectedFiles.map((file) => (
                                            <div
                                                key={file.name}
                                                className="border border-secondary rounded-lg bg-primary p-4 flex flex-col gap-3 shadow-xs relative"
                                            >
                                                <button
                                                    onClick={() => removeFile(file.name)}
                                                    className="absolute top-2 right-2 z-10 bg-error-solid text-white rounded-full p-1.5"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                {imagePreviews[file.name] && (
                                                    <div className="w-full rounded-lg overflow-hidden bg-secondary" style={{ maxHeight: "300px" }}>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={imagePreviews[file.name]}
                                                            alt={file.name}
                                                            className="w-full h-auto object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <p className="text-sm text-tertiary truncate">{file.name}</p>
                                                <textarea
                                                    value={captions[file.name] || ""}
                                                    onChange={(e) =>
                                                        e.target.value.length <= 1024 &&
                                                        setCaptions((prev) => ({ ...prev, [file.name]: e.target.value }))
                                                    }
                                                    placeholder="Add a caption (optional)"
                                                    className="w-full px-3 py-2 text-sm border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                                                    rows={2}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="pt-6 pb-4 px-4 w-full">
                            <button
                                disabled={!isUploadEnabled}
                                onClick={handleUpload}
                                className={`flex gap-1.5 items-center justify-center px-4 py-2.5 w-full rounded-lg text-md font-semibold leading-6 ${
                                    isUploadEnabled
                                        ? "bg-brand-solid text-white hover:bg-brand-solid_hover"
                                        : "bg-disabled text-disabled cursor-not-allowed"
                                }`}
                            >
                                {isUploading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Upload01 className="size-5" />
                                )}
                                {isUploading
                                    ? "Uploading..."
                                    : uploadMode === "youtube"
                                      ? "Add YouTube Video"
                                      : `Upload${selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ""}`}
                            </button>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default UploadModal;
