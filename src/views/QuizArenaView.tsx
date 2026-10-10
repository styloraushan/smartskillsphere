import React, { useState } from 'react';
import { 
  Trophy, 
  Clock, 
  HelpCircle, 
  AlertTriangle, 
  ChevronRight, 
  Calculator, 
  Compass, 
  BookOpen, 
  Code2, 
  Globe,
  Sparkles
} from 'lucide-react';
import { Quiz } from '../types';

interface QuizArenaViewProps {
  quizzes: Quiz[];
  onSelectQuizForInstructions: (quiz: Quiz) => void;
}

export const QuizArenaView: React.FC<QuizArenaViewProps> = ({
  quizzes,
  onSelectQuizForInstructions,
}) => {
  const [activeFilterTab, setActiveFilterTab] = useState<'All' | 'Subject Wise' | 'Topic Wise' | 'Mock Tests'>('All');

  const filterTabs = ['All', 'Subject Wise', 'Topic Wise', 'Mock Tests'] as const;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'quantitative aptitude':
        return Calculator;
      case 'logical reasoning':
        return Compass;
      case 'verbal ability':
        return BookOpen;
      case 'technical practice':
        return Code2;
      default:
        return Globe;
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (activeFilterTab === 'Mock Tests') return q.totalQuestions >= 3;
    if (activeFilterTab === 'Subject Wise') return q.category.includes('Aptitude') || q.category.includes('Technical');
    if (activeFilterTab === 'Topic Wise') return Boolean(q.topic);
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header matching Screen 4 */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold font-display text-[#111214]">
          Quiz Arena
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Practice MCQs, assess accuracy under timed exam conditions, and improve your national percentile.
        </p>
      </div>

      {/* Filter Tabs matching Screen 4 */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilterTab(tab)}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              activeFilterTab === tab
                ? 'bg-[#111214] text-[#C9A45C]'
                : 'text-slate-600 hover:text-[#111214]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List of Quiz Cards matching Screen 4 */}
      <div className="space-y-4">
        {filteredQuizzes.map((quiz) => {
          const Icon = getCategoryIcon(quiz.category);

          return (
            <div
              key={quiz.id}
              className="bg-white border border-slate-200 hover:border-[#C9A45C] rounded-xl p-5 sm:p-6 transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#111214] text-[#C9A45C] flex items-center justify-center shrink-0 border border-[#25344A]">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-1">
                    <span className="text-[#A38038]">{quiz.category}</span>
                    <span>·</span>
                    <span>{quiz.topic}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#111214] group-hover:text-[#A38038] transition-colors truncate">
                    {quiz.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5 font-mono">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{quiz.totalQuestions} questions</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{quiz.durationMinutes} min</span>
                    </span>
                    <span>·</span>
                    <span className="capitalize">{quiz.difficulty}</span>
                    <span>·</span>
                    <span className="text-amber-600">-{quiz.negativeMarking} Neg Marking</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-bold text-[#111214] tabular-nums">
                    {quiz.attemptsCount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Total Attempts</div>
                </div>

                <button
                  onClick={() => onSelectQuizForInstructions(quiz)}
                  className="px-6 py-2.5 bg-[#111214] text-white hover:bg-[#C9A45C] hover:text-[#111214] text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Start</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
