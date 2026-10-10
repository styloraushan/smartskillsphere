import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Eye, 
  Bookmark, 
  ChevronRight,
  BookOpen,
  Calculator,
  Compass,
  Code2,
  Globe
} from 'lucide-react';
import { Resource } from '../types';
import { bookmarkService } from '../services/api';

interface ResourcesViewProps {
  resources: Resource[];
  onSelectResource: (resource: Resource) => void;
  onOpenPreviewModal: (resource: Resource) => void;
  initialSearch?: string;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  onSelectResource,
  onOpenPreviewModal,
  initialSearch = '',
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const subjects = ['All', 'Quantitative Aptitude', 'Computer Science', 'Operating Systems', 'Logical Reasoning', 'Verbal Ability'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const fileTypes = ['All', 'pdf', 'docx', 'pptx'];

  const filtered = resources.filter((res) => {
    if (selectedSubject !== 'All' && res.subject !== selectedSubject) return false;
    if (selectedDifficulty !== 'All' && res.difficulty !== selectedDifficulty) return false;
    if (selectedType !== 'All' && res.fileType !== selectedType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'quantitative aptitude':
        return Calculator;
      case 'logical reasoning':
        return Compass;
      case 'computer science':
      case 'operating systems':
        return Code2;
      case 'verbal ability':
        return BookOpen;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Section Header matching Screen 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#111214]">
            Notes & Resources
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, preview and securely download peer-reviewed academic manuscripts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Showing <strong className="text-[#111214] tabular-nums">{filtered.length}</strong> resources</span>
        </div>
      </div>

      {/* Filter and Search Bar matching Screen 2 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, tag, or topic..."
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-[#25344A] focus:outline-none focus:border-[#C9A45C]"
            />
          </div>

          {/* Subject dropdown */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#25344A] focus:outline-none focus:border-[#C9A45C]"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'All' ? 'All Subjects' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty dropdown */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#25344A] focus:outline-none focus:border-[#C9A45C]"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Difficulties' : `${d} Level`}
                </option>
              ))}
            </select>
          </div>

          {/* Type dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#25344A] focus:outline-none focus:border-[#C9A45C]"
            >
              {fileTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All File Types' : t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Resource Cards (Matching Screen 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((res) => {
          const Icon = getSubjectIcon(res.subject);
          const isBookmarked = bookmarkService.isBookmarked('resource', res.id);

          return (
            <div
              key={res.id}
              className="bg-white border border-slate-200 hover:border-[#C9A45C] rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-all group relative cursor-pointer"
              onClick={() => onSelectResource(res)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-lg bg-[#111214] text-[#C9A45C] flex items-center justify-center shrink-0 border border-[#25344A]">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 font-mono">
                      {res.fileType.toUpperCase()} · {res.fileSize}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-[#A38038] uppercase tracking-wider mb-1">
                    {res.subject}
                  </div>
                  <h3 className="text-sm font-bold text-[#111214] group-hover:text-[#A38038] transition-colors line-clamp-2">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                {/* Tags unboxed */}
                <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-500">
                  {res.tags.slice(0, 3).map((tag, idx) => (
                    <span key={tag}>
                      #{tag}{idx < 2 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="tabular-nums font-mono text-[11px]">
                  {res.downloadCount.toLocaleString()} downloads
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPreviewModal(res);
                    }}
                    className="p-1 text-slate-400 hover:text-[#111214] transition-colors"
                    title="Quick Manuscript Reader"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-[#A38038] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#111214]">No study materials match your search</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your subject or difficulty filters</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedSubject('All');
              setSelectedDifficulty('All');
              setSelectedType('All');
            }}
            className="mt-4 px-4 py-2 bg-[#111214] text-white text-xs font-semibold rounded hover:bg-slate-800"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
