import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import PricingPage from './components/PricingPage';
import { supabase } from './services/supabaseClient';
import { User } from '@supabase/supabase-js';

type AppStage = 'landing' | 'auth' | 'dashboard' | 'pricing';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setStage('dashboard');
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && stage === 'auth') {
        // Only auto-redirect to dashboard when coming from auth page
        setStage('dashboard');
      } else if (!session?.user && stage === 'dashboard') {
        // Redirect to landing if logged out while on dashboard
        setStage('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, [stage]);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStage('auth');
  };

  const handleHome = () => {
    setStage('landing');
  };

  const handlePricing = () => {
    setStage('pricing');
  };

  const handleLogin = () => {
    setStage('auth');
  }

  // Simple spinner while checking auth
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-aviation-500 font-mono">INITIALIZING...</div>;

  return (
    <>
      {stage === 'landing' && (
        <LandingPage
          onGetStarted={() => setStage(user ? 'dashboard' : 'auth')}
          onLogin={handleLogin}
          onPricing={handlePricing}
        />
      )}

      {stage === 'pricing' && (
        <PricingPage
          onLogin={handleLogin}
          onHome={handleHome}
        />
      )}

      {stage === 'auth' && (
        <AuthPage onLoginSuccess={() => setStage('dashboard')} />
      )}

      {stage === 'dashboard' && user && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onHome={handleHome}
        />
      )}
    </>
  );
};

export default App;