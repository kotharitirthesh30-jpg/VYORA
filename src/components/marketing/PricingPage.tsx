import React from 'react';
import { ArrowLeft, Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

interface PricingPageProps {
  onBack: () => void;
  onEnterApp: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBack, onEnterApp }) => {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Essential multi-model AI assistant workspace for personal productivity.',
      features: [
        'Access to Gemini 3.8 Flash & Flash Lite',
        'Adaptive Intelligence Routing (Standard)',
        'Up to 10 web research investigations/day',
        '3 documents for semantic RAG indexing',
        '25 approved personal memories',
        'Full JSON workspace export',
      ],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Pro Workspace',
      price: '$20',
      period: 'per month',
      description: 'For engineers, researchers, and creators demanding frontier models and deep RAG.',
      features: [
        'Unlimited Gemini 3.8 Flash & Gemini 4 Argon',
        'Full Google Search Grounding with verified URL citations',
        'Multi-Model Arena side-by-side comparison',
        'Unlimited document uploads & semantic chunking',
        'Unlimited user-approved memories',
        'Priority low-latency server-side dispatching',
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      name: 'Enterprise / BYOK',
      price: 'Custom',
      period: 'or Bring-Your-Own-Key',
      description: 'Zero markup on model tokens with dedicated security boundaries and team workspaces.',
      features: [
        'Direct API Key injection (Google AI Studio & OpenAI)',
        'Custom vector embeddings & private pgvector database',
        'Role-based access control (RBAC) & audit logs',
        'SLA guaranteed uptime & zero data retention compliance',
        'Dedicated deployment on Cloud Run or Supabase',
      ],
      cta: 'Deploy Enterprise',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A10] text-[#F5F5FA] flex flex-col">
      <header className="h-16 border-b border-white/5 bg-[#090A10]/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between sticky top-0 z-40">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#999BAE] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <BrandLogo size="md" />

        <button
          onClick={onEnterApp}
          className="px-4 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold"
        >
          Launch Workspace
        </button>
      </header>

      <main className="max-w-5xl mx-auto w-full py-16 px-6 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#22D3EE]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent, Utility-Based Plans</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Simple, Predictable Pricing</h1>
          <p className="text-xs sm:text-sm text-[#999BAE] max-w-xl mx-auto">
            Choose the plan that suits your research, coding, and multi-model workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                p.highlighted
                  ? 'bg-[#171925] border-2 border-[#8B5CF6] shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                  : 'bg-[#171925]/70 border border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white">{p.name}</h2>
                  {p.highlighted && (
                    <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="my-4">
                  <span className="text-3xl font-extrabold text-white font-mono">{p.price}</span>
                  <span className="text-xs text-[#999BAE] ml-1.5">/ {p.period}</span>
                </div>

                <p className="text-xs text-[#999BAE] leading-relaxed mb-6">{p.description}</p>

                <div className="space-y-3 border-t border-white/5 pt-6">
                  {p.features.map((feat, fi) => (
                    <div key={fi} className="flex items-start gap-2.5 text-xs text-[#F5F5FA]">
                      <Check className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={onEnterApp}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    p.highlighted
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:opacity-90 shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
