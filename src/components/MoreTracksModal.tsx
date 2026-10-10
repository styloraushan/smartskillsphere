import React from 'react';
import { 
  X, 
  Flame, 
  Award, 
  RotateCcw, 
  Bookmark, 
  Vote, 
  GraduationCap, 
  FileSpreadsheet, 
  BrainCircuit, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface MoreTracksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, param?: string) => void;
}

export const MoreTracksModal: React.FC<MoreTracksModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const extraTracks = [
    {
      id: 'daily_challenge',
      title: 'Daily Streak Sprints',
      desc: '15-minute high-yield sprints with real-time leaderboard XP multipliers.',
      icon: Flame,
      color: 'text-amber-500 bg-amber-50 border-amber-200',
    },
    {
      id: 'quizzes',
      title: 'Full Mock Test Arena',
      desc: 'National exam pattern simulations with negative marking formulas.',
      icon: Award,
      color: 'text-purple-500 bg-purple-50 border-purple-200',
    },
    {
      id: 'mistakes',
      title: 'Mistake Book & Retest Engine',
      desc: 'Smart cataloging of all incorrectly answered questions for targeted retesting.',
      icon: RotateCcw,
      color: 'text-rose-500 bg-rose-50 border-rose-200',
    },
    {
      id: 'bookmarks',
      title: 'Personal Study Shelf',
      desc: 'Bookmarked formula sheets, code summaries, and high-yield notes.',
      icon: Bookmark,
      color: 'text-blue-500 bg-blue-50 border-blue-200',
    },
    {
      id: 'polls',
      title: 'Live Community Consensus Polls',
      desc: 'Vote on tricky ambiguity MCQs and view real-time cohort distribution.',
      icon: Vote,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'leaderboard',
      title: 'Global Hall of Fame',
      desc: 'Weekly, monthly, and all-time leaderboard rankings across disciplines.',
      icon: GraduationCap,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="more-tracks-title"
      >
        {/* Header */}
        <div className="p-6 bg-[#101820] text-white flex items-center justify-between border-b border-[#25344A]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D5A94F]">
              Comprehensive Learning Tracks
            </span>
            <h3 id="more-tracks-title" className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
              Explore All Categories & Disciplines
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracks List */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {extraTracks.map((track) => {
            const Icon = track.icon;
            return (
              <button
                key={track.id}
                onClick={() => {
                  onClose();
                  onNavigate(track.id);
                }}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#D5A94F] hover:shadow-md transition-all text-left flex items-start gap-3.5 group bg-white"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${track.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#182538] group-hover:text-[#D5A94F] transition-colors">
                      {track.title}
                    </h4>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {track.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F8FC] border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 px-6">
          <span>Curated for GATE CS, Placements, CAT & Competitive Exams</span>
          <button
            onClick={() => {
              onClose();
              onNavigate('resources');
            }}
            className="font-bold text-[#D5A94F] hover:underline"
          >
            Browse all 1,000+ notes &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

