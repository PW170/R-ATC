import React from 'react';

interface NavbarProps {
    onLogin: () => void;
    onPricing: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin, onPricing }) => {
    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 animate-fade-in-down">
            <nav className="flex items-center justify-between w-full max-w-2xl px-6 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-aviation-500/10">
                {/* Logo */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-8 h-8 bg-aviation-500/20 rounded-lg flex items-center justify-center border border-aviation-500/30 group-hover:bg-aviation-500/30 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-aviation-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </div>
                    <span className="font-bold text-gray-200 tracking-tight group-hover:text-white transition-colors">R-ATC</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button onClick={onLogin} className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-2 py-1">
                        Login
                    </button>
                    <button onClick={onPricing} className="relative px-5 py-2 bg-gradient-to-r from-aviation-500 to-aviation-accent text-white text-sm font-bold rounded-full hover:shadow-[0_0_15px_rgba(14,165,233,0.5)] transition-shadow">
                        Pricing
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
