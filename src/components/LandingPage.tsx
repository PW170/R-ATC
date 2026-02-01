import React from 'react';
import Navbar from './Navbar';

interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
    onPricing: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onPricing }) => {
    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans flex flex-col relative overflow-x-hidden">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                /* Fade in down for Navbar */
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-600 { animation-delay: 0.6s; }
                .delay-700 { animation-delay: 0.7s; }
            `}</style>

            {/* Navbar */}
            <Navbar onLogin={onLogin} onPricing={onPricing} />

            {/* Continuous Background System */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-aviation-900 via-black to-black"></div>
                {/* Top Right Glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-aviation-500/10 rounded-full blur-[120px] opacity-60"></div>
                {/* Bottom Left Glow for Features */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-aviation-accent/5 rounded-full blur-[100px] opacity-40"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-24 pb-12 px-6 text-center">

                {/* Logo / Badge */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="w-20 h-20 bg-aviation-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-aviation-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] mx-auto hover:scale-110 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-aviation-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 font-sans max-w-4xl leading-tight animate-fade-in-up delay-100">
                    Elevate Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-aviation-500 to-aviation-accent">Roblox Flight</span> Experience.
                </h1>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed animate-fade-in-up delay-200">
                    Professional-grade AI Air Traffic Control for PTFS and Aeronautica.
                    Real-time voice coordination, telemetry analysis, and immersive roleplay.
                </p>

                {/* Action Button */}
                <div className="animate-fade-in-up delay-300">
                    <button
                        onClick={onGetStarted}
                        className="group relative px-8 py-4 bg-aviation-500 hover:bg-aviation-accent text-white rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] flex items-center gap-3 mx-auto"
                    >
                        <span>Request Clearance</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Dashboard Preview Card (Optional/Reduced) */}
                {/* <div className="mt-16 w-full max-w-5xl relative group perspective-1000 animate-fade-in-up delay-400"> */}
                {/* ... (Kept minimal or removed to focus on features flow) ... */}
                {/* </div> */}

            </div>

            {/* Features Section - Seamless Transition */}
            <div className="relative z-10 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in-up delay-400">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Precision Flight Support.</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Advanced systems designed for the ultimate Roblox aviation simulation.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-aviation-900/20 backdrop-blur-md border border-gray-800/50 rounded-2xl p-8 hover:bg-aviation-900/40 hover:border-aviation-500/50 transition-all duration-300 group animate-fade-in-up delay-500 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-aviation-500/10 rounded-xl flex items-center justify-center text-aviation-500 mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">AI Tower Controller</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Professional-grade R-ATC simulation using standard aviation terminology. Supports Gemini, DeepSeek, and custom LLMs.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-aviation-900/20 backdrop-blur-md border border-gray-800/50 rounded-2xl p-8 hover:bg-aviation-900/40 hover:border-aviation-500/50 transition-all duration-300 group animate-fade-in-up delay-500 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-aviation-500/10 rounded-xl flex items-center justify-center text-aviation-500 mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Telemetry Extraction</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Advanced computer vision reads speed, altitude, and thrust directly from your instruments with zero lag or external plugins.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-aviation-900/20 backdrop-blur-md border border-gray-800/50 rounded-2xl p-8 hover:bg-aviation-900/40 hover:border-aviation-500/50 transition-all duration-300 group animate-fade-in-up delay-600 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-aviation-500/10 rounded-xl flex items-center justify-center text-aviation-500 mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Runway Verification</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Visually confirms runway clearance. The AI scans for traffic and obstacles before granting takeoff or landing clearance.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-aviation-900/20 backdrop-blur-md border border-gray-800/50 rounded-2xl p-8 hover:bg-aviation-900/40 hover:border-aviation-500/50 transition-all duration-300 group animate-fade-in-up delay-600 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-aviation-500/10 rounded-xl flex items-center justify-center text-aviation-500 mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Heading Validation</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Radar checks compare your heading against airport markers. R-ATC alerts you if you're drifting off-course.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-aviation-900/20 backdrop-blur-md border border-gray-800/50 rounded-2xl p-8 hover:bg-aviation-900/40 hover:border-aviation-500/50 transition-all duration-300 group animate-fade-in-up delay-700 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-aviation-500/10 rounded-xl flex items-center justify-center text-aviation-500 mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-1.104A10.052 10.052 0 003.32 11c0-5.523 4.477-10 10-10s10 4.477 10 10a10.05 10.05 0 01-3.247 7.47m-3.8-9.269c.19-.245.446-.465.719-.606M11.5 12h.01M16 12h.01M8 12h.01M12 16h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Live Radar Dashboard</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Terminal display with real-time telemetry, Comms logs, and audio visualizers for a true cockpit experience.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-aviation-900/20 backdrop-blur-md border border-gray-800/50 rounded-2xl p-8 hover:bg-aviation-900/40 hover:border-aviation-500/50 transition-all duration-300 group animate-fade-in-up delay-700 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-aviation-500/10 rounded-xl flex items-center justify-center text-aviation-500 mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Secure Flight Log</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Integrated with Supabase for persistent pilot profiles. Secure your callsigns and settings across all flight sessions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
