import React from 'react';
import { 
  Flame, 
  Trophy, 
  Calculator, 
  Globe, 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { User, QuizAttempt } from '../types';

interface DashboardViewProps {
  currentUser: User;
  recentAttempts: QuizAttempt[];
  onNavigate: (tab: string, param?: string) => void;
  onResumePractice: (topic: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  recentAttempts,
  onNavigate,
  onResumePractice,
}) => {
  // Continue Learning records matching Screen 15
  const continueItems = [
    { title: 'Percentage & Commercial Mathematics', category: 'Quantitative Aptitude', progress: '2/15 Solved', percent: 20 },
    { title: 'Series Completion & Number Grids', category: 'Logical Reasoning', progress: '5/10 Solved', percent: 50 },
    { title: 'Error Detection & Subject-Verb Agreement', category: 'Verbal Ability', progress: '3/10 Solved', percent: 30 },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Header matching Screen 15 */}
      <div className="bg-[#111214] text-white p-6 sm:p-8 rounded-2xl border border-[#25344A] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A45C]">
            <Flame className="w-4 h-4 text-amber-500" fill="#f59e0b" />
            <span>{currentUser.streak} Day Streak · Your dedication burns bright!</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Good Morning, {currentUser.name.split(' ')[0]} 👋
          </h1>

          <p className="text-xs text-slate-300 max-w-xl">
            Target: <strong className="text-white">{currentUser.targetExam}</strong>. You have 3 active study sets queued for today's review session.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-[#1b1c20] p-4 rounded-xl border border-slate-700">
          <div className="text-right">
            <div className="text-lg font-bold font-mono text-[#C9A45C] tabular-nums">
              {currentUser.xp.toLocaleString()} XP
            </div>
            <div className="text-[10px] text-slate-400">Total Scholarly XP</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#C9A45C]/20 border border-[#C9A45C] flex items-center justify-center text-[#C9A45C]">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4 Quick Action Buttons matching Screen 15 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('practice_aptitude')}
          className="p-4 bg-white border border-slate-200 hover:border-[#C9A45C] hover:shadow-md rounded-xl transition-all flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] text-[#111214] group-hover:bg-[#111214] group-hover:text-[#C9A45C] flex items-center justify-center shrink-0 transition-colors">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111214]">Practice</h4>
            <span className="text-[10px] text-slate-400">Custom Drills</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('quizzes')}
          className="p-4 bg-white border border-slate-200 hover:border-[#C9A45C] hover:shadow-md rounded-xl transition-all flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] text-[#111214] group-hover:bg-[#111214] group-hover:text-[#C9A45C] flex items-center justify-center shrink-0 transition-colors">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111214]">Mock Test</h4>
            <span className="text-[10px] text-slate-400">Live Arena</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('current_affairs')}
          className="p-4 bg-white border border-slate-200 hover:border-[#C9A45C] hover:shadow-md rounded-xl transition-all flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] text-[#111214] group-hover:bg-[#111214] group-hover:text-[#C9A45C] flex items-center justify-center shrink-0 transition-colors">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111214]">Current Affairs</h4>
            <span className="text-[10px] text-slate-400">Daily Digest</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('resources')}
          className="p-4 bg-white border border-slate-200 hover:border-[#C9A45C] hover:shadow-md rounded-xl transition-all flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] text-[#111214] group-hover:bg-[#111214] group-hover:text-[#C9A45C] flex items-center justify-center shrink-0 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111214]">Study Plan</h4>
            <span className="text-[10px] text-slate-400">Notes & Vault</span>
          </div>
        </button>
      </div>

      {/* Main Dashboard Split Layout matching Screen 15 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Continue Learning matching Screen 15 */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display text-[#111214]">
              Continue Learning
            </h2>
            <span className="text-xs text-slate-400">Active Workspaces</span>
          </div>

          <div className="space-y-3">
            {continueItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-[#C9A45C] rounded-xl p-5 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A38038]">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#111214]">
                    {item.title}
                  </h3>

                  {/* Progress Bar matching Screen 15 */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.percent}%` }}
                        className="bg-[#C9A45C] h-full rounded-full transition-all duration-300"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.progress} ({item.percent}%)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onResumePractice(item.title)}
                  className="px-5 py-2 bg-[#111214] hover:bg-[#C9A45C] hover:text-[#111214] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
              </div>
            ))}
          </div>

          {/* Recent Quiz Attempts List */}
          <div className="pt-4 space-y-3">
            <h3 className="text-sm font-bold text-[#111214]">Recent Assessment Scores</h3>
            {recentAttempts.length > 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                {recentAttempts.slice(0, 3).map((att) => (
                  <div key={att.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[#111214]">{att.quizTitle}</h4>
                      <span className="text-[11px] text-slate-400">
                        {new Date(att.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-[#111214]">{att.score} pts</div>
                      <div className="text-emerald-700 font-semibold">{att.accuracy}% acc</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                You haven't completed any mock tests yet. Take your first quiz in the Arena!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Weekly Progress & Subject Accuracy matching Screen 15 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Subject Accuracy Radar
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Quantitative Aptitude</span>
                  <span className="font-mono text-emerald-700">82%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[82%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Logical Reasoning</span>
                  <span className="font-mono text-emerald-700">88%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[88%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Verbal Ability</span>
                  <span className="font-mono text-amber-600">65%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[65%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Computer Fundamentals</span>
                  <span className="font-mono text-emerald-700">91%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[91%]" />
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed">
              <span className="font-bold">Diagnostic Tip:</span> Your verbal accuracy is currently your largest growth opportunity. Review the High-Frequency Vocabulary manuscript in the Vault.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
