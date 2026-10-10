import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn, Lock, GraduationCap } from 'lucide-react';

interface AccessDeniedViewProps {
  currentRole?: string;
  onNavigateHome: () => void;
  onOpenSuperAdminLogin: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  currentRole = 'student',
  onNavigateHome,
  onOpenSuperAdminLogin,
}) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-[#101820] text-white border border-rose-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden space-y-6">
        {/* Ambient Red/Gold Security Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#D5A94F]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Shield Alert Icon */}
        <div className="w-20 h-20 rounded-full bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_24px_rgba(244,63,94,0.25)]">
          <ShieldAlert className="w-10 h-10" />
        </div>

        {/* Status Code & Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>HTTP 403 · Access Denied</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Super Admin Authorization Required
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            You are currently browsing with the <span className="text-[#D5A94F] font-bold uppercase">{currentRole}</span> role. Administrative routes, platform controls, and user registries are strictly restricted to verified <span className="text-rose-300 font-bold">super_admin</span> accounts.
          </p>
        </div>

        {/* Role Enforcement Explanation */}
        <div className="p-4 bg-[#142536] rounded-2xl border border-slate-700/70 text-left text-xs space-y-2 text-slate-300">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#D5A94F]" />
            <span>Role-Based Access Control (RBAC) Policy</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
            <li>Public registrations strictly provision <span className="text-slate-200 font-mono">student</span> accounts.</li>
            <li>Super Admin accounts can only be provisioned via authorized server seeders.</li>
            <li>Students are safeguarded from unauthorized configuration changes.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Learning Tracks</span>
          </button>

          <button
            onClick={onOpenSuperAdminLogin}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D5A94F] to-[#B88728] hover:brightness-110 text-[#101820] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Authenticate as Super Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

