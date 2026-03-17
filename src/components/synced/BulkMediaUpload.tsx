// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/BulkMediaUpload.tsx
// Last synced: 2026-03-17T11:17:26.980Z
// API integrations stripped. Use props for data and callbacks.
'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Card } from '@/components/base/card/card';
import { ProgressBar } from '@/components/base/progress-indicators/progress-indicators';

interface BulkMediaUploadProps {
  onUploadComplete?: (uploaded: UploadedMedia[]) => void;
  folder?: string; // Optional folder name for ImageKit (e.g., 'agenda-items')
}

export interface UploadedMedia {
  fileId: string;
  name: string;
  size: number;
  versionInfo: {
    id: string;
    name: string;
  };
  filePath: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
  thumbnailUrl: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  response?: UploadedMedia;
  error?: string;
}

// Simple skeleton placeholder component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

export const BulkMediaUpload: React.FC<BulkMediaUploadProps> = ({
  onUploadComplete,
  folder,
}) => {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const filesRef = useRef<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update setFiles to also update the ref
  const updateFiles = (updater: (prev: UploadingFile[]) => UploadingFile[]) => {
    setFiles(prev => {
      const updated = updater(prev);
      filesRef.current = updated;
      return updated;
    });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length === 0) return;

    // Prepare new UploadingFile objects
    const newFiles: UploadingFile[] = selected.map(file => ({
      file,
      progress: 0,
      status: 'idle',
    }));

    // Append new files
    updateFiles(prev => [...prev, ...newFiles]);

    // Reset input
    if (inputRef.current) inputRef.current.value = '';
  };

  // Upload function using XHR for progress
  const uploadFile = (
    file: File,
    onProgress: (percent: number) => void,
  ): Promise<UploadedMedia> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      // Add folder parameter if provided
      if (folder) {
        formData.append('folder', folder);
      }
      xhr.open('POST', '/api/imagekit');
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            console.error('Invalid response from server', e);
            reject('Invalid response from server');
          }
        } else {
          reject('Upload failed');
        }
      };
      xhr.onerror = () => reject('Network error');
      xhr.send(formData);
    });
  };

  // Effect to upload files with status 'idle'
  useEffect(() => {
    files.forEach((fileObj, idx) => {
      if (fileObj.status === 'idle') {
        // Mark as uploading
        updateFiles(prev => {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], status: 'uploading', progress: 0 };
          return updated;
        });

        // Start upload directly with XHR
        uploadFile(fileObj.file, percent => {
          updateFiles(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], progress: percent };
            return updated;
          });
        })
          .then(data => {
            updateFiles(prev => {
              const updated = [...prev];
              updated[idx] = {
                ...updated[idx],
                status: 'success',
                progress: 100,
                response: data,
              };
              return updated;
            });
          })
          .catch(error => {
            console.error('Upload error for file at index', idx, ':', error);
            updateFiles(prev => {
              const updated = [...prev];
              updated[idx] = {
                ...updated[idx],
                status: 'error',
                error: (error as Error).message || 'Upload failed',
              };
              return updated;
            });
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // Effect to call onUploadComplete when all uploads are done
  useEffect(() => {
    if (
      files.length > 0 &&
      files.every(f => f.status === 'success') &&
      onUploadComplete
    ) {
      const uploadedMedia = files
        .map(f => f.response)
        .filter(Boolean) as UploadedMedia[];
      onUploadComplete(uploadedMedia);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, onUploadComplete]);

  // UI
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex justify-center">
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          color="secondary"
          size="md"
          aria-label="Select media files"
          className="text-xs sm:text-sm"
        >
          Select Media
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
        {files.map((fileObj, idx) => (
          <Card
            key={idx}
            className="relative flex min-h-[100px] flex-col items-center p-2 sm:min-h-[120px]"
          >
            {fileObj.status === 'uploading' && (
              <>
                <Skeleton className="mb-2 h-24 w-full" />
                <ProgressBar value={fileObj.progress} className="w-full" />
              </>
            )}
            {fileObj.status === 'idle' && (
              <Skeleton className="mb-2 h-24 w-full" />
            )}
            {fileObj.status === 'success' && fileObj.response && (
              <>
                <img
                  src={fileObj.response.thumbnailUrl || fileObj.response.url}
                  alt={fileObj.response.name}
                  className="mb-2 h-24 w-full rounded object-cover"
                  onError={e => {
                    console.error(
                      'Image failed to load:',
                      fileObj.response?.name,
                      e,
                    );
                    // Fallback to main URL if thumbnail fails
                    if (fileObj.response?.url) {
                      e.currentTarget.src = fileObj.response.url;
                    }
                  }}
                />
                <div className="w-full truncate text-center text-xs break-all px-1">
                  {fileObj.response.name}
                </div>
              </>
            )}
            {fileObj.status === 'error' && (
              <div className="mb-2 flex h-24 w-full items-center justify-center rounded bg-red-100 text-xs text-red-600">
                Error
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BulkMediaUpload;
