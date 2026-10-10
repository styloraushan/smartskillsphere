import React from 'react';
import { 
  Home, 
  FileText, 
  Trophy, 
  BarChart2, 
  Calculator, 
  Globe, 
  Flame, 
  Award, 
  LayoutDashboard, 
  Settings, 
  User as UserIcon,
  BookOpen,
  Code2,
  Compass,
  AlertCircle,
  Bookmark,
  ShieldCheck
} from 'lucide-react';
import { SmartSkillSphereLogo } from './SmartSkillSphereLogo';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string, param?: string) => void;
  currentUser: User;
  onRoleSwitch: (role: 'student' | 'super_admin') => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  currentUser,
  onRoleSwitch,
}) => {
  const primaryMenuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'resources', label: 'Notes & Resources', icon: FileText },
    { id: 'quizzes', label: 'Quiz Arena', icon: Trophy },
    { id: 'polls', label: 'Polls', icon: BarChart2 },
    { id: 'practice_aptitude', label: 'Aptitude Practice', icon: Calculator },
    { id: 'practice_reasoning', label: 'Logical Reasoning', icon: Compass },
    { id: 'practice_verbal', label: 'Verbal Ability', icon: BookOpen },
    { id: 'practice_technical', label: 'Technical Practice', icon: Code2 },
    { id: 'current_affairs', label: 'Current Affairs', icon: Globe },
    { id: 'daily_challenge', label: 'Challenges', icon: Flame },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'dashboard', label: 'My Learning', icon: LayoutDashboard },
  ];

  const secondaryMenuItems = [
    { id: 'mistakes', label: 'Mistake Book', icon: AlertCircle },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <aside className="w-64 bg-[#111214] text-slate-300 border-r border-[#25344A] flex flex-col h-screen sticky top-0 shrink-0 select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#25344A] flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="text-left focus:outline-none"
        >
          <SmartSkillSphereLogo size="sm" lightMode />
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 py-3 px-2 space-y-1">
        {primaryMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded transition-all text-left ${
                isActive
                  ? 'bg-[#C9A45C] text-[#111214] font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#25344A]/50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#111214]' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <div className="pt-3 pb-1 border-t border-[#25344A]/60 my-2">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Personal Space
          </p>
          {secondaryMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded transition-all text-left ${
                  isActive
                    ? 'bg-[#C9A45C] text-[#111214] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#25344A]/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#111214]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Admin Link if admin or switcher */}
        {/* <div className="pt-2 border-t border-[#25344A]/60">
          <button
            onClick={() => onNavigate('admin')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded transition-all text-left ${
              activeTab === 'admin'
                ? 'bg-[#C9A45C] text-[#111214]'
                : 'text-[#C9A45C] hover:bg-[#C9A45C]/15'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">Admin Console</span>
          </button>
        </div> */}
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-[#25344A] bg-[#0c0d0f] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-[#C9A45C]/60 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <p className="font-semibold text-white truncate text-[11px]">{currentUser.name}</p>
            <p className="text-slate-400 text-[10px] truncate capitalize">{currentUser.role} · {currentUser.streak}d streak</p>
          </div>
        </div>

        <button
          onClick={() => onRoleSwitch(currentUser.role === 'super_admin' ? 'student' : 'super_admin')}
          title="Switch Demo Role"
          className="p-1 rounded text-slate-400 hover:text-[#C9A45C] hover:bg-[#25344A]/60 transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
