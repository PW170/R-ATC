import React from 'react';

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans flex flex-col relative overflow-hidden">
            {/* Background Gradient / Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-aviation-900 via-black to-black z-0"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-aviation-500/10 rounded-full blur-[120px] z-0"></div>

            {/* Hero Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">

                {/* Logo / Badge */}
                <div className="mb-8 animate-fade-in-down">
                    <div className="w-20 h-20 bg-aviation-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-aviation-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-aviation-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 font-sans max-w-4xl leading-tight">
                    Elevate Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-aviation-500 to-aviation-accent">Roblox Flight</span> Experience.
                </h1>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
                    Professional-grade AI Air Traffic Control for PTFS and Aeronautica.
                    Real-time voice coordination, telemetry analysis, and immersive roleplay.
                </p>

                {/* Action Button */}
                <button
                    onClick={onGetStarted}
                    className="group relative px-8 py-4 bg-aviation-500 hover:bg-aviation-accent text-white rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] flex items-center gap-3"
                >
                    <span>Request Clearance</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Dashboard Preview Card */}
                <div className="mt-16 w-full max-w-5xl relative group perspective-1000">
                    <div className="absolute inset-0 bg-aviation-500/20 blur-[50px] -z-10 rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
                    <div className="bg-black/40 backdrop-blur-md border border-gray-800 rounded-xl p-2 shadow-2xl transform rotate-x-10 group-hover:rotate-x-0 transition-transform duration-700 ease-out">
                        <div className="bg-aviation-900/80 rounded-lg aspect-[16/9] flex items-center justify-center border border-gray-800/50 overflow-hidden relative">
                            {/* Mock UI Elements */}
                            <div className="absolute top-4 left-4 right-4 h-12 bg-gray-800/50 rounded flex items-center px-4 justify-between border border-gray-700/50">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>
                                <div className="text-xs text-gray-500 font-mono">R-ATC DASHBOARD PREVIEW</div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-aviation-500/20 font-mono text-9xl font-bold tracking-tighter select-none">R-ATC</div>
                            </div>
                            {/* Grid lines */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
