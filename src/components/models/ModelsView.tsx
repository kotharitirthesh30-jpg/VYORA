import React from 'react';
import {
  Cpu,
  Globe,
  Zap,
  CheckCircle,
  Eye,
  Brain,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { MODEL_REGISTRY } from '../../lib/ai/models';
import { AIModel } from '../../types';

interface ModelsViewProps {
  onSelectModelForChat: (modelId: string) => void;
  geminiConnected: boolean;
}

export const ModelsView: React.FC<ModelsViewProps> = ({
  onSelectModelForChat,
  geminiConnected,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#090A10] overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs text-[#22D3EE] font-semibold uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Proprietary Neural Architecture</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">VYORA Neural Engine Matrix</h1>
          <p className="text-xs text-[#999BAE] mt-1">
            Internal cognitive subsystems, context windows, benchmark latency, and adaptive routing assignments.
          </p>
        </div>

        {/* Global Provider Health Bar */}
        <div className="p-4 rounded-xl bg-[#171925] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-white">
                VYORA Neural Infrastructure: Operational
              </div>
              <div className="text-[11px] text-[#999BAE]">
                High-throughput inference, semantic vector embeddings, and real-time reasoning active.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#22D3EE] font-mono">
            {MODEL_REGISTRY.length} Specialized Engines
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODEL_REGISTRY.map((model) => (
            <div
              key={model.id}
              className="p-5 rounded-2xl bg-[#171925] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{model.name}</span>
                      <span className="text-[10px] text-[#8B5CF6] font-normal uppercase tracking-wider">
                        {model.providerName}
                      </span>
                    </h2>
                    <span className="text-[11px] text-[#22D3EE] font-medium">{model.badge}</span>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Online</span>
                  </span>
                </div>

                <p className="text-xs text-[#999BAE] leading-relaxed mb-4">{model.description}</p>

                {/* Metrics row */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#10111A] p-2.5 rounded-xl border border-white/5 mb-4">
                  <div>
                    <span className="text-[#999BAE] block">Max Context</span>
                    <span className="font-semibold text-white font-mono">
                      {(model.capabilities.maxContext / 1024).toLocaleString()}k tokens
                    </span>
                  </div>
                  <div>
                    <span className="text-[#999BAE] block">Avg Response</span>
                    <span className="font-semibold text-white font-mono">
                      ~{model.avgLatencyMs}ms
                    </span>
                  </div>
                </div>

                {/* Capabilities pills */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold text-[#999BAE] uppercase tracking-wider">
                    Core Capabilities
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {model.capabilities.webSearch && (
                      <span className="flex items-center gap-1 text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/20">
                        <Search className="w-3 h-3" />
                        <span>Search Grounding</span>
                      </span>
                    )}
                    {model.capabilities.reasoning && (
                      <span className="flex items-center gap-1 text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded border border-[#8B5CF6]/20">
                        <Brain className="w-3 h-3" />
                        <span>Advanced Reasoning</span>
                      </span>
                    )}
                    {model.capabilities.vision && (
                      <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                        <Eye className="w-3 h-3" />
                        <span>Multimodal Vision</span>
                      </span>
                    )}
                    {model.capabilities.streaming && (
                      <span className="flex items-center gap-1 text-white/80 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        <Zap className="w-3 h-3" />
                        <span>Streaming SSE</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Recommended For */}
                <div className="mt-3">
                  <div className="text-[10px] font-semibold text-[#999BAE] uppercase tracking-wider mb-1">
                    Adaptive Routing Assignment
                  </div>
                  <div className="text-xs text-[#999BAE]">
                    {model.recommendedFor.map((rf) => rf.replace('_', ' ')).join(' · ')}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-white/5">
                <button
                  onClick={() => onSelectModelForChat(model.id)}
                  className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Chat With {model.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
