import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { supabase } from './services/supabaseClient';
import { User } from '@supabase/supabase-js';

type AppStage = 'landing' | 'auth' | 'dashboard';

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
      if (session?.user) {
        setStage('dashboard');
      } else if (stage === 'dashboard') { // Only redirect if we were in dashboard
        // Optional: Stay on landing if not logged in
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

  // Simple spinner while checking auth
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-aviation-500 font-mono">INITIALIZING...</div>;

  return (
    <>
      {stage === 'landing' && (
        <LandingPage onGetStarted={() => setStage(user ? 'dashboard' : 'auth')} />
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