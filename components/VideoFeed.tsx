import React, { useEffect, useRef } from 'react';

interface VideoFeedProps {
  stream: MediaStream | null;
  onFrameCapture: (base64: string) => void;
  interval: number;
  isActive: boolean;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ stream, onFrameCapture, interval, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    let timerId: number;

    if (isActive && stream) {
      timerId = window.setInterval(() => {
        captureFrame();
      }, interval);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, stream, interval]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        // Downscale logic
        const targetWidth = 768;
        const scaleFactor = targetWidth / video.videoWidth;
        const targetHeight = video.videoHeight * scaleFactor;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        context.drawImage(video, 0, 0, targetWidth, targetHeight);
        
        // Convert to base64 JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        // Remove prefix to get raw base64
        const base64 = dataUrl.split(',')[1];
        
        onFrameCapture(base64);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-aviation-700 shadow-lg group">
      {/* Video Element (Main View) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain bg-black"
      />
      
      {/* Hidden Canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay when no stream */}
      {!stream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-aviation-500 bg-aviation-900/90 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm uppercase tracking-widest opacity-70">No Signal Input</span>
        </div>
      )}
      
      {/* Recording Indicator */}
      {isActive && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-red-500/30">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-mono text-red-100">LIVE FEED</span>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;