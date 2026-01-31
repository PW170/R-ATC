import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
    isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
    const [bars, setBars] = useState<number[]>(new Array(20).fill(10));

    useEffect(() => {
        if (!isActive) {
            setBars(new Array(20).fill(5));
            return;
        }

        const interval = setInterval(() => {
            setBars(prev => prev.map(() => Math.random() * 40 + 10));
        }, 100);

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur border-t border-aviation-900 flex items-center justify-center gap-1 z-50 pointer-events-none">
            {bars.map((height, i) => (
                <div
                    key={i}
                    className="w-1 bg-aviation-500/80 rounded-full transition-all duration-100 ease-in-out"
                    style={{ height: `${height}px` }}
                ></div>
            ))}
        </div>
    );
};

export default AudioVisualizer;
