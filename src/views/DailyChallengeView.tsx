import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  Award, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { User, Question } from '../types';
import { questionService } from '../services/api';

interface DailyChallengeViewProps {
  currentUser: User;
  onStartChallenge: (questions: Question[], title: string) => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  currentUser,
  onStartChallenge,
}) => {
  const [activeTab, setActiveTab] = useState<'Leaderboard' | 'My Stats' | 'Streaks'>('Leaderboard');

  const challengeQuestions = questionService.getAll().slice(0, 3);

  // Leaderboard data matching Screen 13
  const challengeRankings = [
    { rank: 1, name: 'Student A (Kavya V.)', score: '19/20', xp: '+250 XP', time: '11m 42s' },
    { rank: 2, name: 'Student B (Aditya D.)', score: '18/20', xp: '+200 XP', time: '12m 10s' },
    { rank: 3, name: 'Student C (Neha G.)', score: '18/20', xp: '+200 XP', time: '13m 05s' },
    { rank: 4, name: `${currentUser.name} (You)`, score: '17/20', xp: '+175 XP', time: '13m 48s', isSelf: true },
    { rank: 5, name: 'Rohan Joshi', score: '16/20', xp: '+150 XP', time: '14m 12s' },
  ];

  const streakDays = [
    { day: 'Mon', completed: true, date: 'Oct 05' },
    { day: 'Tue', completed: true, date: 'Oct 06' },
    { day: 'Wed', completed: true, date: 'Oct 07' },
    { day: 'Thu', completed: true, date: 'Oct 08' },
    { day: 'Fri', completed: true, date: 'Oct 09' },
    { day: 'Sat', completed: true, date: 'Oct 10', isToday: true },
    { day: 'Sun', completed: false, date: 'Oct 11' },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold font-display text-[#111214]">
          Daily Challenges & Streaks
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete today's 15-minute high-stakes challenge to preserve your daily streak and earn leaderboard bonus XP
        </p>
      </div>

      {/* Top Banner Card matching Screen 13 */}
      <div className="bg-[#111214] text-white p-6 sm:p-8 rounded-2xl border border-[#25344A] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              <Flame className="w-4 h-4" fill="#f59e0b" />
              <span>Sprint of the Day #84</span>
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Ends in 04:32:17</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Daily Challenge
          </h2>

          <div className="flex items-center gap-4 text-xs text-slate-300 font-mono">
            <span>20 Questions</span>
            <span>·</span>
            <span>15 Minutes</span>
            <span>·</span>
            <span className="text-[#C9A45C]">+250 Bonus XP</span>
          </div>
        </div>

        <button
          onClick={() => onStartChallenge(challengeQuestions, "Today's Daily Challenge Sprint")}
          className="px-8 py-3.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] text-xs font-bold rounded-xl transition-all shadow-md shrink-0 z-10 flex items-center gap-2"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Join Now</span>
        </button>

        {/* Ambient Glow */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#C9A45C]/10 blur-2xl pointer-events-none" />
      </div>

      {/* Tabs matching Screen 13 */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg w-fit">
        {(['Leaderboard', 'My Stats', 'Streaks'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === tab
                ? 'bg-[#111214] text-[#C9A45C]'
                : 'text-slate-600 hover:text-[#111214]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leaderboard Table Tab matching Screen 13 */}
      {activeTab === 'Leaderboard' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Today's Challenge Standings
            </h3>
            <span className="text-xs text-slate-400 font-mono">1,480 Participants</span>
          </div>

          <div className="divide-y divide-slate-100">
            {challengeRankings.map((row) => (
              <div
                key={row.rank}
                className={`p-4 flex items-center justify-between text-xs transition-colors ${
                  row.isSelf ? 'bg-[#C9A45C]/10 font-semibold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                      row.rank === 1
                        ? 'bg-amber-400 text-[#111214]'
                        : row.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : row.rank === 3
                        ? 'bg-amber-700/60 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {row.rank}
                  </div>
                  <div>
                    <span className="text-[#111214]">{row.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2 font-mono">({row.time})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono">
                  <span className="font-bold text-[#111214] tabular-nums">{row.score}</span>
                  <span className="text-emerald-700 font-bold">{row.xp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streaks Tab */}
      {activeTab === 'Streaks' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111214]">Weekly Streak Flame</h3>
              <p className="text-xs text-slate-500">Your practice streak is active at {currentUser.streak} consecutive days!</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-600" fill="#f59e0b" />
              <span>{currentUser.streak} Day Streak</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center">
            {streakDays.map((sd) => (
              <div
                key={sd.day}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-2 ${
                  sd.completed
                    ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#111214]'
                    : 'border-slate-200 bg-[#F5F7FA] text-slate-400'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{sd.day}</span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    sd.completed ? 'bg-[#111214] text-[#C9A45C]' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Flame className="w-4 h-4" fill={sd.completed ? '#C9A45C' : 'none'} />
                </div>
                <span className="text-[10px] font-mono">{sd.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Stats Tab */}
      {activeTab === 'My Stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center space-y-1">
            <span className="text-slate-400 text-xs font-medium">Challenges Solved</span>
            <div className="text-2xl font-bold font-mono text-[#111214]">14</div>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center space-y-1">
            <span className="text-slate-400 text-xs font-medium">Average Sprint Score</span>
            <div className="text-2xl font-bold font-mono text-emerald-700">86.4%</div>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center space-y-1">
            <span className="text-slate-400 text-xs font-medium">Challenge Bonus XP</span>
            <div className="text-2xl font-bold font-mono text-[#A38038]">+1,850 XP</div>
          </div>
        </div>
      )}
    </div>
  );
};
