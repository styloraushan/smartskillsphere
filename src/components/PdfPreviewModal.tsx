import React, { useState } from 'react';
import { Resource } from '../types';
import { 
  X, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  History
} from 'lucide-react';
import { resourceService, bookmarkService } from '../services/api';

interface PdfPreviewModalProps {
  resource: Resource;
  onClose: () => void;
  onUpdate: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  resource,
  onClose,
  onUpdate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'versions'>('preview');

  const isBookmarked = bookmarkService.isBookmarked('resource', resource.id);

  const handleDownload = () => {
    const res = resourceService.download(resource.id);
    if (res.success) {
      setDownloadSuccess('Document verified. Secure download initialized.');
      setTimeout(() => setDownloadSuccess(null), 3500);
      onUpdate();
    }
  };

  const handleFeedback = (isUseful: boolean) => {
    try {
      resourceService.voteFeedback(resource.id, isUseful);
      onUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookmarkToggle = () => {
    bookmarkService.toggle('resource', resource.id, resource.title, resource.subject);
    onUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#111214]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-[#C9A45C]/30 text-[#25344A]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111214] text-white border-b border-[#25344A]">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="w-8 h-8 rounded bg-[#C9A45C]/20 border border-[#C9A45C]/40 flex items-center justify-center text-[#C9A45C] shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate text-white">{resource.title}</h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{resource.subject}</span>
                <span>·</span>
                <span>{resource.difficulty}</span>
                <span>·</span>
                <span>{resource.fileSize}</span>
                <span>·</span>
                <span>v{resource.versions[0]?.versionNumber || 1}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded border transition-colors ${
                isBookmarked
                  ? 'border-[#C9A45C] text-[#C9A45C] bg-[#C9A45C]/10'
                  : 'border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? '#C9A45C' : 'none'} />
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#C9A45C] text-[#111214] hover:bg-[#A38038] transition-colors rounded"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Sub-toolbar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#F5F7FA] border-b border-slate-200 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white text-[#111214] shadow-sm'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Manuscript Reader
              </button>
              <button
                onClick={() => setActiveTab('versions')}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'versions'
                    ? 'bg-white text-[#111214] shadow-sm'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                <History className="w-3 h-3" />
                <span>Version History ({resource.versions.length})</span>
              </button>
            </div>
          </div>

          {activeTab === 'preview' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-slate-600">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 disabled:opacity-30 hover:text-black"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="tabular-nums">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 disabled:opacity-30 hover:text-black"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 border-l border-slate-300 pl-4">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                  className="p-1 hover:text-black"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="tabular-nums text-slate-500 w-10 text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                  className="p-1 hover:text-black"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto bg-slate-100 p-6 flex justify-center">
          {activeTab === 'preview' ? (
            <div
              style={{ width: `${zoomLevel}%`, maxWidth: '820px' }}
              className="bg-white border border-slate-300 shadow-md p-10 min-h-[600px] flex flex-col justify-between text-[#25344A] transition-all"
            >
              <div>
                {/* Simulated Scholarly Header */}
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-widest">
                    <span>SmartSkillSphere Academic Archives</span>
                    <span>Document ID: {resource.id}</span>
                  </div>
                  <h1 className="text-xl font-bold font-display text-[#111214] mt-3">
                    {resource.title}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Subject: {resource.subject} · Category: {resource.examCategory} · Level: {resource.difficulty}
                  </p>
                </div>

                {/* Simulated Document Sections based on Page */}
                <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                  <p className="font-medium text-[#111214]">
                    Abstract & Curriculum Alignment:
                  </p>
                  <p>{resource.description}</p>

                  <div className="my-4 p-4 bg-[#F5F7FA] border border-slate-200 rounded">
                    <h4 className="font-semibold text-slate-900 mb-2">Core Competency Framework (Section {currentPage}.0):</h4>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                      <li>Rigorous conceptual foundations with boundary conditions and mathematical proofs.</li>
                      <li>Standardized competitive examination problem paradigms and optimal time-complexity bounds.</li>
                      <li>Diagnostic self-test matrices and common conceptual trap analysis.</li>
                    </ul>
                  </div>

                  <p>
                    In competitive problem solving, candidates often forfeit marks through inadequate understanding of invariant conditions. When approaching complex multi-step deductions, isolating the fundamental base relation prior to calculating intermediate figures prevents compounding algebraic slips.
                  </p>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-amber-900 text-[11px]">
                    <span className="font-semibold">Faculty Insight:</span> Always verify dimensional consistency and asymptotic bounds when verifying final derived values.
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-8 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified Private Document Asset</span>
                <span className="tabular-nums">Sheet {currentPage} of {totalPages}</span>
              </div>
            </div>
          ) : (
            /* Version History Tab */
            <div className="w-full max-w-2xl bg-white p-6 rounded shadow border border-slate-200">
              <h4 className="text-sm font-bold text-[#111214] mb-4">Revision & Version Chronology</h4>
              <div className="space-y-4">
                {resource.versions.map((v) => (
                  <div key={v.versionNumber} className="p-4 border border-slate-200 rounded bg-[#F5F7FA]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#111214]">Version {v.versionNumber}.0</span>
                      <span className="text-slate-500 tabular-nums">{v.uploadedAt}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{v.changeLog}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>File: {v.fileName}</span>
                      <span>·</span>
                      <span>Size: {v.fileSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar: Useful feedback and download statistics */}
        <div className="px-6 py-3 bg-[#F5F7FA] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span className="tabular-nums">Downloads: {resource.downloadCount.toLocaleString()}</span>
            <span>·</span>
            <span className="tabular-nums">Views: {resource.viewCount.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">Was this manuscript useful?</span>
            <button
              onClick={() => handleFeedback(true)}
              className="flex items-center gap-1 px-2.5 py-1 border border-slate-300 rounded hover:border-[#C9A45C] hover:text-[#C9A45C] transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="tabular-nums">{resource.upvotes}</span>
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="flex items-center gap-1 px-2.5 py-1 border border-slate-300 rounded hover:border-slate-500 transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span className="tabular-nums">{resource.downvotes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
