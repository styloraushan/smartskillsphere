import React, { useState } from 'react';
import { 
  AlertCircle, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  Edit3, 
  Check, 
  X,
  Play
} from 'lucide-react';
import { MistakeBookItem, Question } from '../types';
import { mistakeService } from '../services/api';

interface MistakeBookViewProps {
  mistakes: MistakeBookItem[];
  onStartRetest: (questions: Question[]) => void;
  onRefresh: () => void;
}

export const MistakeBookView: React.FC<MistakeBookViewProps> = ({
  mistakes,
  onStartRetest,
  onRefresh,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const unmastered = mistakes.filter((m) => !m.mastered);

  const handleToggleMastered = (id: string) => {
    mistakeService.toggleMastered(id);
    onRefresh();
  };

  const handleRemove = (id: string) => {
    mistakeService.remove(id);
    onRefresh();
  };

  const handleStartEdit = (m: MistakeBookItem) => {
    setEditingId(m.id);
    setNoteText(m.userNotes);
  };

  const handleSaveNotes = (id: string) => {
    mistakeService.updateNotes(id, noteText);
    setEditingId(null);
    onRefresh();
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase">
            <AlertCircle className="w-4 h-4" />
            <span>Spaced Repetition & Growth Vault</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[#111214] mt-1">
            Student Mistake Book
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Questions flagged from live quiz evaluations. Review root causes and re-test until mastered.
          </p>
        </div>

        {unmastered.length > 0 && (
          <button
            onClick={() => onStartRetest(unmastered.map((m) => m.question))}
            className="px-5 py-2.5 bg-[#111214] hover:bg-[#C9A45C] hover:text-[#111214] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-[#C9A45C]" />
            <span>Retest Unmastered ({unmastered.length})</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {mistakes.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-2xl p-6 transition-all shadow-sm space-y-4 ${
              item.mastered ? 'border-emerald-200 bg-emerald-50/20 opacity-75' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A38038]">
                  {item.question.subject} · {item.question.topic}
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-[#111214]">
                  {item.question.text}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleMastered(item.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 ${
                    item.mastered
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.mastered ? 'Mastered' : 'Mark Mastered'}</span>
                </button>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove from Mistake Book"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-[#F5F7FA] rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-[#A38038] uppercase text-[10px]">Methodology:</span>
              <p>{item.question.explanation}</p>
            </div>

            {/* User Note Box */}
            <div className="pt-2 border-t border-slate-100 flex items-start justify-between gap-3 text-xs">
              {editingId === item.id ? (
                <div className="flex-1 space-y-2">
                  <textarea
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Record your formula reminder or memory trick..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#C9A45C]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveNotes(item.id)}
                      className="px-3 py-1 bg-[#111214] text-white text-[11px] font-bold rounded flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Save Note
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 border border-slate-300 text-slate-600 text-[11px] rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <p className="text-slate-600 italic">
                    <strong className="not-italic text-slate-800 font-semibold mr-1">Your Note:</strong>
                    {item.userNotes || 'No notes added yet.'}
                  </p>
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="text-[#A38038] hover:text-[#111214] flex items-center gap-1 text-[11px] font-semibold shrink-0 ml-4"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Note</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {mistakes.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#111214]">Your Mistake Book is pristine!</h3>
            <p className="text-slate-400 mt-1">Questions you miss in live quizzes will automatically be queued here for mastery.</p>
          </div>
        )}
      </div>
    </div>
  );
};
