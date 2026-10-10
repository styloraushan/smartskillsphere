import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Trophy, Sparkles, X, ChevronRight, AlertCircle } from 'lucide-react';
import { Resource, Quiz } from '../types';

interface SearchBarProps {
  resources?: Resource[];
  quizzes?: Quiz[];
  onNavigate: (tab: string, param?: string) => void;
  onOpenResource?: (resource: Resource) => void;
  onStartQuiz?: (quizId: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  resources = [],
  quizzes = [],
  onNavigate,
  onOpenResource,
  onStartQuiz,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  // Filter matching resources and quizzes
  const matchingResources = cleanQuery
    ? resources
        .filter(
          (r) =>
            r.title.toLowerCase().includes(cleanQuery) ||
            r.subject.toLowerCase().includes(cleanQuery) ||
            r.topic.toLowerCase().includes(cleanQuery) ||
            r.tags.some((t) => t.toLowerCase().includes(cleanQuery))
        )
        .slice(0, 4)
    : [];

  const matchingQuizzes = cleanQuery
    ? quizzes
        .filter(
          (q) =>
            q.title.toLowerCase().includes(cleanQuery) ||
            q.category.toLowerCase().includes(cleanQuery) ||
            q.topic.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  const hasResults = matchingResources.length > 0 || matchingQuizzes.length > 0;
  const showDropdown = isOpen && cleanQuery.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanQuery) return;
    setIsOpen(false);
    onNavigate('resources', cleanQuery);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-xl ${className}`}>
      {/* Pill Search Field */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center bg-white rounded-full p-1.5 pl-5 sm:pl-6 shadow-2xl transition-all border border-transparent focus-within:border-[#D5A94F] focus-within:ring-2 focus-within:ring-[#D5A94F]/30"
      >
        <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for notes, quizzes, topics..."
          className="w-full bg-transparent text-sm sm:text-base text-[#182538] placeholder-slate-400 focus:outline-none pr-2"
          aria-label="Search for notes, quizzes, and topics"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full mr-2 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="px-6 sm:px-8 py-2.5 bg-gradient-to-r from-[#D5A94F] to-[#B88728] hover:from-[#F5D982] hover:to-[#D5A94F] text-[#101820] font-bold text-xs sm:text-sm rounded-full transition-all shadow-md shrink-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A94F]"
        >
          Search
        </button>
      </form>

      {/* Live Dropdown / Search Results Preview with Useful Empty State */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
          {hasResults ? (
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {/* Resources / Notes matches */}
              {matchingResources.length > 0 && (
                <div className="p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#D5A94F] px-3 py-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Curated Notes & Manuscripts</span>
                  </div>
                  {matchingResources.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => {
                        setIsOpen(false);
                        if (onOpenResource) onOpenResource(res);
                        else onNavigate('resources', res.title);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-semibold text-[#182538] group-hover:text-[#D5A94F] transition-colors truncate">
                          {res.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {res.subject} · {res.topic}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quizzes matches */}
              {matchingQuizzes.length > 0 && (
                <div className="p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 px-3 py-1 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Practice Tests & Quizzes</span>
                  </div>
                  {matchingQuizzes.map((quiz) => (
                    <button
                      key={quiz.id}
                      onClick={() => {
                        setIsOpen(false);
                        if (onStartQuiz) onStartQuiz(quiz.id);
                        else onNavigate('quizzes');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-semibold text-[#182538] group-hover:text-[#D5A94F] transition-colors truncate">
                          {quiz.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {quiz.category} · {quiz.totalQuestions} Questions · {quiz.durationMinutes}m
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* View all search matches CTA */}
              <div className="p-2.5 bg-[#F5F8FC] border-t border-slate-100 flex items-center justify-between px-4">
                <span className="text-xs text-slate-500">
                  Showing top {matchingResources.length + matchingQuizzes.length} matches
                </span>
                <button
                  onClick={handleSubmit}
                  className="text-xs font-bold text-[#D5A94F] hover:underline flex items-center gap-1"
                >
                  <span>View full results in Notes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Useful Empty State */
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#182538]">
                  No resources or quizzes found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching for popular topics like <span className="font-semibold text-slate-700">Quantitative Aptitude</span>, <span className="font-semibold text-slate-700">Data Structures</span>, or <span className="font-semibold text-slate-700">Logical Reasoning</span>.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                {['Aptitude', 'Data Structures', 'Time & Work', 'Syllogisms'].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      onNavigate('resources', suggestion);
                      setIsOpen(false);
                    }}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-[#D5A94F]/20 hover:text-[#B88728] transition-colors font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
