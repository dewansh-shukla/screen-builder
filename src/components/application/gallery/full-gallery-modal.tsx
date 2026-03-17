"use client";

import { useState, useEffect } from "react";
import { X, PlusCircle, Trash01, Play, VolumeMax, Maximize01 } from "@untitledui/icons";
import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";

interface MediaItem {
    id: string;
    type: 'image' | 'video';
    src: string;
    isYouTube?: boolean;
    youtubeUrl?: string;
}

interface FullGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    mediaItems: MediaItem[];
    onUpload: () => void;
    onDelete: () => void;
    galleryId?: string;
    showUpload?: boolean;
}

const FullGalleryModal = ({ isOpen, onClose, mediaItems, onUpload, onDelete, showUpload = true }: FullGalleryModalProps) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Handle browser back button
    useEffect(() => {
        if (!isOpen) return;

        const handlePopState = () => {
            onClose();
        };

        // Add a history entry when modal opens
        window.history.pushState({ modal: 'full-gallery' }, '');
        
        // Listen for popstate events
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isOpen, onClose]);

    const renderMediaItem = (item: MediaItem) => {
        const isSelected = selectedItems.includes(item.id);
        const isVideo = item.type === 'video' || item.isYouTube;
        
        // Render regular image or video (including YouTube videos with thumbnail)
        return (
            <div
                key={item.id}
                className={`bg-center bg-cover bg-no-repeat aspect-square rounded-lg w-full relative cursor-pointer ${
                    isSelected ? 'ring-2 ring-[#7f56d9]' : ''
                }`}
                style={{ backgroundImage: `url('${item.src}')` }}
                onClick={() => {
                    if (selectedItems.includes(item.id)) {
                        setSelectedItems(selectedItems.filter(id => id !== item.id));
                    } else {
                        setSelectedItems([...selectedItems, item.id]);
                    }
                }}
            >
                {isVideo && (
                    <div className="relative size-full">
                        <div className="absolute bg-black/10 inset-0 flex items-center justify-center">
                            <div className="backdrop-blur bg-white/30 flex items-center justify-center rounded-full size-10 sm:size-12">
                                <Play className="size-4 text-white" />
                            </div>
                        </div>
                        <div className="absolute bg-gradient-to-b from-transparent to-black/30 bottom-0 left-0 right-0 pb-1 pt-2 px-1">
                            <div className="flex gap-0.5 items-center justify-start w-full">
                                <div className="flex gap-0.5 items-center justify-start grow">
                                    <button className="flex items-center justify-center p-1 rounded-sm">
                                        <Play className="size-3 text-white" />
                                    </button>
                                    <button className="flex items-center justify-center p-1 rounded-sm">
                                        <VolumeMax className="size-3 text-white" />
                                    </button>
                                </div>
                                <button className="flex items-center justify-center p-1 rounded-sm">
                                    <Maximize01 className="size-3 text-white" />
                                </button>
                            </div>
                        </div>
                        <div className="absolute border border-black/10 inset-0 pointer-events-none rounded-lg" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
            <Modal>
                <Dialog>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex flex-col items-center justify-start relative w-full flex-shrink-0">
                            <div className="flex flex-col gap-4 items-start justify-start pb-0 pt-4 sm:pt-5 px-4 relative w-full">
                                <div className="flex flex-col gap-0.5 items-start justify-start relative w-full">
                                    <h3 className="text-[#181d27] text-sm sm:text-md font-semibold font-lexend leading-5 sm:leading-6 w-full">
                                        Photos & Videos
                                    </h3>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute flex items-center justify-center p-2 right-3 rounded-lg size-10 sm:size-11 top-3"
                            >
                                <X className="size-5 sm:size-6 text-[#a4a7ae]" />
                            </button>
                        </div>

                        {/* Gallery Content */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 relative w-full flex-1 overflow-y-auto">
                            {mediaItems.map((item) => renderMediaItem(item))}
                        </div>

                        {/* Modal Actions - Only show for hosts */}
                        {(showUpload || selectedItems.length > 0) && (
                            <div className="flex flex-col items-start justify-start pb-0 pt-4 sm:pt-6 px-0 relative w-full flex-shrink-0">
                                <div className="flex flex-col gap-3 items-start justify-start pb-4 pt-0 px-4 relative w-full">
                                    {/* Upload Button - Only for hosts */}
                                    {showUpload && (
                                        <div className="bg-[#7f56d9] relative rounded-lg w-full">
                                            <button
                                                onClick={onUpload}
                                                className="flex gap-1.5 items-center justify-center px-4 py-2.5 w-full text-white text-sm sm:text-md font-semibold font-lexend leading-5 sm:leading-6"
                                            >
                                                <PlusCircle className="size-4 sm:size-5" />
                                                Upload
                                            </button>
                                            <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_0px_1px_inset_rgba(10,13,18,0.18),0px_-2px_0px_0px_inset_rgba(10,13,18,0.05)]" />
                                            <div className="absolute border-2 border-white/12 inset-0 pointer-events-none rounded-lg shadow-xs" />
                                        </div>
                                    )}

                                    {/* Bin Button - Only for hosts */}
                                    {showUpload && (
                                        <div className="bg-white relative rounded-lg w-full">
                                            <button
                                                onClick={onDelete}
                                                className="flex gap-1.5 items-center justify-center px-4 py-2.5 w-full text-[#414651] text-sm sm:text-md font-semibold font-lexend leading-5 sm:leading-6"
                                            >
                                                <Trash01 className="size-4 sm:size-5" />
                                                Bin({selectedItems.length})
                                            </button>
                                            <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_0px_1px_inset_rgba(10,13,18,0.18),0px_-2px_0px_0px_inset_rgba(10,13,18,0.05)]" />
                                            <div className="absolute border border-[#d5d7da] inset-0 pointer-events-none rounded-lg shadow-xs" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default FullGalleryModal;
