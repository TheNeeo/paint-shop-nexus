import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { signInSchema, signUpSchema, validateInput } from '@/lib/validation';
import { Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react';
import pandaMascot from '@/assets/panda-mascot.png';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
  });

  useEffect(() => {
    if (!loading && user) navigate('/');
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const validation = validateInput(signInSchema, signInData);
      if (!validation.success) {
        setError(validation.error || 'Invalid input');
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: validation.data.email,
        password: validation.data.password,
      });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email before signing in.');
        } else setError(error.message);
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const validation = validateInput(signUpSchema, signUpData);
      if (!validation.success) {
        setError(validation.error || 'Invalid input');
        return;
      }
      const { error } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: validation.data.fullName,
            company_name: validation.data.companyName || '',
          },
        },
      });
      if (error) {
        if (error.message.includes('User already registered')) {
          setError('Account already exists. Please sign in.');
        } else setError(error.message);
      } else {
        setMessage('Account created! Check your email to confirm.');
        setSignUpData({ email: '', password: '', fullName: '', companyName: '' });
        setMode('signin');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E6BE6]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-200 via-blue-100 to-slate-200">
      <div
        className="relative w-full max-w-md rounded-[36px] overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #2B7DEF 0%, #1E6BE6 55%, #1A5FD1 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-40 -right-16 w-56 h-56 rounded-full bg-pink-400/20 blur-3xl" />

        <div className="relative px-7 pt-8 pb-10">
          {/* Hero / Mascot (branding baked into image) */}
          <div className="flex justify-center -mt-2 mb-1">
            <img
              src={pandaMascot}
              alt="NEO COLOR FACTORY"
              width={1024}
              height={1024}
              className="w-[22rem] h-[22rem] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.4)] select-none"
              draggable={false}
            />
          </div>

          {/* Welcome */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'signin' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-sm text-blue-100/90 mt-1">
              {mode === 'signin'
                ? 'Login to continue your colorful journey'
                : 'Start your colorful paint shop journey'}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-500/90 border-red-300/40 text-white">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert className="mb-4 bg-emerald-500/90 border-emerald-300/40 text-white">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  className="h-14 pl-12 pr-4 rounded-full bg-transparent border-2 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/60 focus-visible:border-white"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  className="h-14 pl-12 pr-12 rounded-full bg-transparent border-2 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/60 focus-visible:border-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between px-2 py-1">
                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(!!v)}
                    className="bg-white/90 border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-600"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-amber-300 hover:text-amber-200"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-full text-lg font-bold text-white shadow-xl border-0 hover:opacity-95 transition"
                style={{
                  background:
                    'linear-gradient(90deg, #FF8A2A 0%, #FF4F8B 50%, #E91E63 100%)',
                }}
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>

              <p className="text-center text-sm text-white/90 pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  className="font-bold text-amber-300 hover:text-amber-200"
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={signUpData.fullName}
                  onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                  className="h-14 pl-12 rounded-full bg-transparent border-2 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/60 focus-visible:border-white"
                  required
                />
              </div>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
                <Input
                  type="text"
                  placeholder="Paint Shop Name (optional)"
                  value={signUpData.companyName}
                  onChange={(e) => setSignUpData({ ...signUpData, companyName: e.target.value })}
                  className="h-14 pl-12 rounded-full bg-transparent border-2 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/60 focus-visible:border-white"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  className="h-14 pl-12 rounded-full bg-transparent border-2 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/60 focus-visible:border-white"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 chars)"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className="h-14 pl-12 pr-12 rounded-full bg-transparent border-2 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/60 focus-visible:border-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-full text-lg font-bold text-white shadow-xl border-0 hover:opacity-95 transition"
                style={{
                  background:
                    'linear-gradient(90deg, #FF8A2A 0%, #FF4F8B 50%, #E91E63 100%)',
                }}
              >
                {isLoading ? 'Creating...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-white/90 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError('');
                  }}
                  className="font-bold text-amber-300 hover:text-amber-200"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
