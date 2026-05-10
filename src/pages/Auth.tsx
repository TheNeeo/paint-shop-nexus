import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { signInSchema, signUpSchema, validateInput } from '@/lib/validation';
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, Sun, Moon,
  Shield, Lightbulb, Palette, Smile, AtSign,
} from 'lucide-react';
import pandaMascot from '@/assets/panda-mascot.png';

/* ---------- Floating paint particles ---------- */
const PARTICLES = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  size: 8 + Math.random() * 28,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 6,
  duration: 8 + Math.random() * 10,
  color: [
    '#FF4F8B', '#FF8A2A', '#FFD23F', '#22D3EE',
    '#A855F7', '#3B82F6', '#10B981',
  ][i % 7],
}));

const FloatingParticles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {PARTICLES.map((p) => (
      <motion.span
        key={p.id}
        className="absolute rounded-full blur-[2px] opacity-60"
        style={{
          width: p.size,
          height: p.size,
          left: `${p.left}%`,
          top: `${p.top}%`,
          background: `radial-gradient(circle at 30% 30%, ${p.color}, transparent 70%)`,
          boxShadow: `0 0 24px ${p.color}80`,
        }}
        animate={{
          y: [0, -40, 0],
          x: [0, 20, -10, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

/* ---------- Brand logo ---------- */
const NeoLogo = () => (
  <div className="flex items-center gap-2 select-none">
    <div className="relative">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-lg"
        style={{
          background: 'linear-gradient(135deg,#FF4F8B 0%,#A855F7 50%,#3B82F6 100%)',
          boxShadow: '0 0 20px rgba(168,85,247,.6)',
        }}
      >
        N
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_#FFD23F]" />
    </div>
    <div className="leading-none">
      <div
        className="text-xl font-extrabold tracking-tight"
        style={{
          background:
            'linear-gradient(90deg,#22D3EE,#A855F7,#FF4F8B,#FF8A2A,#FFD23F)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        NEO COLOR
      </div>
      <div className="text-[11px] font-bold tracking-[0.25em] text-white/80">
        FACTORY
      </div>
    </div>
  </div>
);

/* ---------- Social button ---------- */
const SocialBtn = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <button
    type="button"
    aria-label={label}
    className="flex-1 h-12 rounded-2xl bg-white/95 hover:bg-white text-slate-700
               flex items-center justify-center shadow-lg hover:shadow-xl
               transition-all hover:-translate-y-0.5"
  >
    {children}
  </button>
);

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.3 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C41 35.6 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12a12 12 0 10-13.9 11.9v-8.4H7v-3.5h3.1V9.4c0-3.1 1.8-4.8 4.6-4.8 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.9V24A12 12 0 0024 12z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#000">
    <path d="M16.4 12.7c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.8 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 2 2.7 3.4 2.7 1.4 0 1.9-.9 3.5-.9 1.7 0 2.1.9 3.5.9 1.5 0 2.4-1.3 3.3-2.6 1-1.5 1.5-3 1.5-3.1-.1 0-2.9-1.1-2.9-4.2zM13.8 4.6c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.3-.6 3-1.5z"/>
  </svg>
);

/* ---------- Main component ---------- */
const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    fullName: '', email: '', username: '', password: '', confirm: '',
  });

  // Mouse parallax
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    setTilt({ x: x * 12, y: y * 12 });
  };

  useEffect(() => {
    if (!loading && user) navigate('/');
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    try {
      const v = validateInput(signInSchema, signInData);
      if (!v.success) { setError(v.error || 'Invalid input'); return; }
      const { error } = await supabase.auth.signInWithPassword({
        email: v.data.email, password: v.data.password,
      });
      if (error) {
        if (error.message.includes('Invalid login credentials'))
          setError('Invalid email or password.');
        else if (error.message.includes('Email not confirmed'))
          setError('Please confirm your email before signing in.');
        else setError(error.message);
      }
    } catch { setError('An unexpected error occurred.'); }
    finally { setIsLoading(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setMessage('');
    try {
      if (signUpData.password !== signUpData.confirm) {
        setError('Passwords do not match.'); return;
      }
      const v = validateInput(signUpSchema, {
        email: signUpData.email,
        password: signUpData.password,
        fullName: signUpData.fullName,
        companyName: signUpData.username,
      });
      if (!v.success) { setError(v.error || 'Invalid input'); return; }
      const { error } = await supabase.auth.signUp({
        email: v.data.email,
        password: v.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: v.data.fullName,
            username: signUpData.username,
            company_name: '',
          },
        },
      });
      if (error) {
        if (error.message.includes('User already registered'))
          setError('Account already exists. Please sign in.');
        else setError(error.message);
      } else {
        setMessage('Account created! Check your email to confirm.');
        setSignUpData({ fullName: '', email: '', username: '', password: '', confirm: '' });
        setMode('signin');
      }
    } catch { setError('An unexpected error occurred.'); }
    finally { setIsLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0820]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
      </div>
    );
  }

  const isLight = theme === 'light';

  // dark / light backgrounds
  const pageBg = isLight
    ? 'radial-gradient(1200px 800px at 10% 10%, #EDE9FE 0%, transparent 60%), radial-gradient(1000px 700px at 90% 90%, #DBEAFE 0%, transparent 60%), linear-gradient(135deg,#F8FAFC,#EEF2FF)'
    : 'radial-gradient(1200px 800px at 10% 10%, #2A1259 0%, transparent 60%), radial-gradient(1000px 700px at 90% 90%, #0B2C6B 0%, transparent 60%), linear-gradient(135deg,#0B0820 0%,#120B33 50%,#0A0E2A 100%)';

  const cardBg = isLight
    ? 'rgba(255,255,255,0.85)'
    : 'rgba(255,255,255,0.06)';
  const cardBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.12)';
  const labelText = isLight ? 'text-slate-700' : 'text-white';
  const subText = isLight ? 'text-slate-500' : 'text-white/70';

  const inputClass = `h-13 pl-12 pr-4 rounded-2xl border-2 transition-all
    ${isLight
      ? 'bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:border-violet-500'
      : 'bg-white/5 border-white/15 text-white placeholder:text-white/50 focus-visible:border-fuchsia-400'}
    focus-visible:ring-0 focus-visible:ring-offset-0`;

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: pageBg, fontFamily: '"Nunito","Poppins",ui-sans-serif,system-ui' }}
    >
      <FloatingParticles />

      {/* Animated gradient blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full blur-3xl opacity-50"
        style={{ background: 'radial-gradient(circle,#A855F7,transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full blur-3xl opacity-50"
        style={{ background: 'radial-gradient(circle,#3B82F6,transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle,#FF4F8B,transparent 70%)' }}
        animate={{ x: [-50, 50, -50], y: [-30, 30, -30] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6">
        <NeoLogo />
        <button
          onClick={() => setTheme(isLight ? 'dark' : 'light')}
          className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md border transition
            ${isLight ? 'bg-white/70 border-slate-200 text-slate-700' : 'bg-white/10 border-white/20 text-white'}`}
          aria-label="Toggle theme"
        >
          <Sun className={`h-4 w-4 ${isLight ? 'text-amber-500' : 'opacity-50'}`} />
          <div className={`w-9 h-5 rounded-full relative ${isLight ? 'bg-amber-400' : 'bg-violet-500'}`}>
            <motion.div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
              animate={{ left: isLight ? 2 : 18 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </div>
          <Moon className={`h-4 w-4 ${!isLight ? 'text-violet-200' : 'opacity-50'}`} />
        </button>
      </div>

      {/* Main grid */}
      <div className="relative z-10 grid lg:grid-cols-2 gap-8 px-6 md:px-10 py-8 max-w-[1400px] mx-auto items-center">
        {/* LEFT - Branding + mascot */}
        <motion.div
          ref={heroRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative hidden lg:flex flex-col justify-center min-h-[600px] rounded-[40px] p-10 overflow-hidden"
          style={{
            background: isLight
              ? 'linear-gradient(135deg,#1E1B4B 0%,#312E81 60%,#4C1D95 100%)'
              : 'linear-gradient(135deg,#0F0A2E 0%,#1E1248 60%,#2A0E4D 100%)',
            boxShadow: '0 30px 80px -20px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.08)',
          }}
        >
          {/* Rainbow arc behind mascot */}
          <div
            className="absolute -bottom-20 -left-10 w-[700px] h-[700px] rounded-full opacity-50 blur-2xl"
            style={{
              background:
                'conic-gradient(from 180deg,#FF4F8B,#FF8A2A,#FFD23F,#10B981,#22D3EE,#3B82F6,#A855F7,#FF4F8B)',
              maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
            }}
          />
          {/* Paint splashes */}
          <div className="absolute top-8 right-10 w-24 h-24 rounded-full blur-2xl opacity-70"
               style={{ background: '#FF8A2A' }} />
          <div className="absolute bottom-12 right-20 w-32 h-32 rounded-full blur-2xl opacity-60"
               style={{ background: '#22D3EE' }} />
          <div className="absolute top-1/2 left-6 w-20 h-20 rounded-full blur-2xl opacity-60"
               style={{ background: '#A855F7' }} />

          <div className="relative">
            <NeoLogo />
          </div>

          <motion.div
            className="relative flex-1 flex items-center justify-center my-6"
            style={{ perspective: 1000 }}
          >
            <motion.img
              src={pandaMascot}
              alt="Neo Color Factory mascot"
              className="w-[26rem] h-[26rem] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,.55)] select-none"
              draggable={false}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`,
                transformStyle: 'preserve-3d',
              }}
            />
          </motion.div>

          <div className="relative">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              {mode === 'signin' ? 'Welcome Back!' : 'Join the Colorful World!'}
            </h1>
            <p className="text-white/70 mt-2 max-w-md">
              {mode === 'signin'
                ? "Let's continue your colorful journey with Neo Color Factory."
                : 'Create your account and start your creative paint shop journey.'}
            </p>
          </div>

          {/* Footer icons */}
          <div className="relative mt-8 flex items-center gap-6 text-white/80 text-sm">
            {[
              { Icon: Shield, label: 'Secure' },
              { Icon: Lightbulb, label: 'Creative' },
              { Icon: Palette, label: 'Colorful' },
              { Icon: Smile, label: 'Fun' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-cyan-300" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT - Auth card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full max-w-md mx-auto lg:mx-0"
        >
          {/* Animated gradient border */}
          <div
            className="absolute -inset-[2px] rounded-[36px] opacity-80"
            style={{
              background:
                'conic-gradient(from 0deg,#FF4F8B,#FF8A2A,#FFD23F,#22D3EE,#A855F7,#FF4F8B)',
              filter: 'blur(14px)',
            }}
          />
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-[2px] rounded-[36px] opacity-60"
            style={{
              background:
                'conic-gradient(from 0deg,#FF4F8B,#FF8A2A,#FFD23F,#22D3EE,#A855F7,#FF4F8B)',
            }}
          />

          <div
            className="relative rounded-[34px] p-8 backdrop-blur-2xl"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow:
                '0 30px 80px -20px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.15)',
            }}
          >
            {/* paint splash corner */}
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full blur-xl opacity-70"
                 style={{ background: '#FF8A2A' }} />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-xl opacity-70"
                 style={{ background: '#22D3EE' }} />

            <div className="relative">
              {/* Mode toggle pills */}
              <div className={`flex p-1 rounded-2xl mb-6 ${isLight ? 'bg-slate-100' : 'bg-white/5 border border-white/10'}`}>
                {(['signin', 'signup'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(''); setMessage(''); }}
                    className="flex-1 relative py-2.5 text-sm font-bold rounded-xl transition"
                  >
                    {mode === m && (
                      <motion.div
                        layoutId="modePill"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background:
                            'linear-gradient(90deg,#FF8A2A,#FF4F8B,#A855F7)',
                          boxShadow: '0 8px 24px rgba(168,85,247,.45)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      />
                    )}
                    <span className={`relative ${mode === m ? 'text-white' : isLight ? 'text-slate-600' : 'text-white/70'}`}>
                      {m === 'signin' ? 'Login' : 'Sign Up'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="text-center mb-6">
                <h2 className={`text-3xl font-extrabold ${labelText}`}>
                  {mode === 'signin' ? (
                    <>Hello Again! <span className="inline-block animate-pulse">👋</span></>
                  ) : (
                    <>Create Your <span className="inline-block">👋</span><br/>Account</>
                  )}
                </h2>
                <p className={`text-sm mt-1 ${subText}`}>
                  {mode === 'signin' ? 'Login to continue' : 'Enjoy 60 days free trial'}
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4 bg-red-500/90 border-red-300/40 text-white rounded-2xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {message && (
                <Alert className="mb-4 bg-emerald-500/90 border-emerald-300/40 text-white rounded-2xl">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <AnimatePresence mode="wait">
                {mode === 'signin' ? (
                  <motion.form
                    key="signin"
                    onSubmit={handleSignIn}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isLight ? 'text-slate-400' : 'text-white/60'}`} />
                      <Input
                        type="email"
                        placeholder="Username or Email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className={inputClass + ' h-14'}
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isLight ? 'text-slate-400' : 'text-white/60'}`} />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className={inputClass + ' h-14 pr-12'}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(s => !s)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-500' : 'text-white/70'}`}>
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <label className={`flex items-center gap-2 text-sm cursor-pointer ${labelText}`}>
                        <Checkbox
                          checked={rememberMe}
                          onCheckedChange={(v) => setRememberMe(!!v)}
                          className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                        />
                        Remember me
                      </label>
                      <button type="button" className="text-sm font-bold text-pink-500 hover:text-pink-400">
                        Forgot Password?
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-14 rounded-2xl text-lg font-bold text-white relative overflow-hidden group"
                      style={{
                        background: 'linear-gradient(90deg,#FF8A2A 0%,#FF4F8B 50%,#A855F7 100%)',
                        boxShadow: '0 15px 40px -10px rgba(255,79,139,.6), 0 0 0 1px rgba(255,255,255,.1) inset',
                      }}
                    >
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                        style={{ background: 'linear-gradient(90deg,#A855F7,#FF4F8B,#FF8A2A)' }}/>
                      <span className="relative inline-flex items-center justify-center gap-2">
                        {isLoading ? 'Signing in...' : 'Login'} <ArrowRight className="h-5 w-5" />
                      </span>
                    </motion.button>

                    <div className="flex items-center gap-3 my-2">
                      <div className={`flex-1 h-px ${isLight ? 'bg-slate-200' : 'bg-white/15'}`} />
                      <span className={`text-xs ${subText}`}>or continue with</span>
                      <div className={`flex-1 h-px ${isLight ? 'bg-slate-200' : 'bg-white/15'}`} />
                    </div>

                    <div className="flex gap-3">
                      <SocialBtn label="Google"><GoogleIcon /></SocialBtn>
                      <SocialBtn label="Facebook"><FacebookIcon /></SocialBtn>
                      <SocialBtn label="Apple"><AppleIcon /></SocialBtn>
                    </div>

                    <p className={`text-center text-sm pt-2 ${subText}`}>
                      Don't have an account?{' '}
                      <button type="button" onClick={() => setMode('signup')}
                        className="font-bold text-pink-500 hover:text-pink-400">
                        Sign Up
                      </button>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    onSubmit={handleSignUp}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-3"
                  >
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isLight ? 'text-slate-400' : 'text-white/60'}`} />
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        className={inputClass + ' h-13'}
                        required
                      />
                    </div>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isLight ? 'text-slate-400' : 'text-white/60'}`} />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className={inputClass + ' h-13'}
                        required
                      />
                    </div>
                    <div className="relative">
                      <AtSign className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isLight ? 'text-slate-400' : 'text-white/60'}`} />
                      <Input
                        type="text"
                        placeholder="Username"
                        value={signUpData.username}
                        onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                        className={inputClass + ' h-13'}
                      />
                    </div>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isLight ? 'text-slate-400' : 'text-white/60'}`} />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className={inputClass + ' h-13 pr-12'}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(s => !s)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-500' : 'text-white/70'}`}>
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isLight ? 'text-slate-400' : 'text-white/60'}`} />
                      <Input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={signUpData.confirm}
                        onChange={(e) => setSignUpData({ ...signUpData, confirm: e.target.value })}
                        className={inputClass + ' h-13 pr-12'}
                        required
                      />
                      <button type="button" onClick={() => setShowConfirm(s => !s)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-500' : 'text-white/70'}`}>
                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-14 rounded-2xl text-lg font-bold text-white relative overflow-hidden mt-2"
                      style={{
                        background: 'linear-gradient(90deg,#FF8A2A 0%,#FF4F8B 50%,#A855F7 100%)',
                        boxShadow: '0 15px 40px -10px rgba(255,79,139,.6)',
                      }}
                    >
                      <span className="relative inline-flex items-center justify-center gap-2">
                        {isLoading ? 'Creating...' : 'Sign Up'} <ArrowRight className="h-5 w-5" />
                      </span>
                    </motion.button>

                    <p className={`text-center text-sm pt-1 ${subText}`}>
                      Already have an account?{' '}
                      <button type="button" onClick={() => setMode('signin')}
                        className="font-bold text-pink-500 hover:text-pink-400">
                        Login
                      </button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className={`relative z-10 text-center pb-6 text-xs ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
        © {new Date().getFullYear()} Neo Color Factory. All rights reserved.
      </div>
    </div>
  );
};

export default Auth;
