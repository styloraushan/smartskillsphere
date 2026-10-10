import React, { useState } from 'react';
import { 
  Award, 
  Crown, 
  Flame, 
  Star, 
  Trophy, 
  ChevronUp, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { LeaderboardEntry, User } from '../types';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentUser: User;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  currentUser,
}) => {
  const [period, setPeriod] = useState<'Weekly' | 'Monthly'>('Weekly');

  // Top 3 for podium matching Screen 14
  const topThree = [
    { rank: 1, name: 'Ayesha Khan', xp: '2450 XP', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', badge: 'National Scholar' },
    { rank: 2, name: 'Rohit Verma', xp: '2320 XP', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', badge: 'Aptitude Ace' },
    { rank: 3, name: 'Priya Nair', xp: '2180 XP', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', badge: 'Speed Master' },
  ];

  // Ranks table matching Screen 14
  const rankRows = [
    { rank: 4, name: 'Sushant Rao', xp: '2040 XP', target: 'GATE CS', accuracy: '91%' },
    { rank: 5, name: 'Neha Gupta', xp: '1900 XP', target: 'Campus Placements', accuracy: '89%' },
    { rank: 6, name: `${currentUser.name} (You)`, xp: `${currentUser.xp.toLocaleString()} XP`, target: currentUser.targetExam, accuracy: '86%', isSelf: true },
    { rank: 7, name: 'Aman Deep', xp: '1620 XP', target: 'CAT Quantitative', accuracy: '84%' },
    { rank: 8, name: 'Sneha Patel', xp: '1480 XP', target: 'SSC CGL', accuracy: '81%' },
    { rank: 9, name: 'Varun Kumar', xp: '1390 XP', target: 'Campus Drives', accuracy: '79%' },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header matching Screen 14 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#111214]">
            Leaderboard & Hall of Scholars
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time rankings based on cumulative practice accuracy, test scores, and streak consistency
          </p>
        </div>

        {/* Weekly / Monthly Toggle matching Screen 14 */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
          {(['Weekly', 'Monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors ${
                period === p
                  ? 'bg-[#111214] text-[#C9A45C]'
                  : 'text-slate-600 hover:text-[#111214]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards matching Screen 14 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {/* 2nd Place (Rohit) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-sm flex flex-col items-center justify-between order-2 sm:order-1">
          <div className="relative">
            <img
              src={topThree[1].avatar}
              alt={topThree[1].name}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-300"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-2 bg-slate-300 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-full font-mono">
              #2
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#111214]">{topThree[1].name}</h3>
            <span className="text-[11px] text-slate-400">{topThree[1].badge}</span>
          </div>

          <div className="pt-2 border-t border-slate-100 w-full font-mono font-bold text-xs text-[#A38038]">
            {topThree[1].xp}
          </div>
        </div>

        {/* 1st Place (Ayesha) Center & Elevated */}
        <div className="bg-[#111214] text-white border-2 border-[#C9A45C] rounded-2xl p-6 text-center space-y-3 shadow-xl flex flex-col items-center justify-between order-1 sm:order-2 sm:-translate-y-3">
          <div className="relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400">
              <Crown className="w-6 h-6 fill-amber-400" />
            </div>
            <img
              src={topThree[0].avatar}
              alt={topThree[0].name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#C9A45C]"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-2 bg-[#C9A45C] text-[#111214] text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono">
              #1 Champion
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">{topThree[0].name}</h3>
            <span className="text-[11px] text-[#C9A45C] font-medium">{topThree[0].badge}</span>
          </div>

          <div className="pt-2 border-t border-slate-800 w-full font-mono font-bold text-sm text-[#C9A45C]">
            {topThree[0].xp}
          </div>
        </div>

        {/* 3rd Place (Priya) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-sm flex flex-col items-center justify-between order-3">
          <div className="relative">
            <img
              src={topThree[2].avatar}
              alt={topThree[2].name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-700/50"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-2 bg-amber-700/60 text-white text-[11px] font-bold px-2 py-0.5 rounded-full font-mono">
              #3
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#111214]">{topThree[2].name}</h3>
            <span className="text-[11px] text-slate-400">{topThree[2].badge}</span>
          </div>

          <div className="pt-2 border-t border-slate-100 w-full font-mono font-bold text-xs text-[#A38038]">
            {topThree[2].xp}
          </div>
        </div>
      </div>

      {/* Standings Table matching Screen 14 */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Cohort Leaderboard Standings
          </h3>
          <span className="text-xs text-slate-400 font-mono">Updated 10m ago</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {rankRows.map((row) => (
            <div
              key={row.rank}
              className={`p-4 flex items-center justify-between transition-colors ${
                row.isSelf
                  ? 'bg-[#C9A45C]/15 font-semibold border-l-4 border-[#C9A45C]'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-6 font-mono font-bold text-slate-400 tabular-nums">
                  #{row.rank}
                </span>

                <div>
                  <span className="text-[#111214] font-bold">{row.name}</span>
                  <span className="text-[11px] text-slate-400 ml-2">{row.target}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono">
                <span className="text-slate-500 hidden sm:inline">{row.accuracy} Accuracy</span>
                <span className="font-bold text-[#111214] tabular-nums">{row.xp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
