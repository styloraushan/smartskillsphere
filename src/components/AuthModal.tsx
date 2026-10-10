import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  GraduationCap, 
  Lock, 
  Mail, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, redirectTab?: string) => void;
  initialMode?: 'login' | 'signup' | 'admin_login';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'admin_login'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetExam, setTargetExam] = useState('Campus Placements & GATE CS');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Student Login
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please provide an email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = authService.login(email.trim());
      setLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid credentials. Please verify your student email or use demo accounts.');
      }
    }, 250);
  };

  // Student Registration (strictly assigns 'student' role on server)
  const handleStudentSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError('Please provide both your name and email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Security: Public registration strictly provisions 'student' role. Super admins can only be created via seeder.
      const res = authService.signUp(name, email, targetExam);
      setLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      }
    }, 250);
  };

  // Super Admin Login (strictly authorizes super_admin accounts and redirects to /admin/dashboard)
  const handleSuperAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please provide the authorized super admin email.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = authService.loginSuperAdmin(email.trim());
      setLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user, 'admin');
        onClose();
      } else {
        setError(res.error || '403 Forbidden: Account does not possess super_admin privileges.');
      }
    }, 250);
  };

  // Guest Mode
  const handleContinueAsGuest = () => {
    const guestUser = authService.loginGuest();
    onLoginSuccess(guestUser);
    onClose();
  };

  // 1-Click Demo Logins
  const handleQuickLogin = (demoEmail: string, isAdmin: boolean = false) => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      if (isAdmin) {
        const res = authService.loginSuperAdmin(demoEmail);
        setLoading(false);
        if (res.success && res.user) {
          onLoginSuccess(res.user, 'admin');
          onClose();
        } else {
          setError(res.error || 'Admin login failed.');
        }
      } else {
        const res = authService.login(demoEmail);
        setLoading(false);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
          onClose();
        }
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#101820] text-white rounded-3xl shadow-2xl border border-[#25344A] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#101820] via-[#142536] to-[#101820] border-b border-[#25344A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#142536] border border-[#D5A94F] flex items-center justify-center text-[#D5A94F]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                SmartSkill<span className="text-[#D5A94F]">Sphere</span>
              </h3>
              <p className="text-[11px] text-[#AAB4C2]">
                {mode === 'admin_login'
                  ? 'Super Admin Portal Authentication'
                  : mode === 'signup'
                  ? 'Student Portal Registration (/register)'
                  : 'Student Authentication Portal (/login)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Tab Mode Switcher: Student Login, Student Register, Super Admin */}
        <div className="grid grid-cols-3 p-1.5 bg-[#142536]/80 m-6 mb-4 rounded-xl border border-slate-700/60 text-xs font-bold text-center gap-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-[#D5A94F] text-[#101820] shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Student Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-[#D5A94F] text-[#101820] shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin_login');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              mode === 'admin_login'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Forms */}
        <div className="p-6 pt-2 space-y-4">
          {/* TAB 1: STUDENT LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleStudentLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Student Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="inforaushan03@gmail.com"
                    className="w-full bg-[#142536] border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A94F] focus:ring-1 focus:ring-[#D5A94F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#142536] border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A94F] focus:ring-1 focus:ring-[#D5A94F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#D5A94F] to-[#B88728] hover:from-[#F5D982] hover:to-[#D5A94F] text-[#101820] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In as Student'}
              </button>
            </form>
          )}

          {/* TAB 2: STUDENT REGISTRATION (/register - STRICTLY ASSIGNS STUDENT ROLE) */}
          {mode === 'signup' && (
            <form onSubmit={handleStudentSignUp} className="space-y-3.5">
              <div className="p-2.5 rounded-xl bg-[#D5A94F]/10 border border-[#D5A94F]/30 text-[#D5A94F] text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Public registration automatically assigns the Student role.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-[#142536] border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A94F] focus:ring-1 focus:ring-[#D5A94F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full bg-[#142536] border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A94F] focus:ring-1 focus:ring-[#D5A94F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Competitive Track
                </label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full bg-[#142536] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D5A94F]"
                >
                  <option value="Campus Placements & GATE CS">Campus Placements & GATE CS</option>
                  <option value="CAT & Management Aptitude">CAT & Management Aptitude</option>
                  <option value="UPSC Civil Services CSAT">UPSC Civil Services CSAT</option>
                  <option value="Banking & SSC CGL">Banking & SSC CGL</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#D5A94F] to-[#B88728] hover:from-[#F5D982] hover:to-[#D5A94F] text-[#101820] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                {loading ? 'Creating Student Account...' : 'Register as Student'}
              </button>
            </form>
          )}

          {/* TAB 3: SUPER ADMIN LOGIN (/admin/login) */}
          {mode === 'admin_login' && (
            <form onSubmit={handleSuperAdminLogin} className="space-y-3.5">
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Restricted Portal: Super Admin seeder authorization required.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Super Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@smartskillsphere.com"
                    className="w-full bg-[#142536] border border-rose-500/50 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Security Key / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#142536] border border-rose-500/50 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                {loading ? 'Verifying Super Admin Authorization...' : 'Sign In to Super Admin Dashboard'}
              </button>
            </form>
          )}

          {/* GUEST OPTION & QUICK DEMO LOGINS */}
          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            {/* Continue as Guest Button */}
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#D5A94F]" />
              <span>Continue as Guest (Browse public notes & drills)</span>
            </button>

            <span className="text-[11px] font-semibold text-[#AAB4C2] uppercase tracking-wider block text-center pt-1">
              Authorized 1-Click Role Logins
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('inforaushan03@gmail.com', false)}
                className="p-2 rounded-xl bg-[#142536] hover:bg-[#1f3750] border border-slate-700/80 hover:border-[#D5A94F] text-left transition-colors flex items-center gap-2 group"
              >
                <GraduationCap className="w-4 h-4 text-[#D5A94F] shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-white group-hover:text-[#D5A94F] truncate">Raushan K.</div>
                  <div className="text-[10px] text-slate-400 font-mono">student</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@smartskillsphere.com', true)}
                className="p-2 rounded-xl bg-[#142536] hover:bg-[#1f3750] border border-rose-500/40 hover:border-rose-400 text-left transition-colors flex items-center gap-2 group"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-white group-hover:text-rose-400 truncate">Directorate</div>
                  <div className="text-[10px] text-rose-300 font-mono">super_admin</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
