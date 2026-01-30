import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LogMessage, ConnectionState } from '../types';
import VideoFeed from './VideoFeed';
import LogTerminal from './LogTerminal';
import TelemetryCard from './TelemetryCard';
import { analyzeFlightFrame } from '../services/openRouterService';
import { speakText, SpeechRecognizer } from '../services/speechService';
import { saveLog } from '../services/logService';
import { User } from '@supabase/supabase-js';

interface DashboardProps {
    user: User;
    onLogout: () => void;
    onHome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onHome }) => {
    // State
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [pilotContext, setPilotContext] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [telemetry, setTelemetry] = useState({ alt: '---', spd: '---' });

    // User Config State
    const [callsign, setCallsign] = useState<string>(localStorage.getItem('ratc_callsign') || user.email?.split('@')[0] || 'Unknown');
    // Use env var or empty string - Note: We assume key is in env if not provided
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    const [showSettings, setShowSettings] = useState(false);

    // Session ID
    const sessionIdRef = useRef<string>(uuidv4());

    // Refs
    const recognizerRef = useRef<SpeechRecognizer | null>(null);

    // Initial Config Check - Only check callsign now
    useEffect(() => {
        if (!callsign || callsign === 'Unknown') {
            setShowSettings(true);
        }
    }, [callsign]);

    // Save Config
    const handleSaveConfig = () => {
        if (callsign) {
            localStorage.setItem('ratc_callsign', callsign);
            setShowSettings(false);
        }
    };


    // Helper to add logs
    const addLog = useCallback((sender: 'ATC' | 'PILOT' | 'SYSTEM', text: string) => {
        setLogs(prev => [...prev, {
            id: uuidv4(),
            timestamp: new Date(),
            sender,
            text
        }]);
        saveLog(sessionIdRef.current, sender, text);
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        recognizerRef.current = new SpeechRecognizer((transcript) => {
            // WAKE WORD LOGIC
            const cleanTranscript = transcript.trim();
            const isWakeWord = cleanTranscript.toLowerCase().startsWith('atc') || cleanTranscript.toLowerCase().startsWith('alpha tango charlie');

            if (isWakeWord) {
                addLog('PILOT', cleanTranscript);
                setPilotContext(cleanTranscript);
            } else {
                console.log("Ignored (No Wake Word):", cleanTranscript);
            }
        });

        return () => {
            recognizerRef.current?.stop();
        };
    }, [addLog]);

    // Extract Telemetry from AI Response
    const processAIResponse = (response: string) => {
        const telemRegex = /\[TELEM: ALT=(\d+|---) SPD=(\d+|---)\]/;
        const match = response.match(telemRegex);

        if (match) {
            setTelemetry({ alt: match[1], spd: match[2] });
            return response.replace(telemRegex, '').trim();
        }
        return response;
    };


    // Start/Stop Handlers
    const handleStart = async () => {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 10, max: 30 } },
                audio: false
            });

            setStream(displayStream);
            setConnectionState(ConnectionState.CONNECTED);
            addLog('SYSTEM', 'RADAR IDENTIFIED. Good morning, ' + callsign);
            recognizerRef.current?.start();

            displayStream.getVideoTracks()[0].onended = () => handleStop();
        } catch (err) {
            console.error("Error accessing display media:", err);
            addLog('SYSTEM', 'Radar connection failed.');
        }
    };

    const handleStop = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setConnectionState(ConnectionState.DISCONNECTED);
        recognizerRef.current?.stop();
        addLog('SYSTEM', 'Radar service terminated.');
    }, [stream, addLog]);


    // AI Loop
    const handleFrameCapture = async (base64Image: string) => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            const resp = await analyzeFlightFrame(base64Image, pilotContext, apiKey);
            const cleanResp = processAIResponse(resp);

            if (pilotContext) {
                addLog('ATC', cleanResp);
                speakText(cleanResp);
                setPilotContext('');
            } else {
                if (cleanResp.includes("URGENT") || cleanResp.includes("ALERT")) {
                    addLog('ATC', cleanResp);
                    speakText(cleanResp);
                }
            }

        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="flex-1 flex flex-col h-full bg-black relative">

            {/* Settings Modal (If API Key missing) */}
            {showSettings && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-aviation-700 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                        {/* Close 'X' only if we have an API key already (allowing edit), otherwise forced */}
                        {apiKey && <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>}

                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-aviation-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Pilot Configuration
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">CALLSIGN</label>
                                <input
                                    type="text"
                                    value={callsign}
                                    onChange={(e) => setCallsign(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white focus:border-aviation-500 outline-none"
                                />
                            </div>
                            <button
                                onClick={handleSaveConfig}
                                disabled={!callsign}
                                className="w-full bg-aviation-500 hover:bg-aviation-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                SAVE & CONNECT
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="flex justify-between items-center px-6 py-4 border-b border-aviation-900 bg-black/50 backdrop-blur">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-aviation-500 rounded flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white font-sans tracking-tight">R-ATC <span className="text-aviation-500 text-xs align-top">V2</span></h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={onHome} className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        HOME
                    </button>
                    <button onClick={() => setShowSettings(true)} className="text-gray-500 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                    </button>
                    <div className={`px-3 py-1 rounded text-xs font-mono font-bold ${connectionState === ConnectionState.CONNECTED ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {connectionState === ConnectionState.CONNECTED ? 'RADAR ACTIVE' : 'STANDBY'}
                    </div>
                    <button onClick={onLogout} className="text-xs text-gray-500 hover:text-white transition-colors">SIGNOUT</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">

                {/* Left: Radar & Logs */}
                <div className="col-span-8 flex flex-col gap-6 h-full">
                    {/* Radar Feed */}
                    <div className="flex-1 bg-aviation-900/50 rounded-2xl border border-aviation-800 relative overflow-hidden group">
                        <VideoFeed
                            stream={stream}
                            onFrameCapture={handleFrameCapture}
                            interval={5000}
                            isActive={connectionState === ConnectionState.CONNECTED}
                        />

                        {/* No Signal Overlay */}
                        {!stream && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-aviation-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                <p className="font-mono text-lg tracking-widest">AWAITING VIDEO LINK...</p>
                            </div>
                        )}

                        {/* Processing Indicator */}
                        {isProcessing && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-aviation-500/30">
                                <div className="w-2 h-2 bg-aviation-500 rounded-full animate-ping"></div>
                                <span className="text-[10px] font-mono text-aviation-400">ANALYZING LINK</span>
                            </div>
                        )}
                    </div>

                    {/* Logs */}
                    <div className="h-1/3">
                        <LogTerminal logs={logs} />
                    </div>
                </div>

                {/* Right: Telemetry & Controls */}
                <div className="col-span-4 flex flex-col gap-6">

                    {/* Telemetry Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <TelemetryCard
                            label="ALTITUDE"
                            value={telemetry.alt}
                            unit="FT"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                        />
                        <TelemetryCard
                            label="AIRSPEED"
                            value={telemetry.spd}
                            unit="KTS"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        />
                    </div>

                    {/* Pilot Info Card */}
                    <div className="bg-aviation-900 border border-aviation-800 rounded-xl p-6">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Pilot Profile</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                {callsign.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-white font-mono font-bold text-lg">{callsign}</div>
                                <div className="text-aviation-500 text-xs">{user.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Controls */}
                    <div className="flex-1 flex flex-col justify-end gap-3">
                        {connectionState === ConnectionState.DISCONNECTED ? (
                            <button
                                onClick={handleStart}
                                className="w-full bg-aviation-500 hover:bg-aviation-accent text-white font-bold py-4 rounded-xl shadow-lg shadow-aviation-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                Start Radar Link
                            </button>
                        ) : (
                            <button
                                onClick={handleStop}
                                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
                                Terminate Link
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
