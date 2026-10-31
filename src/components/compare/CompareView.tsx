import React, { useState } from 'react';
import {
  Scale,
  Play,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Clock,
  Layers,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { MODEL_REGISTRY } from '../../lib/ai/models';
import { ComparisonSession, ComparisonResponse } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

interface CompareViewProps {
  onRunComparison: (prompt: string, modelIds: string[]) => Promise<ComparisonSession>;
  comparisonHistory: ComparisonSession[];
}

export const CompareView: React.FC<CompareViewProps> = ({
  onRunComparison,
  comparisonHistory,
}) => {
  const [prompt, setPrompt] = useState(
    'Compare the performance, memory footprint, and concurrency guarantees of Rust vs Go for high-throughput microservices. Provide a structured summary table.'
  );
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'vyora-neural-core',
    'vyora-deep-logic',
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSession, setActiveSession] = useState<ComparisonSession | null>(
    comparisonHistory[0] || null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleModelSelection = (id: string) => {
    if (selectedModelIds.includes(id)) {
      if (selectedModelIds.length > 2) {
        setSelectedModelIds(selectedModelIds.filter((m) => m !== id));
      }
    } else {
      if (selectedModelIds.length < 3) {
        setSelectedModelIds([...selectedModelIds, id]);
      }
    }
  };

  const handleStartComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || selectedModelIds.length < 2 || isRunning) return;

    setIsRunning(true);
    try {
      const session = await onRunComparison(prompt.trim(), selectedModelIds);
      setActiveSession(session);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyAnswer = (modelId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(modelId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090A10] overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-semibold uppercase tracking-wider mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>Dual-Engine Arena</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Side-by-Side Model Comparison</h1>
          <p className="text-xs text-[#999BAE] mt-1">
            Benchmark latency, reasoning depth, and output formatting across VYORA's specialized neural engines simultaneously.
          </p>
        </div>

        {/* Configuration Card */}
        <div className="p-5 rounded-2xl bg-[#171925] border border-white/10 space-y-4 shadow-sm">
          {/* Model picker chips */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#999BAE] mb-2 font-medium">
              <span>Select 2 to 3 VYORA Engines to Compare:</span>
              <span>{selectedModelIds.length} engines selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MODEL_REGISTRY.map((m) => {
                const isSelected = selectedModelIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleModelSelection(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#8B5CF6]/25 to-[#22D3EE]/25 border border-[#22D3EE]/60 text-white shadow-sm'
                        : 'bg-[#10111A] border border-white/5 text-[#999BAE] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{m.name}</span>
                    <span className="text-[10px] text-[#22D3EE]">({m.badge})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleStartComparison} className="space-y-3">
            <div>
              <label className="text-xs text-[#999BAE] block mb-1">Evaluation Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Enter prompt to execute across selected models..."
                className="w-full bg-[#10111A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-[#999BAE]/60 focus:outline-none focus:border-[#8B5CF6]/50 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isRunning || !prompt.trim() || selectedModelIds.length < 2}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 shadow-md"
              >
                {isRunning ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Executing Inference in Parallel...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Comparison</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Loading State */}
        {isRunning && (
          <div className="p-8 rounded-2xl bg-[#171925] border border-white/10 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center mx-auto">
              <Scale className="w-5 h-5 text-[#22D3EE] animate-pulse" />
            </div>
            <div className="font-semibold text-white text-sm">
              Broadcasting prompt across {selectedModelIds.length} model backends...
            </div>
            <p className="text-xs text-[#999BAE]">Measuring latency, token efficiency, and comparative response quality.</p>
          </div>
        )}

        {/* Side-by-side Response Columns */}
        {!isRunning && activeSession && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#999BAE] border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span>Prompt executed: "{activeSession.prompt.slice(0, 60)}..."</span>
                <span aria-hidden="true">·</span>
                <span>{new Date(activeSession.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-${Math.min(
                activeSession.responses.length,
                3
              )} gap-4`}
            >
              {activeSession.responses.map((resp) => (
                <div
                  key={resp.modelId}
                  className="rounded-2xl bg-[#171925] border border-white/10 flex flex-col overflow-hidden shadow-sm"
                >
                  {/* Column Header */}
                  <div className="p-4 border-b border-white/5 bg-[#10111A]/80 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{resp.modelName}</span>
                        <span className="text-[10px] text-[#22D3EE] font-mono">
                          VYORA AI
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#999BAE] mt-0.5">
                        <span className="flex items-center gap-0.5 text-emerald-400">
                          <Clock className="w-3 h-3" />
                          <span>{resp.latencyMs}ms</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{resp.tokens.input + resp.tokens.output} tokens</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyAnswer(resp.modelId, resp.content)}
                      aria-label="Copy answer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#999BAE] hover:text-white transition-colors"
                    >
                      {copiedId === resp.modelId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 text-xs text-[#F5F5FA] leading-relaxed overflow-y-auto max-h-[500px]">
                    {resp.status === 'error' ? (
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{resp.error || 'Model execution error'}</span>
                      </div>
                    ) : (
                      <MarkdownRenderer content={resp.content} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
