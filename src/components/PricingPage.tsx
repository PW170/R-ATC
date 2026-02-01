import React from 'react';
import Navbar from './Navbar';

interface PricingPageProps {
    onLogin: () => void;
    onHome: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onLogin, onHome }) => {
    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans flex flex-col relative overflow-hidden">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                 .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
            `}</style>

            {/* Navbar */}
            <Navbar onLogin={onLogin} onPricing={() => { }} />

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-aviation-900 via-black to-black"></div>
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-aviation-500/10 rounded-full blur-[120px] opacity-50"></div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pt-32">
                <div className="max-w-md w-full animate-fade-in-up">
                    <div className="text-center mb-10">
                        <div className="inline-block px-3 py-1 bg-aviation-500/10 border border-aviation-500/20 rounded-full text-aviation-400 text-xs font-bold mb-4 tracking-wider uppercase">
                            Early Access
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Secure Your Access</h2>
                        <p className="text-gray-400">Join the exclusive beta program for a one-time fee.</p>
                    </div>

                    <div className="bg-aviation-900/40 backdrop-blur-xl border border-aviation-500/30 rounded-3xl p-8 relative overflow-hidden group hover:border-aviation-500/50 transition-colors duration-500">
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-aviation-500/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-5xl font-bold text-white">$8</span>
                                <span className="text-gray-400 text-lg mb-2">/ Lifetime</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Unlimited AI ATC Interactions",
                                    "Real-time Telemetry Analysis",
                                    "Visual Runway Verification",
                                    "Priority Support Channel",
                                    "All Future Updates Included"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-aviation-500/20 flex items-center justify-center text-aviation-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-4 bg-gradient-to-r from-aviation-500 to-aviation-accent hover:to-aviation-400 text-white font-bold rounded-xl shadow-lg shadow-aviation-500/25 hover:shadow-aviation-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                                Purchase Access
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                Secure payment via Stripe. 30-day money-back guarantee.
                            </p>
                        </div>
                    </div>
                    <div className="text-center mt-8">
                        <button onClick={onHome} className="text-gray-500 hover:text-white text-sm transition-colors">
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
