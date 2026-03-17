"use client";

import React, { useState } from "react";
import { Grid01, Play, Image01, Link01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";

interface MediaItem {
    id: string;
    type: "image" | "video";
    src: string;
    isYouTube?: boolean;
    width?: number;
    height?: number;
}

interface GalleryPreviewProps {
    /** Media items to display in the preview grid */
    items?: MediaItem[];
    /** Whether the gallery is loading */
    isLoading?: boolean;
    /** Error message to display */
    error?: string;
    /** Total number of items (for the count display) */
    totalCount?: number;
    /** When false, hide upload controls */
    showUpload?: boolean;
    /** Callback when "View Full Gallery" is clicked */
    onViewGallery?: () => void;
    /** Callback when upload type is selected */
    onUpload?: (type: "image" | "youtube") => void;
    /** When true, disables the "View Full Gallery" button */
    disableViewGallery?: boolean;
    /** When true, hides the gallery title header */
    hideTitle?: boolean;
    /** Optional class for the root wrapper */
    className?: string;
}

const GalleryPreview = ({
    items = [],
    isLoading = false,
    error,
    totalCount,
    showUpload = true,
    onViewGallery,
    onUpload,
    disableViewGallery = false,
    hideTitle = false,
    className,
}: GalleryPreviewProps) => {
    const uploadTypeOptions = [
        {
            id: "image",
            label: "Upload Images",
            icon: <Image01 className="size-4" /> as React.ReactNode,
        },
        {
            id: "youtube",
            label: "Add YouTube Video",
            icon: <Link01 className="size-4" /> as React.ReactNode,
        },
    ];

    const hasMedia = items.length > 0;
    const previewItems = items.slice(0, 9);
    const displayCount = totalCount ?? items.length;

    const handleUploadTypeSelect = (type: string) => {
        if (onUpload) {
            onUpload(type as "image" | "youtube");
        }
    };

    return (
        <div
            className={`rounded-lg border border-secondary bg-primary p-4 w-full shadow-xs ${className ?? ""}`}
        >
            {/* Header */}
            {!hideTitle && (
                <div className="flex items-center justify-between w-full mb-4 gap-3 flex-nowrap">
                    <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
                        <h2 className="text-md font-semibold text-primary leading-6 whitespace-nowrap">
                            Photos & Videos
                        </h2>
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-tertiary border-t-brand-solid rounded-full animate-spin flex-shrink-0" />
                        )}
                        {hasMedia && (
                            <span className="text-sm text-tertiary whitespace-nowrap">
                                ({displayCount} item{displayCount !== 1 ? "s" : ""})
                            </span>
                        )}
                    </div>
                    {showUpload && (
                        <div className="flex-shrink-0 max-w-[140px]">
                            <Select
                                placeholder="Upload"
                                items={uploadTypeOptions}
                                onSelectionChange={(key) => {
                                    if (key) handleUploadTypeSelect(key as string);
                                }}
                                popoverClassName="min-w-[180px]"
                            >
                                {(item) => (
                                    <Select.Item key={item.id} id={item.id}>
                                        <div className="flex items-center gap-2">
                                            {item.icon as React.ReactNode}
                                            {item.label}
                                        </div>
                                    </Select.Item>
                                )}
                            </Select>
                        </div>
                    )}
                </div>
            )}

            {error ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <p className="text-sm font-medium text-error-primary">
                        Failed to load photos & videos
                    </p>
                    <p className="text-xs text-center max-w-sm text-tertiary">{error}</p>
                </div>
            ) : !hasMedia && !isLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <p className="text-sm text-tertiary text-center max-w-[335px]">
                        {showUpload
                            ? "Start by adding your first photo or video"
                            : "Nothing here yet. Check back soon!"}
                    </p>
                </div>
            ) : hasMedia ? (
                <div className="flex flex-col gap-4">
                    {/* Grid */}
                    <div className="grid grid-cols-3 gap-1.5">
                        {previewItems.map((item) => (
                            <div
                                key={item.id}
                                className={`relative rounded-lg overflow-hidden bg-secondary aspect-square ${
                                    !disableViewGallery ? "cursor-pointer hover:opacity-90" : ""
                                }`}
                                onClick={onViewGallery}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.src}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {item.type === "video" && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                        <div className="backdrop-blur bg-white/30 flex items-center justify-center rounded-full size-10 shadow">
                                            <Play className="size-4 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* View Full Gallery */}
                    <Button
                        size="sm"
                        color="secondary"
                        iconLeading={Grid01}
                        onClick={onViewGallery}
                        isDisabled={disableViewGallery}
                        className="w-full"
                    >
                        View All Photos and Videos
                    </Button>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="w-8 h-8 border-2 border-tertiary border-t-brand-solid rounded-full animate-spin" />
                    <p className="text-sm text-tertiary">Loading photos & videos...</p>
                </div>
            ) : null}
        </div>
    );
};

export default GalleryPreview;
