import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Globe,
  FileText,
  Scale,
  Brain,
  Shield,
  Zap,
  Cpu,
  CheckCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenPricing: () => void;
  onOpenFeatures: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenPricing,
  onOpenFeatures,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAuth,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What is the VYORA Adaptive Intelligence Router?',
      a: 'The Adaptive Router parses query intent across 9 cognitive categories (such as Coding, STEM Reasoning, Web Research, Document Analysis, and Summarization) to dynamically dispatch the optimal model with the necessary external toolchains.',
    },
    {
      q: 'How does live Web Search Grounding work?',
      a: 'When an inquiry requires current real-time knowledge or fact verification, VYORA executes native Google Search grounding, filters and deduplicates sources, and generates answers complete with verified URL citations.',
    },
    {
      q: 'How are uploaded documents processed for RAG?',
      a: 'Uploaded files (.txt, .md, .pdf) are validated, chunked into semantic segments (250 tokens with 40-token overlap), and indexed for cosine similarity scoring, enabling precise factual retrieval without sending entire large documents into context.',
    },
    {
      q: 'What makes VYORA Personal Memory private and user-approved?',
      a: 'Unlike systems that silently guess and record user traits, VYORA requires explicit user confirmation before any memory item is committed. You can inspect, modify, categorize, or delete any memory item at will.',
    },
    {
      q: 'Can I compare multiple AI models simultaneously?',
      a: 'Yes. The Model Compare arena broadcasts a single prompt to 2 or 3 models simultaneously, allowing you to benchmark latency, token cost, and response quality side-by-side.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A10] text-[#F5F5FA] flex flex-col selection:bg-[#8B5CF6]/30">
      {/* Top Marketing Navigation */}
      <header className="h-16 border-b border-white/5 bg-[#090A10]/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between sticky top-0 z-40">
        <BrandLogo size="md" showTagline />

        <nav className="hidden md:flex items-center gap-6 text-xs text-[#999BAE]">
          <button onClick={onOpenFeatures} className="hover:text-white transition-colors">
            Features
          </button>
          <button onClick={onOpenPricing} className="hover:text-white transition-colors">
            Pricing
          </button>
          <button onClick={onOpenPrivacy} className="hover:text-white transition-colors">
            Security & Privacy
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="text-xs text-[#999BAE] hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onEnterApp}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9d71fa] hover:to-[#8B5CF6] text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center gap-1.5"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 lg:px-12 overflow-hidden flex flex-col items-center text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#22D3EE]/15 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#22D3EE]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-medium">The Next-Generation Connected AI Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Intelligence,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#22D3EE]">
              Connected.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#999BAE] max-w-2xl mx-auto leading-relaxed">
            VYORA dynamically routes your tasks to the optimal frontier model, retrieves verified live web citations, indexes your documents with semantic RAG, and remembers only what you explicitly approve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-95 text-white font-bold text-sm shadow-[0_4px_25px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenFeatures}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#171925] border border-white/10 hover:border-white/20 text-[#F5F5FA] font-semibold text-sm transition-colors"
            >
              Explore Capabilities
            </button>
          </div>
        </div>

        {/* Authentic Interface Mockup Showcase */}
        <div className="mt-14 max-w-5xl mx-auto w-full rounded-2xl bg-[#171925] border border-white/10 p-3 sm:p-5 shadow-2xl relative z-10 text-left">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 text-xs text-[#999BAE]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-white text-[11px]">vyora.workspace / adaptive-routing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#22D3EE]/10 text-[#22D3EE] font-mono text-[10px]">
                Gemini 3.8 Flash + Google Grounding
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Column 1: Multi-Model Intelligence */}
            <div className="p-4 rounded-xl bg-[#10111A] border border-white/5 space-y-2">
              <div className="text-[#8B5CF6] font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Multi-Model Engine</span>
              </div>
              <p className="text-[#999BAE] text-[11px] leading-relaxed">
                Connects Gemini 3.8 Flash, Gemini 4 Argon, and Flash Lite with automatic intent classification.
              </p>
            </div>

            {/* Column 2: Grounded Web Research */}
            <div className="p-4 rounded-xl bg-[#10111A] border border-white/5 space-y-2">
              <div className="text-[#22D3EE] font-bold flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>Real-Time Citations</span>
              </div>
              <p className="text-[#999BAE] text-[11px] leading-relaxed">
                Queries Google Search index live, attaching publisher domains and verifiable links with zero hallucination.
              </p>
            </div>

            {/* Column 3: Document RAG Intelligence */}
            <div className="p-4 rounded-xl bg-[#10111A] border border-white/5 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Document RAG Hub</span>
              </div>
              <p className="text-[#999BAE] text-[11px] leading-relaxed">
                Chunking, embeddings, and cosine similarity extraction for deep questions across large files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Engineered for Serious AI Workflows
          </h2>
          <p className="text-xs sm:text-sm text-[#999BAE] max-w-xl mx-auto">
            Six cohesive intelligence modules built to replace fragmented, single-model chatbots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              color: 'text-[#8B5CF6]',
              title: 'Adaptive Intelligence Router',
              desc: 'Analyzes prompt complexity and categorizes tasks across 9 cognitive domains to select the fastest or deepest model.',
            },
            {
              icon: Globe,
              color: 'text-[#22D3EE]',
              title: 'Investigative Web Research',
              desc: 'Grounded search queries across live internet indexes with provenance attribution and exportable research briefs.',
            },
            {
              icon: FileText,
              color: 'text-emerald-400',
              title: 'Document Intelligence & RAG',
              desc: 'Upload PDFs and TXT files. Inspect semantic chunks and query complex topics with exact passage attribution.',
            },
            {
              icon: Scale,
              color: 'text-[#8B5CF6]',
              title: 'Multi-Model Arena',
              desc: 'Simultaneously execute prompts across multiple frontier models to benchmark latency, accuracy, and formatting.',
            },
            {
              icon: Brain,
              color: 'text-[#22D3EE]',
              title: 'User-Approved Memory',
              desc: 'A user-controlled knowledge graph. No silent data capture—only memories you explicitly review and approve are injected.',
            },
            {
              icon: Shield,
              color: 'text-emerald-400',
              title: 'Zero-Retention Privacy',
              desc: 'One-click full workspace JSON export and irreversible local wipe. Your sensitive data stays under your control.',
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#171925] border border-white/10 hover:border-white/20 transition-all space-y-3 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-[#999BAE] leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 lg:px-12 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-[#999BAE]">Everything you need to know about VYORA's architecture.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#171925] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#999BAE] transition-transform ${
                      isOpen ? 'rotate-180 text-[#22D3EE]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#999BAE] leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 bg-[#10111A] py-8 px-6 lg:px-12 text-xs text-[#999BAE]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" showTagline />

          <div className="flex items-center gap-6">
            <button onClick={onOpenFeatures} className="hover:text-white transition-colors">
              Features
            </button>
            <button onClick={onOpenPricing} className="hover:text-white transition-colors">
              Pricing
            </button>
            <button onClick={onOpenPrivacy} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={onOpenTerms} className="hover:text-white transition-colors">
              Terms of Service
            </button>
          </div>

          <div>&copy; 2026 VYORA. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
