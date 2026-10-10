import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  CheckSquare, 
  RotateCcw,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { Quiz } from '../types';

interface QuizInstructionsViewProps {
  quiz: Quiz;
  onBack: () => void;
  onStart: () => void;
}

export const QuizInstructionsView: React.FC<QuizInstructionsViewProps> = ({
  quiz,
  onBack,
  onStart,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#111214] hover:text-[#A38038] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Quiz Arena</span>
      </button>

      {/* Main Instructions Card matching Screen 5 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A38038]">
              {quiz.category} · {quiz.topic}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#111214] mt-1">
              {quiz.title}
            </h1>
            <p className="text-xs text-slate-500 mt-2 max-w-lg leading-relaxed">
              {quiz.description}
            </p>
          </div>

          {/* Stopwatch / Exam Badge Illustration */}
          <div className="w-20 h-20 rounded-2xl bg-[#111214] border border-[#C9A45C]/40 flex flex-col items-center justify-center text-[#C9A45C] shrink-0 self-start sm:self-auto shadow-md">
            <Clock className="w-8 h-8" />
            <span className="text-[10px] font-mono mt-1 font-bold text-white">TIMED</span>
          </div>
        </div>

        {/* 3 Metric Pills matching Screen 5 */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="p-4 bg-[#F5F7FA] border border-slate-200 rounded-xl">
            <HelpCircle className="w-5 h-5 text-[#A38038] mx-auto mb-1.5" />
            <div className="text-sm font-bold text-[#111214] font-mono tabular-nums">
              {quiz.totalQuestions} Questions
            </div>
            <div className="text-[11px] text-slate-400">Total Count</div>
          </div>

          <div className="p-4 bg-[#F5F7FA] border border-slate-200 rounded-xl">
            <Clock className="w-5 h-5 text-[#A38038] mx-auto mb-1.5" />
            <div className="text-sm font-bold text-[#111214] font-mono tabular-nums">
              {quiz.durationMinutes} Minutes
            </div>
            <div className="text-[11px] text-slate-400">Duration</div>
          </div>

          <div className="p-4 bg-[#F5F7FA] border border-slate-200 rounded-xl">
            <Flame className="w-5 h-5 text-[#A38038] mx-auto mb-1.5" />
            <div className="text-sm font-bold text-[#111214] capitalize">
              {quiz.difficulty}
            </div>
            <div className="text-[11px] text-slate-400">Difficulty</div>
          </div>
        </div>

        {/* Instructions list matching Screen 5 */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-[#111214] uppercase tracking-wider">
            Assessment Instructions:
          </h3>

          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A38038] shrink-0 mt-0.5" />
              <span>Read each question carefully before choosing your response.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A38038] shrink-0 mt-0.5" />
              <span>Select the correct option from the given multiple choices. Each correct answer awards <strong>+{quiz.marksPerQuestion} marks</strong>.</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Negative marking applies: An incorrect answer will deduct <strong>-{quiz.negativeMarking} marks</strong>.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A38038] shrink-0 mt-0.5" />
              <span>You can <strong>Mark questions for review</strong> and revisit them anytime during the test session.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A38038] shrink-0 mt-0.5" />
              <span>The test will <strong>auto-submit automatically</strong> when the countdown timer hits 00:00.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A38038] shrink-0 mt-0.5" />
              <span>You can navigate back and forth using the question palette and modify answers prior to submission.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons matching Screen 5 */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 hover:text-[#111214] hover:border-[#111214] text-xs font-semibold rounded-lg transition-colors text-center"
          >
            Back
          </button>

          <button
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-3 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] text-xs font-bold rounded-lg transition-all shadow-md text-center"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
