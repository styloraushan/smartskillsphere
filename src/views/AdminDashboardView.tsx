import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  PlusCircle, 
  FileText, 
  Trophy, 
  BarChart2, 
  Users, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Trash2,
  Edit,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { User, Resource, Question, Quiz, Poll, AuditLog } from '../types';
import { 
  resourceService, 
  questionService, 
  quizService, 
  pollService, 
  auditService 
} from '../services/api';
import { AccessDeniedView } from './AccessDeniedView';

interface AdminDashboardViewProps {
  currentUser?: User | null;
  resources: Resource[];
  quizzes: Quiz[];
  polls: Poll[];
  auditLogs: AuditLog[];
  onRefresh: () => void;
  onNavigate?: (tab: string, param?: string) => void;
  onOpenSuperAdminLogin?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  resources,
  quizzes,
  polls,
  auditLogs,
  onRefresh,
  onNavigate,
  onOpenSuperAdminLogin,
}) => {
  // Security Guard: Restrict route to super_admin. Render 403 Access Denied for students and guests.
  if (currentUser?.role !== 'super_admin') {
    return (
      <AccessDeniedView
        currentRole={currentUser?.role || 'guest'}
        onNavigateHome={() => onNavigate && onNavigate('home')}
        onOpenSuperAdminLogin={() => onOpenSuperAdminLogin && onOpenSuperAdminLogin()}
      />
    );
  }

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'resources' | 'questions' | 'quizzes' | 'polls' | 'audit'>('overview');
  const [notice, setNotice] = useState<string | null>(null);

  // New Resource Form state
  const [newResTitle, setNewResTitle] = useState('');
  const [newResSubject, setNewResSubject] = useState('Quantitative Aptitude');
  const [newResDifficulty, setNewResDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newResDesc, setNewResDesc] = useState('');
  const [newResFileType, setNewResFileType] = useState<'pdf' | 'docx' | 'pptx'>('pdf');
  const [newResTags, setNewResTags] = useState('Curriculum, Placement, Formulas');

  // New Question Form state
  const [qSubject, setQSubject] = useState('Quantitative Aptitude');
  const [qTopic, setQTopic] = useState('Time & Work');
  const [qDiff, setQDiff] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [qText, setQText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctOptIdx, setCorrectOptIdx] = useState('opt_1');
  const [qExplanation, setQExplanation] = useState('');

  // Bulk CSV Question Import state
  const [bulkCsvText, setBulkCsvText] = useState(
`Quantitative Aptitude | Percentages | Medium | What is 25% of 640? | 120, 160, 180, 200 | 2 | 25% is 1/4th. 640 / 4 = 160.
Logical Reasoning | Series | Easy | Next number in series: 2, 4, 8, 16, ? | 24, 28, 32, 64 | 3 | Each term doubles the previous one. 16 * 2 = 32.`
  );

  // New Poll Form state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptionsText, setPollOptionsText] = useState('Option A\nOption B\nOption C');
  const [pollCategory, setPollCategory] = useState('Platform Strategy');

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim() || !newResDesc.trim()) return;

    resourceService.create({
      title: newResTitle,
      description: newResDesc,
      subject: newResSubject,
      topic: 'Comprehensive',
      examCategory: 'Competitive Standard',
      tags: newResTags.split(',').map((t) => t.trim()),
      difficulty: newResDifficulty,
      fileType: newResFileType,
      fileSize: '3.2 MB',
      fileUrl: 'https://smartskillsphere.edu/documents/manuscript_verified.pdf',
      thumbnail: '/src/assets/images/notes_editorial_library_1791661007940.jpg',
      publishedAt: new Date().toISOString().split('T')[0],
      visibility: 'published',
    });

    setNewResTitle('');
    setNewResDesc('');
    setNotice('Resource published and version 1.0 cataloged in repository.');
    setTimeout(() => setNotice(null), 3000);
    onRefresh();
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !opt1.trim() || !opt2.trim()) return;

    questionService.add({
      subject: qSubject,
      topic: qTopic,
      examCategory: 'General Competitive',
      difficulty: qDiff,
      text: qText,
      options: [
        { id: 'opt_1', text: opt1 },
        { id: 'opt_2', text: opt2 },
        { id: 'opt_3', text: opt3 || 'None of the above' },
        { id: 'opt_4', text: opt4 || 'All of the above' },
      ],
      correctOptionId: correctOptIdx,
      explanation: qExplanation || 'Verified standard deductive solution.',
      marks: 2,
      negativeMarks: 0.5,
    });

    setQText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setQExplanation('');
    setNotice('Question added to primary question bank.');
    setTimeout(() => setNotice(null), 3000);
    onRefresh();
  };

  const handleBulkImport = () => {
    const res = questionService.bulkImport(bulkCsvText);
    if (res.importedCount > 0) {
      setNotice(`Successfully imported ${res.importedCount} questions from raw stream.`);
      setTimeout(() => setNotice(null), 3500);
      onRefresh();
    }
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim()) return;

    const opts = pollOptionsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text, idx) => ({
        id: `opt_${Date.now()}_${idx}`,
        text,
        votes: 0,
      }));

    if (opts.length < 2) return;

    pollService.create({
      question: pollQuestion,
      description: 'Faculty initiated perspective inquiry',
      category: pollCategory,
      options: opts,
      isMultiChoice: false,
      isAnonymous: true,
      startsAt: new Date().toISOString().split('T')[0],
      endsAt: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      visibility: 'public',
      status: 'active',
    });

    setPollQuestion('');
    setNotice('Community poll scheduled and launched.');
    setTimeout(() => setNotice(null), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header matching Screen 20 */}
      <div className="bg-[#111214] text-white p-6 sm:p-8 rounded-2xl border border-[#25344A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C9A45C] uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Academic Faculty Administration Console</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mt-1">
            Admin Overview & Curriculum Governance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish vetted manuscripts, configure timed exam sets, manage polls, and inspect audit trails
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
          System Status: Operational
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Admin Tabs matching Screen 20 */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview Metrics' },
          { id: 'resources', label: 'Resource Management' },
          { id: 'questions', label: 'Question Bank' },
          { id: 'quizzes', label: 'Quiz Sets' },
          { id: 'polls', label: 'Poll Scheduler' },
          { id: 'audit', label: 'Audit Logs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeAdminTab === tab.id
                ? 'bg-[#111214] text-[#C9A45C]'
                : 'text-slate-600 hover:text-[#111214]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview Metrics matching Screen 20 */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
              <span className="text-slate-400 text-xs font-semibold uppercase">Total Students</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#111214] mt-2">
                4,892
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
              <span className="text-slate-400 text-xs font-semibold uppercase">Quizzes Taken</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#111214] mt-2">
                12,450
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
              <span className="text-slate-400 text-xs font-semibold uppercase">Polls Created</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#A38038] mt-2">
                {polls.length}
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
              <span className="text-slate-400 text-xs font-semibold uppercase">Active Resources</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#111214] mt-2">
                {resources.length}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#111214]">Curriculum Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveAdminTab('resources')}
                className="px-4 py-2 bg-[#111214] text-white hover:bg-[#C9A45C] hover:text-[#111214] rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Resource</span>
              </button>
              <button
                onClick={() => setActiveAdminTab('questions')}
                className="px-4 py-2 bg-[#111214] text-white hover:bg-[#C9A45C] hover:text-[#111214] rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Question to Bank</span>
              </button>
              <button
                onClick={() => setActiveAdminTab('polls')}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:border-[#111214] rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <BarChart2 className="w-4 h-4" />
                <span>Schedule New Poll</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Resource Upload and Manager */}
      {activeAdminTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Form */}
          <form
            onSubmit={handleCreateResource}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-bold text-[#111214] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#A38038]" />
              <span>Publish Academic Manuscript</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
              <input
                type="text"
                required
                value={newResTitle}
                onChange={(e) => setNewResTitle(e.target.value)}
                placeholder="e.g. Advanced Discrete Mathematics Formula Handbook"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-xs text-[#25344A] focus:outline-none focus:border-[#C9A45C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={newResSubject}
                  onChange={(e) => setNewResSubject(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-[#25344A]"
                >
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Logical Reasoning">Logical Reasoning</option>
                  <option value="Verbal Ability">Verbal Ability</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={newResDifficulty}
                  onChange={(e) => setNewResDifficulty(e.target.value as any)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-[#25344A]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={newResDesc}
                onChange={(e) => setNewResDesc(e.target.value)}
                placeholder="Comprehensive summary of curriculum alignment and formulas..."
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-xs text-[#25344A] focus:outline-none focus:border-[#C9A45C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Comma-Separated Tags</label>
              <input
                type="text"
                value={newResTags}
                onChange={(e) => setNewResTags(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-[#25344A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] font-bold text-xs rounded-lg transition-colors"
            >
              Upload & Publish to Vault
            </button>
          </form>

          {/* Existing Resources Table */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Vault Manuscripts ({resources.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {resources.map((res) => (
                <div key={res.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#111214] truncate">{res.title}</h4>
                    <span className="text-[11px] text-slate-500">
                      {res.subject} · {res.fileType.toUpperCase()} ({res.fileSize}) · {res.downloadCount} downloads
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        resourceService.delete(res.id);
                        onRefresh();
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Question Bank & Bulk Import */}
      {activeAdminTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Single Question */}
          <form
            onSubmit={handleCreateQuestion}
            className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-bold text-[#111214] flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-[#A38038]" />
              <span>Question Editor</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">Subject</label>
                <select
                  value={qSubject}
                  onChange={(e) => setQSubject(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded p-1.5"
                >
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Logical Reasoning">Logical Reasoning</option>
                  <option value="Technical Practice">Technical Practice</option>
                  <option value="Verbal Ability">Verbal Ability</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Topic</label>
                <input
                  type="text"
                  value={qTopic}
                  onChange={(e) => setQTopic(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded p-1.5"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Difficulty</label>
                <select
                  value={qDiff}
                  onChange={(e) => setQDiff(e.target.value as any)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded p-1.5"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Text</label>
              <textarea
                required
                rows={2}
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="State the problem clearly..."
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700">Options (A, B, C, D)</label>
              <input
                type="text"
                required
                value={opt1}
                onChange={(e) => setOpt1(e.target.value)}
                placeholder="Option A"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded p-2"
              />
              <input
                type="text"
                required
                value={opt2}
                onChange={(e) => setOpt2(e.target.value)}
                placeholder="Option B"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded p-2"
              />
              <input
                type="text"
                value={opt3}
                onChange={(e) => setOpt3(e.target.value)}
                placeholder="Option C"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded p-2"
              />
              <input
                type="text"
                value={opt4}
                onChange={(e) => setOpt4(e.target.value)}
                placeholder="Option D"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Correct Answer</label>
                <select
                  value={correctOptIdx}
                  onChange={(e) => setCorrectOptIdx(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded p-2"
                >
                  <option value="opt_1">Option A</option>
                  <option value="opt_2">Option B</option>
                  <option value="opt_3">Option C</option>
                  <option value="opt_4">Option D</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Explanation</label>
              <textarea
                rows={2}
                value={qExplanation}
                onChange={(e) => setQExplanation(e.target.value)}
                placeholder="Step-by-step mathematical reasoning..."
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#111214] text-[#C9A45C] hover:bg-slate-800 font-bold text-xs rounded-lg transition-colors"
            >
              Save Question to Bank
            </button>
          </form>

          {/* Bulk CSV Import Stream */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#111214] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#A38038]" />
              <span>Bulk Question Importer (Pipe Separated)</span>
            </h3>

            <p className="text-xs text-slate-500">
              Format: <code>Subject | Topic | Difficulty | QuestionText | Opt1,Opt2,Opt3,Opt4 | CorrectIdx(1-4) | Explanation</code>
            </p>

            <textarea
              rows={8}
              value={bulkCsvText}
              onChange={(e) => setBulkCsvText(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#C9A45C]"
            />

            <button
              onClick={handleBulkImport}
              className="w-full py-2.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Validate & Commit Bulk Batch</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab: Poll Scheduler */}
      {activeAdminTab === 'polls' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleCreatePoll}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-bold text-[#111214] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#A38038]" />
              <span>Schedule New Community Poll</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Poll Question</label>
              <input
                type="text"
                required
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="e.g. Which programming language should be prioritized for SDE placement?"
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-xs text-[#25344A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={pollCategory}
                onChange={(e) => setPollCategory(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Options (One option per line)
              </label>
              <textarea
                rows={4}
                value={pollOptionsText}
                onChange={(e) => setPollOptionsText(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#C9A45C] hover:bg-[#d6b573] text-[#111214] font-bold text-xs rounded-lg transition-colors"
            >
              Publish Active Poll
            </button>
          </form>

          {/* Active Polls List */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Community Inquiries
              </h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {polls.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#111214]">{p.question}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {p.totalVotes} votes cast · Status: {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              System Audit Trail & Administrative Integrity
            </h3>
            <span className="text-xs text-slate-400 font-mono">Immutable Log Ledger</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-[#A38038]">{log.action}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">{log.entityType} ({log.entityId})</span>
                  </div>
                  <p className="text-slate-700 mt-1">{log.details}</p>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
                  <div>{log.actorName} ({log.actorRole})</div>
                  <div>{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
