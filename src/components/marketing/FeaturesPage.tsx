import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Globe,
  FileText,
  Scale,
  Brain,
  Shield,
  Layers,
  Cpu,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

interface FeaturesPageProps {
  onBack: () => void;
  onEnterApp: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onBack, onEnterApp }) => {
  const pillars = [
    {
      title: '1. Adaptive Intelligence Router',
      subtitle: 'Dynamic Task Categorization & Model Dispatching',
      desc: 'Instead of forcing every question into a single expensive or slow model, VYORA uses an intent classification engine across 9 cognitive domains. Mathematical proofs and algorithm designs are assigned to Gemini 4 Argon, while real-time updates run on Gemini 3.8 Flash with native search grounding.',
      capabilities: [
        '9 distinct cognitive categories recognized automatically',
        'Transparent routing rationale attached to every message',
        'Automatic tool trigger detection (Google Search, RAG chunking)',
        'User preference override: lock to any model whenever desired',
      ],
      icon: Sparkles,
      color: 'text-[#8B5CF6]',
    },
    {
      title: '2. Grounded Web Research Engine',
      subtitle: 'Zero-Hallucination Real-Time Web Intelligence',
      desc: 'Unlike basic search plugins that return fragmented links, VYORA queries live Google Search grounding pipelines, extracts verified facts, deduplicates publisher domains, and constructs an analytical dossier with clickable URL citations.',
      capabilities: [
        'Live internet index queries via Gemini 3.8 Flash',
        'Inline superscript citations mapped to verifiable source cards',
        'Automated key takeaway bullet summaries',
        'Export research reports directly as Markdown dossiers',
      ],
      icon: Globe,
      color: 'text-[#22D3EE]',
    },
    {
      title: '3. Document Intelligence & Semantic RAG',
      subtitle: 'Vector-Indexed Question Answering Over Large Files',
      desc: 'Ingest PDFs, TXT, and markdown files up to 10MB. The engine breaks documents into 250-token semantic chunks with 40-token overlap, calculates cosine similarity retrieval scores, and delivers grounded answers citing specific passage chunks.',
      capabilities: [
        'Multi-format file upload and instant chunk inspector',
        'Automatic 2-paragraph executive summary generation',
        'Semantic passage ranking with relevance scoring',
        'Strict context boundary: zero hallucination outside uploaded passages',
      ],
      icon: FileText,
      color: 'text-emerald-400',
    },
    {
      title: '4. Multi-Model Comparison Arena',
      subtitle: 'Side-by-Side Inference Benchmarking',
      desc: 'Execute a single prompt across two or three models simultaneously. Evaluate response nuances, formatting variations, latency in milliseconds, and token efficiency in a side-by-side view.',
      capabilities: [
        'Simultaneous parallel API execution',
        'Exact round-trip millisecond latency timer',
        'Token consumption counters (input vs output)',
        'Independent copy and retry controls per model',
      ],
      icon: Scale,
      color: 'text-[#8B5CF6]',
    },
    {
      title: '5. Personal AI Memory System',
      subtitle: 'User-Approved Knowledge Graph & Preferences',
      desc: 'Most assistants either remember nothing or secretly track unverified facts. VYORA introduces a consent-first personal memory vault. Every fact requires explicit approval before being formatted into system instructions.',
      capabilities: [
        'Categorization: Preferences, Projects, Communication, Context',
        'Independent approval toggles per memory item',
        'One-click global pause or enable for all memories',
        'Guaranteed non-overriding: prompt instructions always take priority',
      ],
      icon: Brain,
      color: 'text-[#22D3EE]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A10] text-[#F5F5FA] flex flex-col">
      <header className="h-16 border-b border-white/5 bg-[#090A10]/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between sticky top-0 z-40">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#999BAE] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <BrandLogo size="md" />

        <button
          onClick={onEnterApp}
          className="px-4 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold"
        >
          Launch Workspace
        </button>
      </header>

      <main className="max-w-5xl mx-auto w-full py-12 px-6 space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Platform Architectural Features</h1>
          <p className="text-xs sm:text-sm text-[#999BAE] max-w-2xl mx-auto">
            A comprehensive breakdown of the five technical pillars powering the VYORA connected intelligence ecosystem.
          </p>
        </div>

        <div className="space-y-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-[#171925] border border-white/10 space-y-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-white/5 ${p.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{p.title}</h2>
                    <span className="text-xs text-[#22D3EE] font-medium">{p.subtitle}</span>
                  </div>
                </div>

                <p className="text-xs text-[#999BAE] leading-relaxed">{p.desc}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {p.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#F5F5FA]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#22D3EE] shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
