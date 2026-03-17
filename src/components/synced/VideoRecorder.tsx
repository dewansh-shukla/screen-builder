// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/VideoRecorder.tsx
// Last synced: 2026-03-17T11:05:34.426Z
// API integrations stripped. Use props for data and callbacks.
'use client';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import * as UpChunk from '@mux/upchunk';

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob | string, isExisting: boolean) => void;
  onCancel: () => void;
  existingVideoUrl: string | null;
  uploadUrl?: string | null; // Optional Mux upload URL
  onUploadSuccess?: (assetId: string) => void; // Optional callback for Mux upload success
}

const VideoRecorder = ({
  onRecordingComplete,
  onCancel,
  existingVideoUrl = null,
  uploadUrl = null,
  onUploadSuccess,
}: VideoRecorderProps) => {
  const [recordingState, setRecordingState] = useState<
    'initial' | 'recording' | 'preview'
  >('initial');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60s max
  const [isPlaying, setIsPlaying] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);

  // Initialize with existing video if provided
  useEffect(() => {
    if (existingVideoUrl) {
      setRecordingState('preview');
      // Just use a dummy Blob to indicate we have a video
      setRecordedBlob(new Blob(['dummy'], { type: 'text/plain' }));
    }
  }, [existingVideoUrl]);

  useEffect(() => {
    if (recordingState === 'initial' || recordingState === 'recording') {
      initializeCamera();
    }
    return () => {
      stopMediaTracks();
      clearTimerInterval();
    };
  }, [recordingState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (recordedBlob && previewRef.current) {
      if (existingVideoUrl) {
        previewRef.current.src = existingVideoUrl;
      } else {
        previewRef.current.src = URL.createObjectURL(recordedBlob);
      }
      previewRef.current.onloadedmetadata = () => {
        if (previewRef.current) {
          previewRef.current.play();
        }
      };
    }
    return () => {
      // Store ref value to avoid the warning
      // eslint-disable-line react-hooks/exhaustive-deps
      const currentPreviewRef = previewRef.current;
      if (currentPreviewRef?.src && !existingVideoUrl)
        URL.revokeObjectURL(currentPreviewRef.src); // eslint-disable-line react-hooks/exhaustive-deps
    };
  }, [recordedBlob, existingVideoUrl]);

  useEffect(() => {
    if (recordingState === 'recording') {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime > 0) return prevTime - 1;
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          stopRecording();
          return 0;
        });
      }, 1000);
    } else {
      clearTimerInterval();
    }

    return () => clearTimerInterval();
  }, [recordingState]); // ✅ Runs when recording starts

  // Add event listeners for the video to update play/pause state
  useEffect(() => {
    if (previewRef.current && recordingState === 'preview') {
      const video = previewRef.current;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, [recordingState]);

  const clearTimerInterval = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const initializeCamera = async () => {
    try {
      const constraints = {
        audio: true,
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
          }
        };
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const startRecording = () => {
    chunksRef.current = [];
    if (stream) {
      setTimeLeft(60);
      const options = { mimeType: 'video/mp4; codecs=h264' };

      try {
        mediaRecorderRef.current = new MediaRecorder(stream, options);
      } catch (e) {
        // Fallback if the specified MIME type isn't supported
        console.warn(
          'MP4 recording not supported, falling back to default format',
          e,
        );
        mediaRecorderRef.current = new MediaRecorder(stream);
      }

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        setRecordedBlob(blob);
        setRecordingState('preview');
        stopMediaTracks();
      };
      mediaRecorderRef.current.start();
      setRecordingState('recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setRecordingState('preview');
  };

  const uploadToMux = async (blob: Blob) => {
    if (!uploadUrl) {
      console.error('No Mux upload URL available');
      return false;
    }

    setIsUploading(true);

    try {
      // Convert Blob to File for upchunk
      const file = new File([blob], 'recorded-video.mp4', {
        type: 'video/mp4',
      });

      // Use upchunk for uploading
      const upload = UpChunk.createUpload({
        endpoint: uploadUrl,
        file,
        chunkSize: 5120, // ~5MB chunks
      });

      // Handle upload events
      upload.on('error', err => {
        console.error('Upload error:', err.detail);
        setIsUploading(false);
        return false;
      });

      upload.on('progress', progress => {
        setUploadProgress(progress.detail);
      });

      return new Promise<boolean>(resolve => {
        upload.on('success', () => {
          setIsUploading(false);

          // Extract asset ID from the upload URL
          const assetIdMatch = uploadUrl.match(/\/([^\/]+)$/);
          const assetId = assetIdMatch ? assetIdMatch[1] : 'unknown';

          if (onUploadSuccess) {
            onUploadSuccess(assetId);
          }

          resolve(true);
        });
      });
    } catch (error) {
      console.error('Error during Mux upload:', error);
      setIsUploading(false);
      return false;
    }
  };

  const handleDone = async () => {
    if (recordedBlob) {
      if (existingVideoUrl) {
        // For existing videos, just pass back the URL
        onRecordingComplete(existingVideoUrl, true);
      } else if (uploadUrl && onUploadSuccess) {
        // If Mux integration is enabled, upload to Mux
        const success = await uploadToMux(recordedBlob);

        if (success) {
          // The onUploadSuccess callback will be called from uploadToMux
          // Also call onRecordingComplete for backward compatibility
          onRecordingComplete(recordedBlob, false);
        }
      } else {
        // Original behavior - just return the blob
        onRecordingComplete(recordedBlob, false);
      }
    }
  };

  const handleRecordAgain = () => {
    setRecordedBlob(null);
    setRecordingState('initial');
    setTimeLeft(60);
    setUploadProgress(0);
    setIsUploading(false);
    if (previewRef.current?.src) {
      URL.revokeObjectURL(previewRef.current.src);
      previewRef.current.src = '';
    }
  };

  const stopMediaTracks = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleClose = () => {
    stopMediaTracks();
    clearTimerInterval();
    onCancel();
  };

  const togglePlayPause = () => {
    if (!previewRef.current) return;

    if (previewRef.current.paused) {
      previewRef.current.play();
      setIsPlaying(true);
    } else {
      previewRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white">
        <button
          onClick={handleClose}
          className="absolute bottom-2 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 transform items-center justify-center rounded-full bg-gray-300/90 text-gray-700"
        >
          <X size={20} />
        </button>

        {recordingState === 'initial' && (
          <>
            <div className="relative aspect-[3/4] w-full bg-black">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
              />
            </div>
            <div className="absolute right-0 bottom-[4rem] left-0 flex justify-center px-6">
              <Button
                onClick={startRecording}
                className="w-full rounded-md bg-red-500 py-6 text-base font-medium text-white hover:bg-red-600"
              >
                Start Recording{' '}
                <span className="text-sm opacity-80">(max 60s)</span>
              </Button>
            </div>
          </>
        )}

        {recordingState === 'recording' && (
          <>
            <div className="relative aspect-[3/4] w-full bg-black">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
              />
            </div>
            <div className="absolute right-0 bottom-[4rem] left-0 flex justify-center px-6">
              <Button
                onClick={stopRecording}
                className="w-full rounded-md bg-red-500 py-6 text-base font-medium text-white hover:bg-red-600"
              >
                Stop Recording{' '}
                <span className="text-sm opacity-80">({timeLeft}s left)</span>
              </Button>
            </div>
          </>
        )}

        {recordingState === 'preview' && !isUploading && (
          <>
            <div className="relative aspect-[3/4] w-full bg-black">
              <video
                ref={previewRef}
                className="absolute inset-0 h-full w-full object-cover"
                controls={false}
                loop
                playsInline
                src={existingVideoUrl || undefined}
                onEnded={() => {
                  if (previewRef.current) {
                    previewRef.current.currentTime = 0;
                    previewRef.current.play();
                  }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-lg"
                >
                  {isPlaying ? (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 8H6V16H10V8Z M18 8H14V16H18V8Z"
                        fill="white"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5V19L19 12L8 5Z" fill="white" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="absolute right-0 bottom-[3.5rem] left-0 flex flex-col items-center gap-3 px-6">
              <Button
                onClick={handleDone}
                className="w-full rounded-md bg-red-500 py-6 text-base font-medium text-white hover:bg-red-600"
              >
                Done
              </Button>
              <Button
                onClick={handleRecordAgain}
                className="font-bold text-white hover:bg-transparent"
                variant="ghost"
              >
                Record Again
              </Button>
            </div>
          </>
        )}

        {recordingState === 'preview' && isUploading && (
          <div className="flex h-[500px] flex-col items-center justify-center p-8">
            <div className="mb-4 text-lg font-medium">
              Uploading Video: {uploadProgress.toFixed(1)}%
            </div>
            <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-red-500"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              Please wait while your video uploads...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
