import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  Bookmark, 
  ArrowLeft, 
  Clock, 
  Award, 
  ChevronDown, 
  ChevronUp,
  Share2
} from 'lucide-react';
import { QuizAttempt, Question } from '../types';
import { mistakeService } from '../services/api';

interface QuizResultsViewProps {
  attempt: QuizAttempt;
  questions: Question[];
  onRetryIncorrect: (incorrectQuestions: Question[]) => void;
  onBackToArena: () => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  attempt,
  questions,
  onRetryIncorrect,
  onBackToArena,
}) => {
  const [filter, setFilter] = useState<'All' | 'Correct' | 'Incorrect' | 'Unattempted'>('All');
  const [savedMistakes, setSavedMistakes] = useState<string[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>(questions.map((q) => q.id));

  const incorrectQuestions = questions.filter((q) => {
    const selected = attempt.answers[q.id];
    return selected && selected !== q.correctOptionId;
  });

  const handleSaveToMistakes = (questionId: string) => {
    mistakeService.add(questionId, 'Flagged from quiz review for spaced repetition');
    setSavedMistakes((prev) => [...prev, questionId]);
  };

  const toggleExpand = (id: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredQuestions = questions.filter((q) => {
    const selected = attempt.answers[q.id];
    if (filter === 'Correct') return selected === q.correctOptionId;
    if (filter === 'Incorrect') return selected && selected !== q.correctOptionId;
    if (filter === 'Unattempted') return !selected;
    return true;
  });

  const minutes = Math.floor(attempt.timeSpentSeconds / 60);
  const seconds = attempt.timeSpentSeconds % 60;

  // Grade descriptor
  const getRatingTag = (acc: number) => {
    if (acc >= 85) return { label: 'Strong', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (acc >= 65) return { label: 'Good', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (acc >= 45) return { label: 'Average', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Needs Focus', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const rating = getRatingTag(attempt.accuracy);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToArena}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#111214] hover:text-[#A38038] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quiz Arena</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Assessment Completed: {new Date(attempt.completedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Main Score & Topic-wise Performance matching Screen 7 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-bold font-display text-[#111214]">
            Assessment Performance Summary
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {attempt.quizTitle}
          </p>
        </div>

        {/* Circular Gauge + Key Metrics matching Screen 7 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Circular Score Gauge */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[#F5F7FA] rounded-2xl border border-slate-200">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Circular SVG Ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-200"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#C9A45C]"
                  strokeWidth="8"
                  strokeDasharray={`${(attempt.accuracy / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-[#111214]">
                  {attempt.accuracy}%
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Accuracy
                </span>
              </div>
            </div>

            <div className="mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${rating.color}`}>
                ● {rating.label}
              </span>
            </div>
          </div>

          {/* Metric Cards Breakdown */}
          <div className="md:col-span-7 grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Score Achieved</span>
              <span className="text-lg font-bold font-mono text-[#111214]">
                {attempt.score} <span className="text-xs text-slate-400">/ {attempt.totalPossibleMarks}</span>
              </span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Time Invested</span>
              <span className="text-lg font-bold font-mono text-[#111214]">
                {minutes}m {seconds}s
              </span>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
              <span className="text-emerald-700 block text-[10px] uppercase font-semibold">Correct Answers</span>
              <span className="text-lg font-bold font-mono text-emerald-800">
                {attempt.correctCount}
              </span>
            </div>

            <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl">
              <span className="text-rose-700 block text-[10px] uppercase font-semibold">Incorrect Answers</span>
              <span className="text-lg font-bold font-mono text-rose-800">
                {attempt.incorrectCount}
              </span>
            </div>
          </div>
        </div>

        {/* Action Drill Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          {incorrectQuestions.length > 0 && (
            <button
              onClick={() => onRetryIncorrect(incorrectQuestions)}
              className="px-5 py-2.5 bg-[#111214] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-[#C9A45C]" />
              <span>Retry Incorrect Answers ({incorrectQuestions.length})</span>
            </button>
          )}

          <button
            onClick={onBackToArena}
            className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] text-xs font-bold rounded-lg transition-colors"
          >
            Practice Another Quiz
          </button>
        </div>
      </div>

      {/* Question Review Section with Filter tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold font-display text-[#111214]">
            Detailed Solution & Explanations
          </h2>

          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg text-xs">
            {(['All', 'Correct', 'Incorrect', 'Unattempted'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded transition-colors font-medium ${
                  filter === tab
                    ? 'bg-[#111214] text-[#C9A45C]'
                    : 'text-slate-600 hover:text-[#111214]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Question Explanations List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const selectedOptId = attempt.answers[q.id];
            const isCorrect = selectedOptId === q.correctOptionId;
            const isUnattempted = !selectedOptId;
            const isExpanded = expandedQuestions.includes(q.id);
            const isSaved = savedMistakes.includes(q.id);

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              >
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : isUnattempted ? (
                      <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}

                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        Question {idx + 1} · {q.topic}
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#111214] truncate mt-0.5">
                        {q.text}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isCorrect
                          ? 'text-emerald-700'
                          : isUnattempted
                          ? 'text-slate-400'
                          : 'text-rose-700'
                      }`}
                    >
                      {isCorrect ? `+${q.marks}` : isUnattempted ? '0' : `-${q.negativeMarks}`}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 border-t border-slate-100 bg-[#F5F7FA] space-y-4 text-xs">
                    <div className="text-slate-800 font-medium leading-relaxed">
                      {q.text}
                    </div>

                    {/* Options list showing user choice vs correct */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isThisCorrect = opt.id === q.correctOptionId;
                        const isThisChosen = opt.id === selectedOptId;

                        let style = 'bg-white border-slate-200 text-slate-600';
                        if (isThisCorrect) {
                          style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                        } else if (isThisChosen && !isThisCorrect) {
                          style = 'bg-rose-50 border-rose-400 text-rose-900 font-semibold ring-1 ring-rose-400';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-lg border flex items-center justify-between gap-2 text-xs ${style}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[11px]">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              <span>{opt.text}</span>
                            </div>
                            {isThisCorrect && (
                              <span className="text-[10px] font-bold text-emerald-700 uppercase">Correct</span>
                            )}
                            {isThisChosen && !isThisCorrect && (
                              <span className="text-[10px] font-bold text-rose-700 uppercase">Your Choice</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Faculty Explanation Card */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#A38038] uppercase text-[11px] tracking-wide">
                          Official Solution & Methodology:
                        </span>

                        {!isCorrect && (
                          <button
                            onClick={() => handleSaveToMistakes(q.id)}
                            disabled={isSaved}
                            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                              isSaved
                                ? 'bg-amber-100 border-amber-300 text-amber-800'
                                : 'border-slate-300 hover:border-[#111214] text-slate-700'
                            }`}
                          >
                            <Bookmark className="w-3 h-3" fill={isSaved ? '#b45309' : 'none'} />
                            <span>{isSaved ? 'In Mistake Book' : 'Add to Mistake Book'}</span>
                          </button>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed text-xs">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
