import React, { useState } from 'react';
import { 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Users, 
  AlertCircle,
  TrendingUp,
  PlusCircle
} from 'lucide-react';
import { Poll } from '../types';
import { pollService } from '../services/api';

interface PollsViewProps {
  polls: Poll[];
  onPollVoted: () => void;
  isAdmin?: boolean;
}

export const PollsView: React.FC<PollsViewProps> = ({
  polls,
  onPollVoted,
  isAdmin = false,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredPolls = polls.filter((p) => p.status === activeTab);

  const handleSelectOption = (poll: Poll, optionId: string) => {
    if (poll.userVotedOptionIds && poll.userVotedOptionIds.length > 0) return;

    if (poll.isMultiChoice) {
      setSelectedOptions((prev) => {
        const current = prev[poll.id] || [];
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [poll.id]: next };
      });
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        [poll.id]: [optionId],
      }));
    }
  };

  const handleVoteSubmit = (pollId: string) => {
    const opts = selectedOptions[pollId];
    if (!opts || opts.length === 0) {
      setErrorMessage('Please select an option before casting your vote.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      pollService.vote(pollId, opts);
      setSuccessMessage('Your vote has been verified and registered.');
      setTimeout(() => setSuccessMessage(null), 3000);
      onPollVoted();
    } catch (err: any) {
      setErrorMessage(err.message || 'Voting error');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header matching Screen 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#111214]">
            Community Polls & Perspectives
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Voice your viewpoint on examination formats, syllabus priority, and daily preparation patterns
          </p>
        </div>

        {/* Segmented Tab matching Screen 8 */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === 'active'
                ? 'bg-[#111214] text-[#C9A45C]'
                : 'text-slate-600 hover:text-[#111214]'
            }`}
          >
            Active Polls
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === 'archived'
                ? 'bg-[#111214] text-[#C9A45C]'
                : 'text-slate-600 hover:text-[#111214]'
            }`}
          >
            Past Polls
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Poll Cards matching Screen 8 & 9 */}
      <div className="space-y-6">
        {filteredPolls.map((poll) => {
          const hasVoted = Boolean(poll.userVotedOptionIds && poll.userVotedOptionIds.length > 0);
          const currentSelected = selectedOptions[poll.id] || poll.userVotedOptionIds || [];

          return (
            <div
              key={poll.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#A38038]">
                    {poll.category} · {poll.isMultiChoice ? 'Multiple Choice' : 'Single Choice'}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#111214] mt-1">
                    {poll.question}
                  </h2>
                  {poll.description && (
                    <p className="text-xs text-slate-500 mt-1">{poll.description}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                    {poll.totalVotes.toLocaleString()} votes
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {poll.status === 'active' ? 'Active' : 'Archived'}
                  </div>
                </div>
              </div>

              {/* Options list with vote percentages */}
              <div className="space-y-3">
                {poll.options.map((option) => {
                  const percentage = poll.totalVotes > 0
                    ? Math.round((option.votes / poll.totalVotes) * 100)
                    : 0;
                  const isSelected = currentSelected.includes(option.id);

                  return (
                    <div
                      key={option.id}
                      onClick={() => !hasVoted && handleSelectOption(poll, option.id)}
                      className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                        hasVoted
                          ? 'border-slate-200 cursor-default bg-slate-50/50'
                          : isSelected
                          ? 'border-[#C9A45C] bg-[#C9A45C]/10 ring-1 ring-[#C9A45C] cursor-pointer'
                          : 'border-slate-200 hover:border-slate-400 bg-white cursor-pointer'
                      }`}
                    >
                      {/* Vote Percentage fill bar in background matching Screen 8 */}
                      {hasVoted && (
                        <div
                          style={{ width: `${percentage}%` }}
                          className="absolute inset-y-0 left-0 bg-[#C9A45C]/20 transition-all duration-500 pointer-events-none"
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-[#C9A45C] bg-[#C9A45C] text-[#111214]'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#111214]" />}
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-[#111214]">
                            {option.text}
                          </span>
                        </div>

                        {/* Percentage and Vote Count matching Screen 8 */}
                        {hasVoted && (
                          <div className="flex items-center gap-2 shrink-0 font-mono text-xs font-bold text-[#111214]">
                            <span className="tabular-nums">{percentage}%</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({option.votes})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions matching Screen 8 */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ends on: {poll.endsAt}</span>
                </div>

                {!hasVoted && poll.status === 'active' && (
                  <button
                    onClick={() => handleVoteSubmit(poll.id)}
                    className="px-6 py-2 bg-[#111214] hover:bg-[#C9A45C] hover:text-[#111214] text-white font-bold rounded-lg transition-colors"
                  >
                    Cast Vote
                  </button>
                )}

                {hasVoted && (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your vote is counted</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredPolls.length === 0 && (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            No polls in this category currently.
          </div>
        )}
      </div>
    </div>
  );
};
