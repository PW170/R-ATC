import React from 'react';

interface TelemetryCardProps {
    label: string;
    value: string | number;
    unit: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'stable';
}

const TelemetryCard: React.FC<TelemetryCardProps> = ({ label, value, unit, icon, trend }) => {
    return (
        <div className="bg-aviation-800/50 border border-aviation-700/50 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-aviation-500/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-aviation-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="text-aviation-400 mb-2 opacity-75">{icon}</div>
            <div className="text-3xl font-bold text-white font-mono tracking-tighter tabular-nums">
                {value}
                <span className="text-sm font-sans text-gray-500 ml-1 font-normal opacity-50">{unit}</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-aviation-500 font-semibold mt-1">{label}</div>
        </div>
    );
};

export default TelemetryCard;
