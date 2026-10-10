import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Bookmark, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  X
} from 'lucide-react';
import { Quiz, Question, QuizAttempt } from '../types';
import { quizService } from '../services/api';
import confetti from 'canvas-confetti';

interface LiveQuizViewProps {
  quiz: Quiz;
  questions: Question[];
  onComplete: (attempt: QuizAttempt) => void;
  onExit: () => void;
}

export const LiveQuizView: React.FC<LiveQuizViewProps> = ({
  quiz,
  questions,
  onComplete,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> selectedOptionId
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [visitedIndices, setVisitedIndices] = useState<number[]>([0]);
  const [secondsRemaining, setSecondsRemaining] = useState(quiz.durationMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Timer countdown
  useEffect(() => {
    if (secondsRemaining <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const handleAutoSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const totalTimeSpent = quiz.durationMinutes * 60 - Math.max(0, secondsRemaining);
    const attempt = quizService.submitAttempt(
      quiz.id,
      answers,
      markedForReview,
      totalTimeSpent
    );
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}
    onComplete(attempt);
  };

  const handleSelectOption = (optionId: string) => {
    const currentQ = questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleClearResponse = () => {
    const currentQ = questions[currentIndex];
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleReview = () => {
    const currentQ = questions[currentIndex];
    setMarkedForReview((prev) =>
      prev.includes(currentQ.id)
        ? prev.filter((id) => id !== currentQ.id)
        : [...prev, currentQ.id]
    );
  };

  const handleNavigateQuestion = (index: number) => {
    setCurrentIndex(index);
    if (!visitedIndices.includes(index)) {
      setVisitedIndices((prev) => [...prev, index]);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      handleNavigateQuestion(currentIndex + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      handleNavigateQuestion(currentIndex - 1);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex] || questions[0];
  const selectedOptionId = currentQ ? answers[currentQ.id] : undefined;
  const isMarked = currentQ ? markedForReview.includes(currentQ.id) : false;

  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.length;
  const notAttemptedCount = questions.length - answeredCount;

  // Status for Question Palette
  const getQuestionPaletteStatus = (index: number) => {
    const q = questions[index];
    if (index === currentIndex) return 'current';
    if (markedForReview.includes(q.id)) return 'marked';
    if (answers[q.id]) return 'answered';
    if (visitedIndices.includes(index)) return 'not_answered';
    return 'not_visited';
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Test Navigation Bar matching Screen 6 */}
      <div className="bg-[#111214] text-white p-4 rounded-xl border border-[#25344A] flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <span className="text-base sm:text-lg font-bold font-display text-white">
            Q {currentIndex + 1}/{questions.length}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            · {quiz.title}
          </span>
        </div>

        {/* Live Timer matching Screen 6 */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-sm font-bold border transition-colors ${
              secondsRemaining < 120
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'
                : 'bg-[#1b1c20] text-[#C9A45C] border-[#C9A45C]/40'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="tabular-nums tracking-wider">{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] text-xs font-bold rounded transition-colors"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Test Layout (Grid split: Question + Palette matching Screen 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Question & Options) matching Screen 6 */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8 shadow-sm flex flex-col justify-between min-h-[500px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
              <span className="font-semibold text-[#A38038] uppercase">
                {currentQ.topic} · {currentQ.difficulty}
              </span>
              <span className="font-mono text-slate-400">
                +{currentQ.marks} Marks / -{currentQ.negativeMarks} Neg
              </span>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-semibold text-[#111214] leading-relaxed">
              {currentQ.text}
            </div>

            {/* Multiple Choice Options List matching Screen 6 */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const letter = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 text-xs sm:text-sm ${
                      isSelected
                        ? 'border-[#C9A45C] bg-[#C9A45C]/10 text-[#111214] font-semibold ring-1 ring-[#C9A45C]'
                        : 'border-slate-200 hover:border-slate-400 text-slate-700 bg-white'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#C9A45C] text-[#111214]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {letter}
                    </div>
                    <span className="leading-snug">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Controls matching Screen 6 */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleReview}
                className={`px-3 py-2 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
                  isMarked
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-slate-300 text-slate-600 hover:border-slate-500'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" fill={isMarked ? '#7e22ce' : 'none'} />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>

              {selectedOptionId && (
                <button
                  onClick={handleClearResponse}
                  className="px-3 py-2 text-xs font-semibold rounded border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrevious}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:text-[#111214] hover:border-[#111214] disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <span>{currentIndex === questions.length - 1 ? 'Review & Submit' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette matching Screen 6 */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#111214] uppercase tracking-wider font-display">
              Question Palette
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Click any number to jump directly</p>
          </div>

          {/* Palette Number Grid (1 to 15) */}
          <div className="grid grid-cols-5 gap-2.5">
            {questions.map((q, idx) => {
              const status = getQuestionPaletteStatus(idx);

              let style = 'bg-slate-100 text-slate-700 hover:bg-slate-200'; // not attempted
              if (status === 'current') {
                style = 'bg-blue-600 text-white font-bold ring-2 ring-blue-300';
              } else if (status === 'marked') {
                style = 'bg-purple-600 text-white font-bold';
              } else if (status === 'answered') {
                style = 'bg-emerald-600 text-white font-bold';
              } else if (status === 'not_answered') {
                style = 'bg-rose-100 text-rose-700 font-semibold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => handleNavigateQuestion(idx)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono transition-all ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend matching Screen 6 */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block" />
              <span className="text-slate-600">Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-purple-600 inline-block" />
              <span className="text-slate-600">Marked for Review ({markedCount})</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-200 inline-block" />
              <span className="text-slate-600">Not Attempted ({notAttemptedCount})</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block" />
              <span className="text-slate-600">Current Question</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111214]/80 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-6 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#111214]">Submit Assessment?</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>Are you sure you want to finish and submit your answers?</p>
              <div className="p-4 bg-[#F5F7FA] rounded-lg border border-slate-200 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <strong>{questions.length}</strong>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Answered:</span>
                  <strong>{answeredCount}</strong>
                </div>
                <div className="flex justify-between text-purple-700">
                  <span>Marked for Review:</span>
                  <strong>{markedCount}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Unattempted:</span>
                  <strong>{notAttemptedCount}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:border-slate-500"
              >
                Continue Test
              </button>
              <button
                onClick={handleAutoSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] text-xs font-bold rounded-lg transition-colors"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
