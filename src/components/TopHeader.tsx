import React, { useState } from 'react';
import { Search, Bell, ShieldCheck, Flame, BookOpen, Menu } from 'lucide-react';
import { User } from '../types';

interface TopHeaderProps {
  currentUser: User;
  onNavigate: (tab: string, param?: string) => void;
  onSearch?: (query: string) => void;
  onRoleSwitch: (role: 'student' | 'super_admin') => void;
  onMenuToggle?: () => void;
  title?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  onNavigate,
  onSearch,
  onRoleSwitch,
  onMenuToggle,
  title,
}) => {
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
    } else {
      onNavigate('resources', searchVal);
    }
  };

  return (
    <header className="h-16 bg-[#111214] text-white border-b border-[#25344A] px-3 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 sticky top-0 z-30 shrink-0">
      {/* Title / Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-xl">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-1 text-slate-300 hover:text-white hover:bg-[#25344A]/60 rounded transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title ? (
          <h2 className="text-sm sm:text-base font-bold text-white font-display truncate hidden sm:block">
            {title}
          </h2>
        ) : null}

        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search notes, quizzes, topics..."
            className="w-full bg-[#1b1c20] text-slate-200 pl-9 pr-4 py-1.5 text-xs rounded border border-slate-700 focus:outline-none focus:border-[#C9A45C] placeholder-slate-500"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Streak indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-amber-500" fill="#f59e0b" />
          <span className="tabular-nums">{currentUser.streak} Days</span>
        </div>

        {/* Role toggle badge */}
        {/* <button
          onClick={() => onRoleSwitch(currentUser.role === 'admin' ? 'student' : 'admin')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs border border-[#C9A45C]/50 text-[#C9A45C] hover:bg-[#C9A45C]/10 transition-colors rounded"
          title="Click to toggle between Student and Admin"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="capitalize">{currentUser.role} Mode</span>
        </button> */}

        {/* Profile Trigger */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 p-1 rounded hover:bg-[#25344A]/60 transition-colors"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-[#C9A45C]"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
    </header>
  );
};
