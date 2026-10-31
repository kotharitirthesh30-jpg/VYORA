import React, { useState } from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Download,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ResearchSession, ResearchSource } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

interface ResearchViewProps {
  onExecuteResearch: (query: string) => Promise<ResearchSession>;
  sessions: ResearchSession[];
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  onExecuteResearch,
  sessions,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<ResearchSession | null>(
    sessions[0] || null
  );
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const session = await onExecuteResearch(query.trim());
      setActiveSession(session);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!activeSession) return;
    navigator.clipboard.writeText(
      `# Research Dossier: ${activeSession.query}\n\n${activeSession.summaryAnswer}\n\n## Sources:\n${activeSession.sources
        .map((s, i) => `${i + 1}. [${s.title}](${s.url})`)
        .join('\n')}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeSession) return;
    const blob = new Blob(
      [
        `# VYORA Research Dossier\nTopic: ${activeSession.query}\nDate: ${new Date(
          activeSession.createdAt
        ).toLocaleString()}\n\n${activeSession.summaryAnswer}\n\n## Verified Sources:\n${activeSession.sources
          .map((s, i) => `${i + 1}. ${s.title} (${s.sourceDomain}) - ${s.url}`)
          .join('\n')}`,
      ],
      { type: 'text/markdown;charset=utf-8;' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VYORA_Research_${activeSession.query.replace(/\s+/g, '_').slice(0, 30)}.md`;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#090A10] overflow-hidden">
      {/* Main Research Content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* Header & Subtitle */}
          <div>
            <div className="flex items-center gap-2 text-xs text-[#22D3EE] font-semibold uppercase tracking-wider mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Deep Web Research Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Grounded Web Intelligence</h1>
            <p className="text-xs text-[#999BAE] mt-1">
              Live Google Search grounding across indexed internet sources, multi-document synthesis, and verifiable citations.
            </p>
          </div>

          {/* Research Query Input Form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center bg-[#171925] border border-white/10 rounded-xl p-2 focus-within:border-[#22D3EE]/60 shadow-lg transition-colors">
              <Search className="w-5 h-5 text-[#999BAE] ml-2 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask an investigative topic, e.g., 'What is the current state of commercial fusion reactors in 2026?'"
                className="w-full bg-transparent px-3 py-2 text-sm text-[#F5F5FA] placeholder-[#999BAE]/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
                  query.trim() && !isLoading
                    ? 'bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-[#090A10] shadow-md hover:opacity-90 font-bold'
                    : 'bg-white/5 text-[#999BAE] cursor-not-allowed opacity-50'
                }`}
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Investigating...</span>
                  </>
                ) : (
                  <>
                    <span>Research</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Loading Pipeline State */}
          {isLoading && (
            <div className="p-6 rounded-2xl bg-[#171925] border border-white/10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#22D3EE]/20 border border-[#22D3EE]/40 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#22D3EE] animate-spin" />
              </div>
              <div className="font-semibold text-white text-sm">
                Querying Real-Time Search Grounding Index...
              </div>
              <p className="text-xs text-[#999BAE] max-w-sm">
                Filtering duplicate domains, extracting factual evidence, and generating cited analytical synthesis.
              </p>
            </div>
          )}

          {/* Active Dossier Display */}
          {!isLoading && activeSession && (
            <div className="space-y-6">
              {/* Actions Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs text-[#999BAE]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(activeSession.createdAt).toLocaleString()}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#22D3EE] font-medium">Model: {activeSession.modelUsed}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#999BAE] hover:text-white bg-[#171925] border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? 'Copied' : 'Copy Dossier'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#999BAE] hover:text-white bg-[#171925] border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export .md</span>
                  </button>
                </div>
              </div>

              {/* Verified Sources Grid */}
              {activeSession.sources.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
                    <span>Verified Web Sources ({activeSession.sources.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeSession.sources.map((source, idx) => (
                      <a
                        key={source.id || idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-[#171925] border border-white/5 hover:border-[#22D3EE]/40 transition-all text-xs group block"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-[#22D3EE] font-mono uppercase tracking-wider">
                            {source.sourceDomain}
                          </span>
                          <ExternalLink className="w-3 h-3 text-[#999BAE] group-hover:text-[#22D3EE] transition-colors" />
                        </div>
                        <div className="font-semibold text-white group-hover:text-[#22D3EE] line-clamp-1 mb-1">
                          {source.title}
                        </div>
                        <p className="text-[11px] text-[#999BAE] line-clamp-2">
                          {source.snippet}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytical Synthesis */}
              <div className="p-6 rounded-2xl bg-[#171925] border border-white/10 shadow-sm">
                <MarkdownRenderer content={activeSession.summaryAnswer} />
              </div>

              {/* Follow-up Investigations */}
              {activeSession.suggestedFollowUps.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#999BAE] uppercase tracking-wider">
                    Recommended Follow-up Investigations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeSession.suggestedFollowUps.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(q);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#171925] hover:bg-[#1f2233] border border-white/5 hover:border-[#22D3EE]/30 text-xs text-[#999BAE] hover:text-white transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state when no sessions */}
          {!isLoading && !activeSession && (
            <div className="p-12 text-center text-xs text-[#999BAE]">
              Enter a topic above to launch your first grounded research investigation.
            </div>
          )}
        </div>
      </div>

      {/* Research History Sidebar */}
      <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/5 bg-[#10111A] p-4 flex flex-col shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-white mb-3">
          <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
          <span>Research Log ({sessions.length})</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5">
          {sessions.length === 0 ? (
            <div className="text-[11px] text-[#999BAE] text-center py-6">
              No previous research sessions recorded
            </div>
          ) : (
            sessions.map((sess) => {
              const isSelected = activeSession?.id === sess.id;
              return (
                <button
                  key={sess.id}
                  onClick={() => setActiveSession(sess)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#171925] border border-[#22D3EE]/30 text-white'
                      : 'text-[#999BAE] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="font-semibold line-clamp-2 mb-1">{sess.query}</div>
                  <div className="text-[10px] text-[#999BAE]">
                    {new Date(sess.createdAt).toLocaleDateString()} · {sess.sources.length} sources
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
