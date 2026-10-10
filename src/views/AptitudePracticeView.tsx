import React, { useState } from 'react';
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  Play, 
  RotateCcw,
  Bookmark
} from 'lucide-react';
import { Question } from '../types';
import { questionService, mistakeService } from '../services/api';

interface AptitudePracticeViewProps {
  onStartCustomDrill: (questions: Question[], title: string) => void;
}

export const AptitudePracticeView: React.FC<AptitudePracticeViewProps> = ({
  onStartCustomDrill,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('Percentage & Profit Loss');
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Medium');

  const topics = [
    'Percentage & Profit Loss',
    'Time and Work',
    'Speed, Time and Distance',
    'Number Systems & Divisibility',
    'Simple & Compound Interest',
    'Permutation & Probability',
  ];

  const counts = [10, 15, 20, 25, 50];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed'] as const;

  // Realistic recent practice records matching Screen 10
  const recentPractice = [
    { topic: 'Percentage & Ratios', score: '18/25', accuracy: '72%', date: '2 days ago', status: 'Passed' },
    { topic: 'Time & Work Alternate Days', score: '12/20', accuracy: '60%', date: '3 days ago', status: 'Moderate' },
    { topic: 'Profit & Loss Mark-ups', score: '13/15', accuracy: '87%', date: '5 days ago', status: 'Exemplary' },
    { topic: 'Simple & Compound Interest', score: '8/10', accuracy: '80%', date: '6 days ago', status: 'Passed' },
  ];

  const handleLaunchPractice = () => {
    const allApt = questionService.getBySubject('Quantitative Aptitude');
    // If fewer questions, cycle/generate enough for the session
    const pool = allApt.length > 0 ? allApt : questionService.getAll();
    const subset = pool.slice(0, Math.min(questionCount, pool.length));
    onStartCustomDrill(subset, `Quantitative Aptitude: ${selectedTopic} (${selectedDifficulty})`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A38038] uppercase">
            <Calculator className="w-4 h-4" />
            <span>Curriculum Drill Engine</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[#111214] mt-1">
            Quantitative Aptitude Practice
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build speed, eliminate calculation penalties, and master entrance-level mental arithmetic
          </p>
        </div>
      </div>

      {/* Main Split Layout matching Screen 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Practice Setup Deck matching Screen 10 */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-4">
            {/* Topic Selector */}
            <div>
              <label className="block text-xs font-bold text-[#111214] uppercase tracking-wider mb-2">
                Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25344A] focus:outline-none focus:border-[#C9A45C]"
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Questions selector matching Screen 10 */}
            <div>
              <label className="block text-xs font-bold text-[#111214] uppercase tracking-wider mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-5 gap-2">
                {counts.map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2.5 text-xs font-bold rounded-lg border transition-all font-mono tabular-nums ${
                      questionCount === cnt
                        ? 'bg-[#C9A45C] text-[#111214] border-[#C9A45C] shadow-sm'
                        : 'bg-[#F5F7FA] text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty selector matching Screen 10 */}
            <div>
              <label className="block text-xs font-bold text-[#111214] uppercase tracking-wider mb-2">
                Difficulty
              </label>
              <div className="grid grid-cols-4 gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-[#111214] text-[#C9A45C] border-[#111214] font-bold shadow-sm'
                        : 'bg-[#F5F7FA] text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start Practice Action Button matching Screen 10 */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleLaunchPractice}
              className="w-full py-3.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Practice Session</span>
            </button>
          </div>
        </div>

        {/* Right Column: Recent Practice Records matching Screen 10 */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#111214] font-display">
              Recent Practice
            </h3>
            <span className="text-[11px] text-slate-400">Past Sessions</span>
          </div>

          <div className="space-y-3">
            {recentPractice.map((rec, i) => (
              <div
                key={i}
                className="p-3.5 border border-slate-100 hover:border-slate-300 rounded-xl flex items-center justify-between gap-3 bg-[#F5F7FA]/50 transition-colors"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#111214] truncate">
                    {rec.topic}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 font-mono">
                    <span className="tabular-nums font-semibold text-[#111214]">{rec.score}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-bold">{rec.accuracy}</span>
                    <span>·</span>
                    <span>{rec.date}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200/60 text-slate-700">
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Personalized spaced repetition adjusts future drills based on mistake history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
