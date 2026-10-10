import React, { useState } from 'react';
import { SmartSkillSphereLogo } from './SmartSkillSphereLogo';
import { User } from '../types';
import { 
  Search, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Bookmark, 
  ShieldCheck, 
  ChevronDown,
  User as UserIcon
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onRoleSwitch?: (role: 'student' | 'super_admin') => void;
  onOpenAuth?: (mode?: 'login' | 'signup' | 'admin_login') => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onNavigate,
  onRoleSwitch,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Exact navigation items specified by prompt: Home, Notes, Quiz, Polls, Aptitude, More
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'resources', label: 'Notes' },
    { id: 'quizzes', label: 'Quiz' },
    { id: 'polls', label: 'Polls' },
    { id: 'practice_aptitude', label: 'Aptitude' },
    { id: 'dashboard', label: 'More' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#101820]/95 text-white border-b border-[#25344A]/40 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          {/* Left: Circular gold educational logo icon + Brand text "SMARTSKILLSPHERE" in uppercase gold letters */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A94F]"
            aria-label="SmartSkillSphere Home"
          >
            <SmartSkillSphereLogo size="sm" lightMode goldCaps />
          </button>

          {/* Center Navigation: Home, Notes, Quiz, Polls, Aptitude, More */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative py-1.5 whitespace-nowrap transition-colors select-none ${
                    isActive
                      ? 'text-[#D5A94F] font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D5A94F] rounded-full shadow-[0_0_8px_rgba(213,169,79,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Side: Search Icon + Gold Login/Sign Up (or Logged-in Account with Logout) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Search Icon */}
            <button
              onClick={() => onNavigate('resources')}
              title="Search notes and quizzes"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D5A94F]"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Super Admin Quick Shortcut button when authenticated as super_admin */}
            {currentUser?.role === 'super_admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 text-xs font-bold rounded-full transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Super Admin Portal</span>
              </button>
            )}

            {/* Authentication State: Logged In vs Logged Out / Guest */}
            {currentUser && currentUser.role !== 'guest' ? (
              <div className="flex items-center gap-2">
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full border border-slate-700/80 hover:border-[#D5A94F] bg-[#142536] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A94F]"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#D5A94F]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-64 bg-[#101820] border border-[#25344A] text-slate-200 shadow-2xl rounded-2xl py-2 z-50 text-xs animate-in fade-in duration-150"
                    >
                      <div className="px-4 py-2.5 border-b border-[#25344A]">
                        <p className="font-semibold text-white truncate">{currentUser.name}</p>
                        <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                          <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                            currentUser.role === 'super_admin'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-[#D5A94F]/20 text-[#D5A94F] border border-[#D5A94F]/40'
                          }`}>
                            {currentUser.role}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-300">XP: {currentUser.xp.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        {currentUser.role === 'super_admin' ? (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onNavigate('admin');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#142536] flex items-center gap-2 text-rose-300 font-semibold"
                          >
                            <ShieldCheck className="w-4 h-4 text-rose-400" />
                            <span>Super Admin Dashboard</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onNavigate('dashboard');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#142536] flex items-center gap-2"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#D5A94F]" />
                            <span>Student Portal</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('bookmarks');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-[#142536] flex items-center gap-2"
                        >
                          <Bookmark className="w-4 h-4 text-[#D5A94F]" />
                          <span>Saved Notes</span>
                        </button>

                        {onRoleSwitch && (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onRoleSwitch(currentUser.role === 'super_admin' ? 'student' : 'super_admin');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#142536] flex items-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#D5A94F]" />
                            <span>
                              Switch to {currentUser.role === 'super_admin' ? 'Student' : 'Super Admin'} Role
                            </span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-[#25344A]">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            if (onLogout) onLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Log Out Button */}
                <button
                  onClick={() => onLogout && onLogout()}
                  title="Sign out of account"
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              /* Gold Login / Sign Up Button (With Guest Indicator if in Guest Mode) */
              <div className="flex items-center gap-2">
                {currentUser?.role === 'guest' && (
                  <span className="hidden xl:inline text-[11px] text-[#AAB4C2] font-mono bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                    Guest Mode
                  </span>
                )}
                <button
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="px-5 py-2 bg-gradient-to-r from-[#D5A94F] to-[#B88728] hover:from-[#F5D982] hover:to-[#D5A94F] text-[#101820] text-xs sm:text-sm font-bold rounded-full transition-all shadow-md active:scale-95 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A94F]"
                >
                  Login / Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('resources')}
              className="p-2 text-slate-300 hover:text-white"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#101820] border-b border-[#25344A] px-4 pt-2 pb-6 space-y-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.id);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === link.id
                    ? 'bg-[#142536] text-[#D5A94F] font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#25344A]">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-[#142536] rounded-xl">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#D5A94F]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{currentUser.role} Role</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full py-2 bg-rose-500/15 text-rose-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuth) onOpenAuth('login');
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#D5A94F] to-[#B88728] text-[#101820] text-sm font-bold rounded-xl text-center"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
