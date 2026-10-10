import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Database, 
  Cpu, 
  Network, 
  Play, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Question } from '../types';
import { questionService } from '../services/api';

interface TechnicalPracticeViewProps {
  onStartCustomDrill: (questions: Question[], title: string) => void;
}

export const TechnicalPracticeView: React.FC<TechnicalPracticeViewProps> = ({
  onStartCustomDrill,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('All');

  const topics = [
    'All',
    'Data Structures & Algorithms',
    'Operating Systems',
    'Database Management Systems',
    'Computer Networks',
    'Computer Fundamentals',
  ];

  const modules = [
    { title: 'AVL Trees & Balancing Complexities', subject: 'Data Structures & Algorithms', qCount: 10, difficulty: 'Medium', icon: Terminal },
    { title: 'Process Scheduling, Mutex & Semaphores', subject: 'Operating Systems', qCount: 12, difficulty: 'Hard', icon: Cpu },
    { title: 'Relational Algebra & Normalization (1NF-BCNF)', subject: 'Database Management Systems', qCount: 15, difficulty: 'Hard', icon: Database },
    { title: 'TCP/IP Protocol Stack & Subnetting', subject: 'Computer Networks', qCount: 10, difficulty: 'Medium', icon: Network },
    { title: 'Boolean Algebra, Logic Gates & Architecture', subject: 'Computer Fundamentals', qCount: 10, difficulty: 'Easy', icon: Code2 },
  ];

  const filtered = selectedTopic === 'All'
    ? modules
    : modules.filter((m) => m.subject === selectedTopic);

  const handleLaunch = (mod: typeof modules[0]) => {
    const allTech = questionService.getBySubject('Technical Practice');
    const pool = allTech.length > 0 ? allTech : questionService.getAll();
    onStartCustomDrill(pool, `Technical Practice: ${mod.title}`);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A38038] uppercase">
            <Code2 className="w-4 h-4" />
            <span>Engineering Discipline</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[#111214] mt-1">
            Technical Practice & Computer Fundamentals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Core computer science MCQs aligned with GATE CS, SDE technical rounds, and engineering semester finals
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={`px-3.5 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
              selectedTopic === t
                ? 'bg-[#111214] text-[#C9A45C] border-[#111214] font-bold shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 hover:border-[#C9A45C] rounded-2xl p-6 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#111214] text-[#C9A45C] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 font-mono">
                    {mod.qCount} Questions · {mod.difficulty}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A38038]">
                    {mod.subject}
                  </span>
                  <h3 className="text-base font-bold text-[#111214] group-hover:text-[#A38038] transition-colors mt-0.5">
                    {mod.title}
                  </h3>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Standard 15 min drill</span>
                <button
                  onClick={() => handleLaunch(mod)}
                  className="px-5 py-2 bg-[#111214] hover:bg-[#C9A45C] hover:text-[#111214] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Module</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
