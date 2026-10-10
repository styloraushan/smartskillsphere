import React, { useState } from 'react';
import { 
  Globe, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { CurrentAffairsItem, Question } from '../types';

interface CurrentAffairsViewProps {
  items: CurrentAffairsItem[];
}

export const CurrentAffairsView: React.FC<CurrentAffairsViewProps> = ({ items }) => {
  const [timeTab, setTimeTab] = useState<'Today' | 'This Week' | 'This Month'>('Today');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<CurrentAffairsItem | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const categories = ['All', 'National', 'Science & Tech', 'Economy', 'Global', 'Sports'];

  const filtered = items.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleOpenArticle = (art: CurrentAffairsItem) => {
    setSelectedArticle(art);
    setQuizAnswer(null);
    setShowAnswer(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header matching Screen 12 */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A38038] uppercase">
            <Globe className="w-4 h-4" />
            <span>Daily Intelligence Digest</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[#111214] mt-1">
            Current Affairs & Editorial Capsules
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Curated daily updates with embedded retention MCQs for civil services and corporate exams
          </p>
        </div>

        {/* Time Tabs matching Screen 12 */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
          {(['Today', 'This Week', 'This Month'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-colors ${
                timeTab === tab
                  ? 'bg-[#111214] text-[#C9A45C]'
                  : 'text-slate-600 hover:text-[#111214]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills matching Screen 12 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#C9A45C] text-[#111214] border-[#C9A45C] font-bold shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Articles List matching Screen 12 */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 hover:border-[#C9A45C] rounded-xl p-5 sm:p-6 transition-all hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
          >
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <span className="text-[#A38038] uppercase">{item.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {item.readTimeMinutes} min read
                </span>
                <span>·</span>
                <span>{item.date}</span>
              </div>

              <h3 className="text-base font-bold text-[#111214] group-hover:text-[#A38038] transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <button
              onClick={() => handleOpenArticle(item)}
              className="px-6 py-2.5 bg-[#111214] hover:bg-[#C9A45C] hover:text-[#111214] text-white text-xs font-bold rounded-lg transition-colors shrink-0 self-start sm:self-auto"
            >
              Read
            </button>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111214]/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A38038] uppercase">
                <span>{selectedArticle.category}</span>
                <span>·</span>
                <span>{selectedArticle.date}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-[#111214]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-bold font-display text-[#111214]">
              {selectedArticle.title}
            </h2>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
              <p className="font-semibold text-slate-900 bg-[#F5F7FA] p-3 rounded border border-slate-200">
                {selectedArticle.summary}
              </p>
              <p>{selectedArticle.fullContent}</p>
            </div>

            {/* Embedded Retention MCQ if provided */}
            {selectedArticle.quizQuestion && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111214]">
                  <HelpCircle className="w-4 h-4 text-[#C9A45C]" />
                  <span>Retention Diagnostic MCQ:</span>
                </div>

                <div className="p-4 bg-[#F5F7FA] rounded-xl border border-slate-200 space-y-3 text-xs">
                  <p className="font-semibold text-slate-900">{selectedArticle.quizQuestion.text}</p>

                  <div className="space-y-2">
                    {selectedArticle.quizQuestion.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setQuizAnswer(opt.id);
                          setShowAnswer(true);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${
                          quizAnswer === opt.id
                            ? opt.id === selectedArticle.quizQuestion?.correctOptionId
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                              : 'bg-rose-50 border-rose-400 text-rose-900 font-bold'
                            : 'bg-white border-slate-200 hover:border-slate-400 text-slate-700'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>

                  {showAnswer && (
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 text-[11px] leading-relaxed">
                      <span className="font-bold text-[#A38038]">Explanation: </span>
                      {selectedArticle.quizQuestion.explanation}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-[#111214] text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Close Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
