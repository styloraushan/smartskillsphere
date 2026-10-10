import React from 'react';
import { Bookmark, FileText, ChevronRight, Trash2 } from 'lucide-react';
import { BookmarkItem, Resource } from '../types';
import { bookmarkService } from '../services/api';

interface BookmarksViewProps {
  bookmarks: BookmarkItem[];
  resources: Resource[];
  onOpenResource: (resource: Resource) => void;
  onRefresh: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  resources,
  onOpenResource,
  onRefresh,
}) => {
  const handleRemove = (b: BookmarkItem) => {
    bookmarkService.toggle(b.targetType, b.targetId, b.targetTitle, b.category);
    onRefresh();
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#A38038] uppercase">
          <Bookmark className="w-4 h-4" />
          <span>Curated Personal Repository</span>
        </div>
        <h1 className="text-2xl font-bold font-display text-[#111214] mt-1">
          Saved Manuscripts & Bookmarks
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quickly access documents, formulas, and assessment problems pinned for review
        </p>
      </div>

      <div className="space-y-3">
        {bookmarks.map((b) => {
          const matchingRes = resources.find((r) => r.id === b.targetId);

          return (
            <div
              key={b.id}
              className="bg-white border border-slate-200 hover:border-[#C9A45C] rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#111214] text-[#C9A45C] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A38038]">
                    {b.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#111214] truncate">
                    {b.targetTitle}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Saved on {b.savedAt.split('T')[0]}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {matchingRes && (
                  <button
                    onClick={() => onOpenResource(matchingRes)}
                    className="px-4 py-1.5 bg-[#111214] text-white hover:bg-[#C9A45C] hover:text-[#111214] text-xs font-semibold rounded-lg transition-colors"
                  >
                    Open
                  </button>
                )}
                <button
                  onClick={() => handleRemove(b)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {bookmarks.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#111214]">No bookmarks saved yet</h3>
            <p className="text-slate-400 mt-1">Click the bookmark icon on any note or test question to pin it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
