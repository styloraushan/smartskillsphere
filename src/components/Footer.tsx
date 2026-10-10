import React from 'react';
import { SmartSkillSphereLogo } from './SmartSkillSphereLogo';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#111214] text-[#F5F7FA] border-t border-[#25344A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <SmartSkillSphereLogo size="md" lightMode />
            <p className="text-xs text-slate-400 leading-relaxed">
              Learn Smart. Practice Daily. Grow Beyond Limits.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              A distinctive learning architecture engineered for competitive aptitude, engineering fundamentals, logical deductions, and daily mastery.
            </p>
          </div>

          {/* Column 2: Core Learning Paths */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C9A45C] mb-4">
              Learning Paths
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('practice_aptitude')}
                  className="hover:text-[#C9A45C] transition-colors"
                >
                  Quantitative Aptitude
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practice_reasoning')}
                  className="hover:text-[#C9A45C] transition-colors"
                >
                  Logical Reasoning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practice_verbal')}
                  className="hover:text-[#C9A45C] transition-colors"
                >
                  Verbal Ability
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practice_technical')}
                  className="hover:text-[#C9A45C] transition-colors"
                >
                  Computer Fundamentals & Technical MCQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('current_affairs')}
                  className="hover:text-[#C9A45C] transition-colors"
                >
                  Current Affairs Capsules
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Assessments */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C9A45C] mb-4">
              Arena & Practice
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('quizzes')} className="hover:text-[#C9A45C] transition-colors">
                  Live Quiz Arena
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('daily_challenge')} className="hover:text-[#C9A45C] transition-colors">
                  Daily Question Challenge
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('resources')} className="hover:text-[#C9A45C] transition-colors">
                  Notes & Manuscript Vault
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('polls')} className="hover:text-[#C9A45C] transition-colors">
                  Student Polls & Perspectives
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('leaderboard')} className="hover:text-[#C9A45C] transition-colors">
                  Global Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mistakes')} className="hover:text-[#C9A45C] transition-colors">
                  Mistake Book & Retest Drills
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C9A45C] mb-4">
              Platform & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#C9A45C] transition-colors">
                  About SmartSkillSphere
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#C9A45C] transition-colors">
                  Faculty Contact & Helpdesk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-[#C9A45C] transition-colors">
                  Privacy Policy & Data Rights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#C9A45C] transition-colors">
                  Terms of Service & Code of Conduct
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-[#C9A45C] transition-colors text-slate-400">
                  Faculty / Admin Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Clean copyright and minimal disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#25344A]/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© 2026 SmartSkillSphere. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Server-Verified Scoring</span>
            <span>·</span>
            <span>Zero-Distraction Practice</span>
            <span>·</span>
            <span className="text-[#C9A45C]">SmartSkillSphere v2.6</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
