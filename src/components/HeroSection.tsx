import React from 'react';
import { SearchBar } from './SearchBar';
import { StatisticsRow, StatItem } from './StatisticsRow';
import { Resource, Quiz } from '../types';
import studentHeroImg from '../assets/images/student_hero_study.jpg';

interface HeroSectionProps {
  resources?: Resource[];
  quizzes?: Quiz[];
  stats?: StatItem[];
  onNavigate: (tab: string, param?: string) => void;
  onOpenResource?: (resource: Resource) => void;
  onStartQuiz?: (quizId: string) => void;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  resources = [],
  quizzes = [],
  stats,
  onNavigate,
  onOpenResource,
  onStartQuiz,
  className = '',
}) => {
  return (
    <section
      className={`bg-gradient-to-b from-[#101820] via-[#121c27] to-[#142536] text-white relative overflow-hidden pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-[#25344A]/40 ${className}`}
      aria-label="SmartSkillSphere Hero"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 min-h-[460px]">
          {/* Left Column: Headline, Tagline, Search Bar, Statistics */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-7 z-10">
            {/* Headline and Tagline */}
            <div className="space-y-3.5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-[1.12]">
                Your Skills <br />
                <span className="text-[#D5A94F] drop-shadow-[0_2px_12px_rgba(213,169,79,0.35)]">
                  Our Mission
                </span>
              </h1>

              <p className="text-[#AAB4C2] text-sm sm:text-base max-w-lg font-normal leading-relaxed">
                Learn Smart. Practice Daily. Grow Beyond Limits.
              </p>
            </div>

            {/* Pill Search Bar Component */}
            <SearchBar
              resources={resources}
              quizzes={quizzes}
              onNavigate={onNavigate}
              onOpenResource={onOpenResource}
              onStartQuiz={onStartQuiz}
            />

            {/* Statistics Row Component */}
            <StatisticsRow stats={stats} />
          </div>

          {/* Right Column: High-quality Student Photograph with ambient gold lighting */}
          <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center">
            {/* Warm gold ambient glow behind the student illustration */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#D5A94F]/25 to-[#F5D982]/15 rounded-3xl blur-2xl pointer-events-none transform -rotate-1" />

            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 group">
              <img
                src={studentHeroImg}
                alt="Young adult student studying on laptop with headphones and stacked books under warm golden lamp"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />

              {/* Cinematic academic vignette & gradient edges to blend into dark canvas */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#101820] via-transparent to-transparent pointer-events-none opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#142536] via-transparent to-transparent pointer-events-none opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#101820]/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Organic Curved Wave Divider into Light #F5F8FC Background */}
      <div className="w-full overflow-hidden leading-none absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 block"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C360,60 720,5 1080,45 C1260,65 1380,35 1440,25 L1440,60 L0,60 Z"
            fill="#F5F8FC"
          />
        </svg>
      </div>
    </section>
  );
};

