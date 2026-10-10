import React, { useState } from 'react';
import { BookOpen, Play, CheckCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { Question } from '../types';
import { questionService } from '../services/api';

interface VerbalPracticeViewProps {
  onStartCustomDrill: (questions: Question[], title: string) => void;
}

export const VerbalPracticeView: React.FC<VerbalPracticeViewProps> = ({
  onStartCustomDrill,
}) => {
  const modules = [
    { title: 'Grammar & Subject-Verb Agreement', qCount: 15, difficulty: 'Medium', desc: 'Prepositional idioms, tense consistency, and correlative conjunctions.' },
    { title: 'High-Frequency Vocabulary & Antonyms', qCount: 20, difficulty: 'Hard', desc: 'Advanced GRE & CAT words with nuanced context definitions.' },
    { title: 'Reading Comprehension & Critical Inferences', qCount: 10, difficulty: 'Hard', desc: 'Scientific passages with author tone identification.' },
    { title: 'Para Jumbles & Coherence Analysis', qCount: 10, difficulty: 'Medium', desc: 'Sentence sequencing with transitional link identification.' },
  ];

  const handleLaunch = (mod: typeof modules[0]) => {
    const allVa = questionService.getBySubject('Verbal Ability');
    const pool = allVa.length > 0 ? allVa : questionService.getAll();
    onStartCustomDrill(pool, `Verbal Ability: ${mod.title}`);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A38038] uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Linguistic & Critical Reading</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[#111214] mt-1">
            Verbal Ability & Linguistic Mastery
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vocabulary matrices, sentence correction, reading comprehension, and deductive verbal analogies
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((m, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 hover:border-[#C9A45C] rounded-xl p-6 transition-all hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
          >
            <div className="space-y-2 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A38038]">
                {m.difficulty} Level
              </span>
              <h3 className="text-base font-bold text-[#111214] group-hover:text-[#A38038] transition-colors">
                {m.title}
              </h3>
              <p className="text-xs text-slate-500">{m.desc}</p>
              <div className="text-[11px] font-mono text-slate-400">
                {m.qCount} Questions · 15 mins
              </div>
            </div>

            <button
              onClick={() => handleLaunch(m)}
              className="px-6 py-2.5 bg-[#111214] hover:bg-[#C9A45C] hover:text-[#111214] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
