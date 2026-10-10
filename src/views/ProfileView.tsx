import React, { useState } from 'react';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  RotateCcw,
  Bell,
  Lock,
  Moon,
  Sparkles
} from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/api';

interface ProfileViewProps {
  currentUser: User;
  onUpdateUser: (updated: User) => void;
  onResetData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  onResetData,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [targetExam, setTargetExam] = useState(currentUser.targetExam);
  const [notice, setNotice] = useState<string | null>(null);

  const exams = [
    'Campus Placements & GATE CS',
    'CAT & Management Aptitude',
    'SSC CGL & Civil Services',
    'Banking & Insurance (IBPS/SBI)',
    'GRE & Academic Admissions',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = authService.updateProfile({ name, targetExam });
    onUpdateUser(updated);
    setNotice('Profile preferences saved successfully.');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold font-display text-[#111214]">
          Student Profile & Platform Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal learning target, notification triggers, and demo environment state
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#C9A45C]"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="text-base font-bold text-[#111214]">{currentUser.name}</h3>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Role: {currentUser.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-xs text-[#25344A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Examination / Pathway</label>
            <select
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-xs text-[#25344A]"
            >
              {exams.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Demo Reset Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-[#111214]">Environment & Seed Data Management</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Reset all locally recorded test attempts, custom poll votes, uploaded notes, and mistake book questions to their pristine default factory seed state.
        </p>

        <button
          onClick={onResetData}
          className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>
    </div>
  );
};
