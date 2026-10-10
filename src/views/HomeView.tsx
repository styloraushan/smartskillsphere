import React, { useState } from 'react';
import { 
  Calculator, 
  Compass, 
  BookOpen, 
  Code2, 
  Globe, 
  ArrowRight, 
  Search, 
  Users, 
  Star, 
  FileText, 
  Trophy, 
  Flame, 
  Clock, 
  Download, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  BarChart2,
  Zap,
  Play,
  Award,
  Check,
  GraduationCap
} from 'lucide-react';
import { Resource, Quiz, Poll, Question } from '../types';
import libraryImg from '../assets/images/notes_editorial_library_1791661007940.jpg';
import sphereImg from '../assets/images/hero_learning_sphere_1791660995134.jpg';
import arenaImg from '../assets/images/quiz_arena_championship_1791661020091.jpg';
import mentorImg from '../assets/images/avatar_scholar_mentor_1791661030432.jpg';
import studentHeroImg from '../assets/images/student_hero_study.jpg';

import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';

interface HomeViewProps {
  onNavigate: (tab: string, param?: string) => void;
  onOpenResource: (resource: Resource) => void;
  onStartQuiz: (quizId: string) => void;
  onStartCustomDrill: (questions: Question[], title: string) => void;
  featuredResources: Resource[];
  activeQuizzes: Quiz[];
  activePolls: Poll[];
  sampleQuestions: Question[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenResource,
  onStartQuiz,
  onStartCustomDrill,
  featuredResources,
  activeQuizzes,
  activePolls,
  sampleQuestions,
}) => {
  const [interactiveSelectedOpt, setInteractiveSelectedOpt] = useState<string | null>(null);
  const [interactiveRevealed, setInteractiveRevealed] = useState(false);

  // Sample interactive question for immediate engagement
  const demoQuestion = sampleQuestions[0] || {
    id: 'demo_quant_1',
    subject: 'Quantitative Aptitude',
    topic: 'Time and Work',
    difficulty: 'Medium',
    text: 'A can complete a piece of work in 12 days and B in 18 days. If they work together on alternate days beginning with A, in how many days will the work be completed?',
    options: [
      { id: 'opt_1', text: '14 1/3 days (14.33 days)' },
      { id: 'opt_2', text: '14 1/2 days (14.5 days)' },
      { id: 'opt_3', text: '15 days' },
      { id: 'opt_4', text: '13.66 days' },
    ],
    correctOptionId: 'opt_1',
    explanation: 'Total work = LCM(12, 18) = 36 units. In 7 two-day cycles (14 days), 35 units are completed. Remaining 1 unit is finished by A on day 15 in 1/3 day. Total = 14 1/3 days.',
    marks: 2,
    negativeMarks: 0.5,
  };

  return (
    <div className="w-full pb-20">
      {/* =========================================================================
          1. HERO SECTION (Modular Component matching exact prompt specifications)
          ========================================================================= */}
      <HeroSection
        resources={featuredResources}
        quizzes={activeQuizzes}
        onNavigate={onNavigate}
        onOpenResource={onOpenResource}
        onStartQuiz={onStartQuiz}
      />

      {/* =========================================================================
          2. EXPLORE BY CATEGORY (Modular Component with 6 cards & More modal)
          ========================================================================= */}
      <CategorySection onNavigate={onNavigate} />

      {/* Wrapper for the rest of the rich learning features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mt-16">

      {/* =========================================================================
          3. PEDAGOGICAL EDGE: THE SMARTSKILLSPHERE ARCHITECTURE (Bento Grid)
          ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A38038]">
            Architectural Distinction
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#111214]">
            Why SmartSkillSphere Outperforms Generic Platforms
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Engineered from first principles with deliberate exam conditioning, negative marking safeguards, and cognitive spaced repetition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1: Exam Engine */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A38038] uppercase">
                <Clock className="w-4 h-4" />
                <span>Feature 01 · Assessment Engine</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#111214]">
                Strict Timed Quizzes with Real Negative Penalties
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Generic practice engines let students guess risk-free. SmartSkillSphere enforces real standardized marking formulas (+2 marks for correct, -0.5 marks for wrong), training your risk-to-reward judgment under true pressure.
              </p>
            </div>

            <div className="p-4 bg-[#F5F7FA] rounded-xl border border-slate-200 grid grid-cols-3 gap-3 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Live Timer</span>
                <span className="font-bold text-[#111214] font-mono">Auto-Submit</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Question Palette</span>
                <span className="font-bold text-[#111214] font-mono">4 Visual States</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Console Security</span>
                <span className="font-bold text-[#111214] font-mono">Zero Answer Leaks</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Mistake Book */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#111214] to-[#1c1d22] text-white border border-[#25344A] rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C9A45C] uppercase">
                <RotateCcw className="w-4 h-4" />
                <span>Feature 02 · Spaced Repetition</span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Automated Mistake Book & Retest Mode
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every question you slip on in live tests is automatically cataloged in your private Mistake Book. Re-drill only what you missed until your accuracy hits 100%.
              </p>
            </div>

            <button
              onClick={() => onNavigate('mistakes')}
              className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] font-bold text-xs rounded-xl transition-colors self-start flex items-center gap-2"
            >
              <span>Explore Mistake Book</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bento Card 3: Peer-Reviewed Vault */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A38038] uppercase">
                <FileText className="w-4 h-4" />
                <span>Feature 03 · Academic Vault</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#111214]">
                Verified Study Manuscripts & Version Histories
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Download and read peer-reviewed PDF study notes curated by faculty directorates, with full revision tracking and community helpfulness ratings.
              </p>
            </div>

            <button
              onClick={() => onNavigate('resources')}
              className="px-5 py-2.5 border border-[#111214] text-[#111214] hover:bg-[#111214] hover:text-white font-bold text-xs rounded-xl transition-colors self-start"
            >
              Browse 1,000+ Notes
            </button>
          </div>

          {/* Bento Card 4: Daily Habits & Community Perspectives */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A38038] uppercase">
                <BarChart2 className="w-4 h-4" />
                <span>Feature 04 · Community Intelligence</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#111214]">
                Student Polls, Daily Sprints & Cohort Benchmarks
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Compare preparation bottlenecks with thousands of fellow aspirants through verified community polls, and climb the weekly leaderboard with daily consistency streaks.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => onNavigate('polls')}
                className="px-5 py-2.5 bg-[#111214] hover:bg-[#C9A45C] hover:text-[#111214] text-white font-bold rounded-xl transition-colors"
              >
                Participate in Polls
              </button>
              <button
                onClick={() => onNavigate('leaderboard')}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:border-[#111214] font-bold rounded-xl transition-colors"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. INTERACTIVE LIVE PROBLEM DRILL (Try Before You Enroll)
          ========================================================================= */}
      <section className="bg-[#111214] text-white rounded-3xl p-8 sm:p-12 border border-[#25344A] shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#25344A] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#C9A45C] uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-[#C9A45C]" />
              <span>Interactive Assessment Sandbox</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white mt-1">
              Experience the Timed Quiz Engine Live
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select an answer below to test our instant verification and step-by-step mathematical reasoning reveal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Subject: {demoQuestion.subject}</span>
            <span>·</span>
            <span>Difficulty: {demoQuestion.difficulty}</span>
          </div>
        </div>

        <div className="space-y-6 max-w-3xl">
          <div className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {demoQuestion.text}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {demoQuestion.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = interactiveSelectedOpt === opt.id;
              const isCorrect = opt.id === demoQuestion.correctOptionId;

              let style = 'bg-[#1b1c20] border-slate-700 text-slate-200 hover:border-[#C9A45C]';
              if (interactiveRevealed) {
                if (isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500';
                else if (isSelected && !isCorrect) style = 'bg-rose-950/60 border-rose-500 text-rose-300';
              } else if (isSelected) {
                style = 'bg-[#C9A45C]/20 border-[#C9A45C] text-[#C9A45C] ring-1 ring-[#C9A45C]';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setInteractiveSelectedOpt(opt.id);
                    setInteractiveRevealed(true);
                  }}
                  className={`p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 ${style}`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {letter}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {interactiveRevealed && (
            <div className="p-5 bg-[#1b1c20] border border-[#C9A45C]/40 rounded-xl space-y-2 text-xs text-slate-300 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-[#C9A45C] uppercase text-[11px]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Solution & Invariant Logic:</span>
              </div>
              <p className="leading-relaxed">{demoQuestion.explanation}</p>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Looking for full mock test simulations with 50+ questions and time-decay alerts?
            </span>
            <button
              onClick={() => onNavigate('quizzes')}
              className="px-6 py-2.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Enter Quiz Arena (500+ Quizzes)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FEATURED NOTES & MANUSCRIPTS VAULT (Matching Screen 2)
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A38038]">
              Academic Repository
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#111214] mt-1">
              Curated Notes & Study Manuscripts
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Formula matrices, worked derivations, and placement interview reference guides
            </p>
          </div>

          <button
            onClick={() => onNavigate('resources')}
            className="text-xs font-bold text-[#A38038] hover:text-[#111214] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View Full Vault Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredResources.map((res) => (
            <div
              key={res.id}
              onClick={() => onOpenResource(res)}
              className="bg-white border border-slate-200 hover:border-[#C9A45C] rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-bold text-[#A38038] uppercase font-sans">{res.subject}</span>
                  <span>{res.fileType.toUpperCase()} · {res.fileSize}</span>
                </div>

                <h3 className="text-sm font-bold text-[#111214] group-hover:text-[#A38038] transition-colors line-clamp-2 leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px] tabular-nums">
                  {res.downloadCount.toLocaleString()} downloads
                </span>
                <span className="text-xs font-bold text-[#A38038] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Preview <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. HALL OF SCHOLARS & VERIFIED STUDENT OUTCOMES
          ========================================================================= */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A38038]">
              Empirical Results
            </span>
            <h2 className="text-2xl font-bold font-display text-[#111214] mt-1">
              Verified Aspirant Achievements
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Concrete placement selections and percentiles from students practicing daily on SmartSkillSphere
            </p>
          </div>

          <button
            onClick={() => onNavigate('leaderboard')}
            className="px-5 py-2 bg-[#111214] text-white hover:bg-[#C9A45C] hover:text-[#111214] text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
          >
            View National Leaderboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#F5F7FA] border border-slate-200 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                “The negative marking penalty in the Quiz Arena cured my habit of wild guessing. My aptitude test score jumped from 62% to 91% during on-campus recruitment.”
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60">
              <div className="text-xs font-bold text-[#111214]">Kavya Venkat</div>
              <div className="text-[11px] text-slate-500">Software Engineer (Placed at Tier-1 MNC)</div>
            </div>
          </div>

          <div className="p-6 bg-[#F5F7FA] border border-slate-200 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                “The Mistake Book is genius. It automatically saved every concurrency and AVL tree question I botched, so I could review just my weak spots 48 hours before GATE CS.”
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60">
              <div className="text-xs font-bold text-[#111214]">Aditya Deshmukh</div>
              <div className="text-[11px] text-slate-500">GATE CS Aspirant (AIR 148 Benchmark)</div>
            </div>
          </div>

          <div className="p-6 bg-[#F5F7FA] border border-slate-200 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                “SmartSkillSphere feels like an intellectual salon rather than a spammy LMS. The black & gold UI is distraction-free, and the notes are actually written by scholars.”
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60">
              <div className="text-xs font-bold text-[#111214]">Ananya Sharma</div>
              <div className="text-[11px] text-slate-500">CAT 2026 Aspirant (99.2% Quant Mock)</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CONVERSION BANNER (Primary Call to Action)
          ========================================================================= */}
      <section className="bg-gradient-to-r from-[#111214] via-[#1a1b20] to-[#111214] text-white rounded-3xl p-8 sm:p-14 border border-[#C9A45C]/40 shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-4 z-10 relative">
          <span className="inline-block px-3 py-1 rounded bg-[#C9A45C]/20 border border-[#C9A45C]/40 text-[#C9A45C] text-xs font-bold uppercase tracking-wider">
            Zero Barriers · Instant Practice
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-tight text-white">
            Ready to Practice Daily & Grow Beyond Limits?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Join 50,000+ ambitious students sharpening their quantitative aptitude, algorithmic intuition, and linguistic deduction today.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <span>Launch Learning Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('quizzes')}
              className="px-8 py-3.5 bg-[#1b1c20] hover:bg-[#25344A] text-white border border-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all"
            >
              Take a Free Mock Test
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-[#C9A45C]/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#C9A45C]/10 blur-3xl pointer-events-none" />
      </section>
      </div>
    </div>
  );
};
