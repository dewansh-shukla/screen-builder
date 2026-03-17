"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Download01, ChevronLeft, ChevronRight, Play, Plus, Minus } from "@untitledui/icons";
import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";

interface GalleryItem {
    item_id: string;
    url: string;
    thumbnail_url?: string;
    original_filename: string;
    type: "image" | "video";
    width_px?: number;
    height_px?: number;
    caption_md?: string;
}

interface GalleryPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: GalleryItem[];
    initialIndex: number;
    /** Optional download handler. If not provided, opens URL in new tab. */
    onDownload?: (item: GalleryItem) => void;
}

const GalleryPreviewModal = ({
    isOpen,
    onClose,
    items,
    initialIndex,
    onDownload,
}: GalleryPreviewModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentItem = items[currentIndex];

    useEffect(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, [currentIndex]);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;
            switch (event.key) {
                case "ArrowLeft":
                    event.preventDefault();
                    goToPrevious();
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    goToNext();
                    break;
                case "Escape":
                    event.preventDefault();
                    onClose();
                    break;
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, goToNext, goToPrevious, onClose]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1 && currentItem?.type !== "video") {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: position.x + (e.clientX - dragStart.x),
                y: position.y + (e.clientY - dragStart.y),
            });
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleZoomIn = () => setScale(Math.min(5, scale + 0.5));
    const handleZoomOut = () => {
        const newScale = Math.max(1, scale - 0.5);
        setScale(newScale);
        if (newScale === 1) setPosition({ x: 0, y: 0 });
    };
    const handleResetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleDoubleClick = () => {
        if (currentItem?.type === "video") return;
        if (scale === 1) setScale(2);
        else handleResetZoom();
    };

    const handleDownload = () => {
        if (!currentItem) return;
        if (onDownload) {
            onDownload(currentItem);
        } else {
            window.open(currentItem.url, "_blank");
        }
    };

    if (!currentItem) return null;

    const isVideo = currentItem.type === "video";

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
            <Modal className="!p-0 !max-w-none !max-h-none !w-full !h-full">
                <Dialog className="!p-0 !max-w-none !max-h-none !w-full !h-full !rounded-none">
                    <div className="relative w-full h-full bg-[#181d27] overflow-hidden">
                        <div className="absolute inset-0 bg-[#0a0d12] opacity-70" />

                        {/* Navigation arrows */}
                        {items.length > 1 && (
                            <>
                                {currentIndex > 0 && (
                                    <button
                                        onClick={goToPrevious}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-2 transition-colors"
                                    >
                                        <ChevronLeft className="size-5 text-white" />
                                    </button>
                                )}
                                {currentIndex < items.length - 1 && (
                                    <button
                                        onClick={goToNext}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-2 transition-colors"
                                    >
                                        <ChevronRight className="size-5 text-white" />
                                    </button>
                                )}
                            </>
                        )}

                        {/* Action buttons */}
                        <div className="absolute top-0 right-0 z-50 flex gap-4 items-center justify-end px-4 py-6">
                            {!isVideo && (
                                <div className="flex gap-2 items-center bg-black/50 backdrop-blur-sm rounded-lg p-1">
                                    <button
                                        onClick={handleZoomOut}
                                        disabled={scale <= 1}
                                        className="bg-white/90 hover:bg-white disabled:opacity-50 flex items-center justify-center rounded size-8 transition-colors"
                                    >
                                        <Minus className="size-4 text-gray-700" />
                                    </button>
                                    <span className="text-white text-xs font-medium min-w-[45px] text-center">
                                        {Math.round(scale * 100)}%
                                    </span>
                                    <button
                                        onClick={handleZoomIn}
                                        disabled={scale >= 5}
                                        className="bg-white/90 hover:bg-white disabled:opacity-50 flex items-center justify-center rounded size-8 transition-colors"
                                    >
                                        <Plus className="size-4 text-gray-700" />
                                    </button>
                                    {scale > 1 && (
                                        <button
                                            onClick={handleResetZoom}
                                            className="bg-white/90 hover:bg-white flex items-center justify-center rounded size-8 transition-colors ml-1"
                                        >
                                            <span className="text-gray-700 text-xs font-bold">1:1</span>
                                        </button>
                                    )}
                                </div>
                            )}
                            {!isVideo && (
                                <button
                                    onClick={handleDownload}
                                    className="bg-white/90 hover:bg-white flex items-center justify-center rounded size-10 shadow-xl transition-colors"
                                >
                                    <Download01 className="size-6 text-gray-700" />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="bg-white/90 hover:bg-white flex items-center justify-center rounded size-10 shadow-xl transition-colors"
                            >
                                <X className="size-6 text-gray-700" />
                            </button>
                        </div>

                        {/* Main content */}
                        <div
                            ref={containerRef}
                            className="absolute inset-0 flex items-center justify-center overflow-hidden"
                            style={{
                                paddingTop: "80px",
                                paddingBottom: currentItem.caption_md ? "200px" : "120px",
                                paddingLeft: "16px",
                                paddingRight: "16px",
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <div
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                    cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                                    transform: `translate(${position.x}px, ${position.y}px)`,
                                    transition: isDragging ? "none" : "transform 0.1s ease-out",
                                }}
                            >
                                {isVideo ? (
                                    <div className="w-full h-full max-w-7xl aspect-video">
                                        <video
                                            src={currentItem.url}
                                            controls
                                            className="w-full h-full"
                                            style={{ objectFit: "contain" }}
                                        />
                                    </div>
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        ref={imageRef}
                                        src={currentItem.url}
                                        alt={currentItem.original_filename}
                                        className="block max-w-full max-h-full w-auto h-auto select-none"
                                        draggable={false}
                                        onDoubleClick={handleDoubleClick}
                                        style={{
                                            objectFit: "contain",
                                            transform: `scale(${scale})`,
                                            transformOrigin: "center center",
                                            transition: isDragging ? "none" : "transform 0.2s ease-out",
                                            touchAction: "none",
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Counter */}
                        {items.length > 1 && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                                <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                                    <span className="text-white text-sm font-medium">
                                        {currentIndex + 1} of {items.length}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Caption */}
                        {currentItem.caption_md && (
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 max-w-2xl w-full px-4">
                                <p className="text-white text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words text-left drop-shadow-lg">
                                    {currentItem.caption_md}
                                </p>
                            </div>
                        )}
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default GalleryPreviewModal;
