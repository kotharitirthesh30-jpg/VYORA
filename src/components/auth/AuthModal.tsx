import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { UserProfile } from '../../types';
import { useAuth } from '../../lib/firebase/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { signInWithGoogle, isSigningIn } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading || isSigningIn) return;
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const googleProfile = await signInWithGoogle();
      if (googleProfile) {
        onLoginSuccess(googleProfile);
        onClose();
      }
    } catch (err: any) {
      if (err?.message) {
        setErrorMessage(err.message);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (authMode === 'forgot') {
      setNotice('Password reset link has been dispatched to your email address.');
      setTimeout(() => {
        setNotice(null);
        setAuthMode('login');
      }, 2500);
      return;
    }

    const resolvedName = name.trim() || (email ? email.split('@')[0] : 'Workspace User');
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: resolvedName,
      email: email || 'user@vyora.ai',
      createdAt: new Date().toISOString(),
      plan: 'pro',
    };

    onLoginSuccess(newProfile);
    onClose();
  };

  const handleDemoSignIn = (role: 'Engineer' | 'Researcher' | 'Executive') => {
    const demoProfiles: Record<string, UserProfile> = {
      Engineer: {
        id: 'usr-engineer',
        name: 'Alex Chen (Staff Architect)',
        email: 'alex.chen@vyora.dev',
        createdAt: new Date().toISOString(),
        plan: 'pro',
      },
      Researcher: {
        id: 'usr-researcher',
        name: 'Dr. Elena Rostova',
        email: 'elena.rostova@quantum-labs.org',
        createdAt: new Date().toISOString(),
        plan: 'pro',
      },
      Executive: {
        id: 'usr-exec',
        name: 'Marcus Vance (VP Tech)',
        email: 'm.vance@enterprise.com',
        createdAt: new Date().toISOString(),
        plan: 'enterprise',
      },
    };

    onLoginSuccess(demoProfiles[role]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#171925] border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-5 right-5 text-[#999BAE] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <BrandLogo size="md" className="justify-center mb-2" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            {authMode === 'login' && 'Sign In to VYORA'}
            {authMode === 'register' && 'Create Your Account'}
            {authMode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-[#999BAE]">
            {authMode === 'login' && 'Sign in to access your models, memories, and workspace'}
            {authMode === 'register' && 'Join the next-generation connected AI platform'}
            {authMode === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Real Google Sign-In Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isSigningIn}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-2.5 border border-white/20 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGoogleLoading || isSigningIn ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isGoogleLoading || isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#171925] px-3 text-[11px] uppercase tracking-wider text-[#999BAE]">
              or with email
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {notice && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="text-xs text-[#999BAE] block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#999BAE] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-[#10111A] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#999BAE]/60 focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-[#999BAE] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#999BAE] absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#10111A] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#999BAE]/60 focus:outline-none focus:border-[#8B5CF6]"
                required
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#999BAE]">Password</label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] text-[#22D3EE] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#999BAE] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#10111A] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#999BAE]/60 focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2"
          >
            <span>
              {authMode === 'login' && 'Sign In with Email'}
              {authMode === 'register' && 'Create Account'}
              {authMode === 'forgot' && 'Send Reset Link'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Personas Switcher */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="text-[10px] font-semibold text-[#999BAE] uppercase tracking-wider text-center">
            Or Quick Connect as Demo Persona
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['Engineer', 'Researcher', 'Executive'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemoSignIn(role)}
                className="p-2 rounded-lg bg-[#10111A] border border-white/5 hover:border-[#22D3EE]/40 text-[11px] text-[#999BAE] hover:text-white transition-colors"
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Mode switcher link */}
        <div className="text-center text-xs text-[#999BAE]">
          {authMode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('register')}
                className="text-[#22D3EE] font-semibold hover:underline"
              >
                Register now
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-[#22D3EE] font-semibold hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
