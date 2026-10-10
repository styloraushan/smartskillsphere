import React, { useState } from 'react';
import { 
  Compass, 
  Play, 
  CheckCircle, 
  HelpCircle, 
  Clock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Question } from '../types';
import { questionService } from '../services/api';

interface LogicalReasoningViewProps {
  onStartCustomDrill: (questions: Question[], title: string) => void;
}

export const LogicalReasoningView: React.FC<LogicalReasoningViewProps> = ({
  onStartCustomDrill,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Series',
    'Coding-Decoding',
    'Blood Relations',
    'Syllogism',
    'Analogy',
    'Classification',
    'Seating Arrangement',
  ];

  const practiceSets = [
    { id: 'lr_set_1', topic: 'Series Completion & Number Sequences', questionsCount: 10, time: 10, difficulty: 'Medium', category: 'Series' },
    { id: 'lr_set_2', topic: 'Coding-Decoding & Substitution Logic', questionsCount: 15, time: 15, difficulty: 'Easy', category: 'Coding-Decoding' },
    { id: 'lr_set_3', topic: 'Blood Relations & Generational Trees', questionsCount: 15, time: 15, difficulty: 'Medium', category: 'Blood Relations' },
    { id: 'lr_set_4', topic: 'Syllogisms & Categorical Propositions', questionsCount: 10, time: 12, difficulty: 'Hard', category: 'Syllogism' },
    { id: 'lr_set_5', topic: 'Verbal Analogy & Deductive Inferences', questionsCount: 12, time: 10, difficulty: 'Easy', category: 'Analogy' },
    { id: 'lr_set_6', topic: 'Linear & Circular Seating Arrangements', questionsCount: 8, time: 15, difficulty: 'Hard', category: 'Seating Arrangement' },
  ];

  const filteredSets = selectedCategory === 'All'
    ? practiceSets
    : practiceSets.filter((s) => s.category === selectedCategory);

  const handleLaunchSet = (set: typeof practiceSets[0]) => {
    const allLr = questionService.getBySubject('Logical Reasoning');
    const pool = allLr.length > 0 ? allLr : questionService.getAll();
    const subset = pool.slice(0, Math.min(set.questionsCount, pool.length));
    onStartCustomDrill(subset, `Logical Reasoning: ${set.topic}`);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A38038] uppercase">
            <Compass className="w-4 h-4" />
            <span>Analytical Framework</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[#111214] mt-1">
            Logical & Analytical Reasoning
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deductive sequences, relational trees, formal logic patterns and spatial arrangements
          </p>
        </div>
      </div>

      {/* Split Layout matching Screen 11 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Categories List matching Screen 11 */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 mb-3">
            Reasoning Categories
          </h3>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                selectedCategory === cat
                  ? 'bg-[#111214] text-[#C9A45C]'
                  : 'text-slate-600 hover:bg-[#F5F7FA] hover:text-[#111214]'
              }`}
            >
              <span>{cat}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          ))}
        </div>

        {/* Right Practice Sets List matching Screen 11 */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Available Practice Modules ({filteredSets.length})</span>
            <span>Standardized Timing</span>
          </div>

          <div className="space-y-3">
            {filteredSets.map((set) => (
              <div
                key={set.id}
                className="bg-white border border-slate-200 hover:border-[#C9A45C] rounded-xl p-5 transition-all hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    <span className="text-[#A38038]">{set.category}</span>
                    <span>·</span>
                    <span className="capitalize">{set.difficulty}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#111214] group-hover:text-[#A38038] transition-colors truncate">
                    {set.topic}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                    <span>{set.questionsCount} Questions</span>
                    <span>·</span>
                    <span>{set.time} Minutes</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchSet(set)}
                  className="px-6 py-2.5 bg-[#111214] hover:bg-[#C9A45C] hover:text-[#111214] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
