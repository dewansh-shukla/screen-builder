// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/VideoHls.tsx
// Last synced: 2026-03-17T11:05:34.425Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React, { CSSProperties, useEffect, useMemo, useRef } from 'react';
import Hls from 'hls.js';

export interface VideoHlsProps {
  playbackId: string;
  className?: string;
  style?: CSSProperties;
  /** Fired when the underlying video element or HLS instance errors */
  onError?: (error: unknown) => void;
  /** Optional poster image url */
  poster?: string;
  /** Extra attributes forwarded to the video element */
  'data-testid'?: string;
}

/**
 * Lightweight HTML5 video player for Mux HLS streams.
 * - Autoplays, loops, is muted, and has no controls
 * - Uses native HLS on Safari/iOS; hls.js everywhere else
 */
export default function VideoHls({
  playbackId,
  className,
  style,
  onError,
  poster,
  'data-testid': dataTestId,
}: VideoHlsProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sourceUrl = useMemo(
    () => `https://stream.mux.com/${playbackId}.m3u8`,
    [playbackId],
  );

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    let hls: Hls | null = null;

    const startPlayback = async () => {
      try {
        // Try to autoplay; some browsers may block, but muted+playsInline usually passes
        await videoEl.play();
      } catch {
        // Autoplay blocked or other transient error; ignore
      }
    };

    const onVideoError = (e: Event) => {
      onError?.(e);
    };

    videoEl.addEventListener('error', onVideoError);

    // Native HLS support (Safari, iOS)
    if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = sourceUrl;
      const onLoadedMetadata = () => startPlayback();
      videoEl.addEventListener('loadedmetadata', onLoadedMetadata, {
        once: true,
      });
      return () => {
        videoEl.removeEventListener('error', onVideoError);
        videoEl.removeEventListener('loadedmetadata', onLoadedMetadata);
      };
    }

    // hls.js for other browsers
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });
      hls.attachMedia(videoEl);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls?.loadSource(sourceUrl);
      });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        startPlayback();
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        // Only surface fatal errors
        if (data?.fatal) {
          onError?.(data);
        }
      });

      return () => {
        videoEl.removeEventListener('error', onVideoError);
        try {
          hls?.destroy();
        } catch {
          // ignore
        }
      };
    }

    // Fallback: set src; may not play if HLS unsupported
    videoEl.src = sourceUrl;
    const onCanPlay = () => startPlayback();
    videoEl.addEventListener('canplay', onCanPlay, { once: true });

    return () => {
      videoEl.removeEventListener('error', onVideoError);
      videoEl.removeEventListener('canplay', onCanPlay);
    };
  }, [onError, sourceUrl]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      controls={false}
      preload="auto"
      // Explicit attributes for iOS autoplay behavior
      x-webkit-airplay="allow"
      x5-video-player-type="h5"
      data-testid={dataTestId}
    />
  );
}
