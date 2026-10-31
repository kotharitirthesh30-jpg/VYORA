import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#171925] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col p-6 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            {type === 'privacy' ? (
              <>
                <Shield className="w-5 h-5 text-[#22D3EE]" />
                <span>VYORA Privacy Policy & Zero-Retention Architecture</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 text-[#8B5CF6]" />
                <span>VYORA Terms of Service</span>
              </>
            )}
          </div>
          <button onClick={onClose} className="text-[#999BAE] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto text-xs text-[#999BAE] leading-relaxed space-y-4 pr-2">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <h3 className="text-sm font-semibold text-white">1. Core Privacy Philosophy</h3>
              <p>
                VYORA is designed from first principles around user autonomy and data isolation. Your conversational threads, uploaded documents, and personal memory nodes are stored locally in your browser storage or isolated user database.
              </p>

              <h3 className="text-sm font-semibold text-white">2. User-Approved Memory</h3>
              <p>
                No memory items are silently extracted from conversational inference without your review. Each memory record requires active user approval before being introduced to model system instructions.
              </p>

              <h3 className="text-sm font-semibold text-white">3. Third-Party Model Providers</h3>
              <p>
                When a query is dispatched to Google Gemini or OpenAI, only the relevant prompt tokens and selected grounding context are transmitted over encrypted TLS. API keys are managed strictly server-side and are never exposed to browser bundles.
              </p>

              <h3 className="text-sm font-semibold text-white">4. Complete Portability & Deletion</h3>
              <p>
                You retain full rights to export your complete workspace in standard JSON format at any time. Clicking "Purge All Workspace Data" triggers an irreversible wipe of all indexed chunks, memories, and threads.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <h3 className="text-sm font-semibold text-white">1. Acceptance of Terms</h3>
              <p>
                By accessing or using the VYORA platform, you agree to comply with these Terms of Service. If you do not agree, you must discontinue use immediately.
              </p>

              <h3 className="text-sm font-semibold text-white">2. AI Output & Verification</h3>
              <p>
                VYORA provides multi-model synthesis and search-grounded answers. While our engines employ Google Search grounding and semantic document retrieval to maximize factual veracity, artificial intelligence outputs may occasionally contain discrepancies. Users are advised to review source citations for mission-critical decisions.
              </p>

              <h3 className="text-sm font-semibold text-white">3. Acceptable Use</h3>
              <p>
                Users agree not to use the platform for unlawful activities, malicious file uploads, or attempting unauthorized access to provider infrastructures.
              </p>
            </>
          )}
        </div>

        <div className="pt-3 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#8B5CF6] text-white text-xs font-semibold hover:bg-[#7C3AED]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
