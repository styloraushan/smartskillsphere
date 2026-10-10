import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Bookmark, 
  FileText, 
  CheckCircle, 
  Clock, 
  Eye, 
  Layers, 
  Share2,
  ChevronRight
} from 'lucide-react';
import { Resource } from '../types';
import { resourceService, bookmarkService } from '../services/api';

interface ResourceDetailViewProps {
  resource: Resource;
  allResources: Resource[];
  onBack: () => void;
  onSelectResource: (resource: Resource) => void;
  onOpenPreviewModal: (resource: Resource) => void;
}

export const ResourceDetailView: React.FC<ResourceDetailViewProps> = ({
  resource,
  allResources,
  onBack,
  onSelectResource,
  onOpenPreviewModal,
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [, setRerender] = useState(0);

  const isBookmarked = bookmarkService.isBookmarked('resource', resource.id);

  const handleDownload = () => {
    const res = resourceService.download(resource.id);
    if (res.success) {
      setDownloadNotice('Download verified & initiated via private delivery token.');
      setTimeout(() => setDownloadNotice(null), 3500);
      setRerender((v) => v + 1);
    }
  };

  const handleBookmark = () => {
    bookmarkService.toggle('resource', resource.id, resource.title, resource.subject);
    setRerender((v) => v + 1);
  };

  const similarResources = allResources
    .filter((r) => r.id !== resource.id && (r.subject === resource.subject || r.examCategory === resource.examCategory))
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-16">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#111214] hover:text-[#A38038] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Resources</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Main Detail Grid matching Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cover Card & Content Description */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Cover Visual as in Screen 3 */}
            <div className="sm:col-span-5 bg-[#111214] text-white rounded-xl p-6 flex flex-col justify-between aspect-[3/4] border border-[#25344A] shadow-inner relative overflow-hidden group">
              <div className="space-y-2 z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A45C] bg-[#C9A45C]/15 px-2 py-0.5 rounded border border-[#C9A45C]/30 inline-block">
                  {resource.subject}
                </span>
                <h3 className="text-lg font-bold font-display text-white mt-4 leading-snug">
                  {resource.title}
                </h3>
              </div>

              <div className="z-10 pt-4 border-t border-[#25344A] flex items-center justify-between text-[11px] text-slate-400">
                <span>{resource.examCategory}</span>
                <span className="font-mono text-[#C9A45C]">v{resource.versions[0]?.versionNumber || 1}.0</span>
              </div>

              {/* Geometric background decoration */}
              <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full border border-[#C9A45C]/20 pointer-events-none" />
            </div>

            {/* Right Meta details matching Screen 3 */}
            <div className="sm:col-span-7 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="text-[#A38038]">{resource.subject}</span>
                  <span>·</span>
                  <span>{resource.difficulty}</span>
                  <span>·</span>
                  <span className="font-mono">{resource.fileType.toUpperCase()}</span>
                </div>

                <h1 className="text-2xl font-bold font-display text-[#111214]">
                  {resource.title}
                </h1>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 font-mono">
                  <span>{resource.fileSize}</span>
                  <span>·</span>
                  <span className="tabular-nums">{resource.downloadCount.toLocaleString()} downloads</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-2">
                {resource.description}
              </p>

              {/* What's Inside section matching Screen 3 */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111214]">
                  What's Inside:
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#A38038]" />
                    <span>Important formulas & algebraic shortcuts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#A38038]" />
                    <span>Step-by-step solved benchmark examples</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#A38038]" />
                    <span>Graded practice questions (Easy to Hard)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#A38038]" />
                    <span>Previous year examination patterns & solutions</span>
                  </li>
                </ul>
              </div>

              {/* Actions row: Download & Bookmark & Preview matching Screen 3 */}
              <div className="pt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 bg-[#C9A45C] text-[#111214] text-xs font-bold rounded hover:bg-[#d6b573] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`px-4 py-2.5 text-xs font-semibold rounded border transition-colors flex items-center gap-2 ${
                    isBookmarked
                      ? 'border-[#C9A45C] bg-[#C9A45C]/10 text-[#C9A45C]'
                      : 'border-slate-300 text-slate-700 hover:border-[#111214]'
                  }`}
                >
                  <Bookmark className="w-4 h-4" fill={isBookmarked ? '#C9A45C' : 'none'} />
                  <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={() => onOpenPreviewModal(resource)}
                  className="px-4 py-2.5 text-xs font-semibold rounded border border-slate-300 hover:border-[#111214] text-slate-700 hover:text-[#111214] transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Read Manuscript</span>
                </button>
              </div>
            </div>
          </div>

          {/* Curriculum Index Details */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-[#111214]">Document Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#F5F7FA] rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Publication</span>
                <span className="font-semibold text-slate-800">{resource.publishedAt}</span>
              </div>
              <div className="p-3 bg-[#F5F7FA] rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Exam Fit</span>
                <span className="font-semibold text-slate-800 truncate block">{resource.examCategory}</span>
              </div>
              <div className="p-3 bg-[#F5F7FA] rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Revision</span>
                <span className="font-semibold text-slate-800">Version {resource.versions[0]?.versionNumber || 1}.0</span>
              </div>
              <div className="p-3 bg-[#F5F7FA] rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Community Approval</span>
                <span className="font-semibold text-emerald-700 tabular-nums font-mono">{resource.upvotes} Upvotes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Similar Resources matching Screen 3 */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#111214] font-display">
              Similar Resources
            </h3>

            <div className="space-y-3">
              {similarResources.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectResource(item)}
                  className="p-3 border border-slate-100 hover:border-[#C9A45C] rounded-lg transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded bg-[#F5F7FA] border border-slate-200 text-[#A38038] flex items-center justify-center shrink-0 group-hover:bg-[#111214] group-hover:text-[#C9A45C] transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#111214] group-hover:text-[#A38038] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {item.fileSize} · {item.downloadCount.toLocaleString()} dl
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#111214] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
