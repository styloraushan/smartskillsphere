import React, { useState } from 'react';
import { ShieldCheck, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { SmartSkillSphereLogo } from '../components/SmartSkillSphereLogo';

interface AboutLegalViewProps {
  initialTab?: 'about' | 'contact' | 'privacy' | 'terms';
}

export const AboutLegalView: React.FC<AboutLegalViewProps> = ({
  initialTab = 'about',
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'privacy' | 'terms'>(initialTab);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl w-fit text-xs font-semibold">
        {[
          { id: 'about', label: 'About Us' },
          { id: 'contact', label: 'Faculty Contact' },
          { id: 'privacy', label: 'Privacy Policy' },
          { id: 'terms', label: 'Terms of Service' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === t.id
                ? 'bg-[#111214] text-[#C9A45C]'
                : 'text-slate-600 hover:text-[#111214]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: About */}
      {activeTab === 'about' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
          <SmartSkillSphereLogo size="lg" />
          <h1 className="text-2xl font-bold font-display text-[#111214]">
            Learn Smart. Practice Daily. Grow Beyond Limits.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            SmartSkillSphere is an intellectual assessment architecture engineered to bridge competitive campus recruitment examinations, national eligibility tests (GATE CS, CAT), and daily cognitive problem solving.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-[#F5F7FA] rounded-xl border border-slate-200">
              <h4 className="font-bold text-xs text-[#111214] mb-1">Peer-Reviewed Rigor</h4>
              <p className="text-[11px] text-slate-500">Every question and mathematical deduction is checked by senior academic moderators.</p>
            </div>
            <div className="p-4 bg-[#F5F7FA] rounded-xl border border-slate-200">
              <h4 className="font-bold text-xs text-[#111214] mb-1">Spaced Repetition</h4>
              <p className="text-[11px] text-slate-500">Integrated Mistake Book automatically isolates and schedules problem areas.</p>
            </div>
            <div className="p-4 bg-[#F5F7FA] rounded-xl border border-slate-200">
              <h4 className="font-bold text-xs text-[#111214] mb-1">Server-Verified Integrity</h4>
              <p className="text-[11px] text-slate-500">Strict negative-marking algorithms prevent answer exposure prior to submission.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Contact */}
      {activeTab === 'contact' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold font-display text-[#111214]">
            Academic Directorate Contact & Helpdesk
          </h2>
          <p className="text-xs text-slate-500">
            Have questions about syllabus alignment, question errata, or campus enterprise partnerships? Reach out to our faculty team.
          </p>

          {contactSubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Thank you. Your inquiry has been routed to the curriculum coordinator.</span>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 max-w-xl text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C9A45C] text-[#111214] font-bold rounded-lg hover:bg-[#d6b573] transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab: Privacy */}
      {activeTab === 'privacy' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-4 text-xs text-slate-600 leading-relaxed shadow-sm">
          <h2 className="text-xl font-bold font-display text-[#111214] mb-2">Privacy & Data Governance Policy</h2>
          <p>
            At SmartSkillSphere, student test performance data, response latencies, and diagnostic logs are processed strictly to personalize curriculum recommendations and benchmark percentile standing.
          </p>
          <h4 className="font-bold text-[#111214] pt-2">Data Isolation & Security:</h4>
          <p>
            Document manuscripts are served through private, ephemeral streaming tokens. We never sell, distribute, or expose student email identities or assessment submissions to third-party ad networks.
          </p>
          <p>
            Students retain the perpetual right to export their mistake book records and wipe local cache registries at any time.
          </p>
        </div>
      )}

      {/* Tab: Terms */}
      {activeTab === 'terms' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-4 text-xs text-slate-600 leading-relaxed shadow-sm">
          <h2 className="text-xl font-bold font-display text-[#111214] mb-2">Academic Code of Conduct & Terms of Service</h2>
          <p>
            By enrolling and taking live tests on SmartSkillSphere, students agree to observe academic honesty and refrain from automated scraping or unauthorized republication of copyrighted faculty manuscripts.
          </p>
          <p>
            Community polls and commentary are governed by professional peer respect standards. Accounts engaging in disruptive conduct or question bank plagiarism will be restricted.
          </p>
        </div>
      )}
    </div>
  );
};
