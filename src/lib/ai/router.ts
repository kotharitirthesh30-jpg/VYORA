import type { TaskCategory } from '../../types/index.ts';
import { MODEL_REGISTRY, DEFAULT_MODEL_ID } from './models.ts';

export interface RoutingDecision {
  category: TaskCategory;
  selectedModelId: string;
  reason: string;
  toolsNeeded: string[];
}

export function classifyTask(
  prompt: string,
  context?: { hasDocuments?: boolean; webSearchRequested?: boolean }
): TaskCategory {
  const p = prompt.trim().toLowerCase();

  // Explicit research triggers
  if (
    context?.webSearchRequested ||
    /\b(search the web|latest news|current price|who won|today|recent update|sources for|lookup online|find articles|research on)\b/i.test(p)
  ) {
    return 'WEB_RESEARCH';
  }

  // Document analysis triggers
  if (
    context?.hasDocuments ||
    /\b(in the document|according to the pdf|summarize the attached|document says|page \d+|cite the passage)\b/i.test(p)
  ) {
    return 'DOCUMENT_ANALYSIS';
  }

  // Coding triggers
  if (
    /\b(function|typescript|javascript|python|react|sql|bug|stack trace|refactor|compile error|algorithm|regex|dockerfile|git commit|class \w+|interface \w+|import .* from)\b/i.test(p) ||
    prompt.includes('```')
  ) {
    return 'CODING';
  }

  // Deep Reasoning & STEM triggers
  if (
    /\b(derive|proof|theorem|physics|quantum|calculate mathematically|solve the riddle|step by step deduction|logic puzzle|chain of thought|evaluate the probability)\b/i.test(p)
  ) {
    return 'REASONING';
  }

  // Summarization triggers
  if (
    /\b(summarize|tldr|key takeaways|executive summary|bullet points of this|brief overview|condense)\b/i.test(p)
  ) {
    return 'SUMMARIZATION';
  }

  // Comparison triggers
  if (
    /\b(compare|versus|vs\.|pros and cons|difference between|benchmark|tradeoffs|which is better)\b/i.test(p)
  ) {
    return 'COMPARISON';
  }

  // Data Analysis triggers
  if (
    /\b(dataset|csv|metrics|median|standard deviation|correlation|data analysis|trend analysis|table format)\b/i.test(p)
  ) {
    return 'DATA_ANALYSIS';
  }

  // Long-form Writing triggers
  if (
    /\b(write an essay|draft an email|cover letter|blog post|creative story|poem|rewrite in a formal tone)\b/i.test(p)
  ) {
    return 'WRITING';
  }

  return 'GENERAL_CHAT';
}

export function routePrompt(
  prompt: string,
  options: {
    manualModelId?: string;
    autoRoute?: boolean;
    hasDocuments?: boolean;
    webSearchRequested?: boolean;
  } = {}
): RoutingDecision {
  const category = classifyTask(prompt, {
    hasDocuments: options.hasDocuments,
    webSearchRequested: options.webSearchRequested,
  });

  const toolsNeeded: string[] = [];
  if (category === 'WEB_RESEARCH' || options.webSearchRequested) {
    toolsNeeded.push('web_search');
  }
  if (category === 'DOCUMENT_ANALYSIS' || options.hasDocuments) {
    toolsNeeded.push('document_rag');
  }

  // If autoRoute is disabled or a valid manual model is selected, respect user preference
  if (options.autoRoute === false && options.manualModelId) {
    const manualModel = MODEL_REGISTRY.find((m) => m.id === options.manualModelId);
    if (manualModel) {
      return {
        category,
        selectedModelId: manualModel.id,
        reason: `Using ${manualModel.name} for ${category.replace('_', ' ')}.`,
        toolsNeeded,
      };
    }
  }

  // Adaptive routing logic across VYORA model family
  switch (category) {
    case 'WEB_RESEARCH':
      return {
        category,
        selectedModelId: 'vyora-research-nexus',
        reason: 'Selected VYORA Research Nexus for live grounded search and verified source citations.',
        toolsNeeded,
      };

    case 'REASONING':
      return {
        category,
        selectedModelId: 'vyora-deep-logic',
        reason: 'Selected VYORA Deep Logic for multi-step reasoning, mathematical deduction, and deep logic analysis.',
        toolsNeeded,
      };

    case 'CODING':
      return {
        category,
        selectedModelId: 'vyora-deep-logic',
        reason: 'Selected VYORA Deep Logic for algorithmic precision, code generation, and strict typing.',
        toolsNeeded,
      };

    case 'DOCUMENT_ANALYSIS':
      return {
        category,
        selectedModelId: 'vyora-neural-core',
        reason: 'Selected VYORA Neural Core for large context document ingestion, passage retrieval, and grounded semantic synthesis.',
        toolsNeeded,
      };

    case 'SUMMARIZATION':
      return {
        category,
        selectedModelId: 'vyora-turbo-flash',
        reason: 'Selected VYORA Turbo Flash for high-speed summarization and concise takeaways.',
        toolsNeeded,
      };

    case 'COMPARISON':
      return {
        category,
        selectedModelId: 'vyora-neural-core',
        reason: 'Selected VYORA Neural Core for balanced multi-perspective comparison tables.',
        toolsNeeded,
      };

    case 'WRITING':
      return {
        category,
        selectedModelId: 'vyora-omni',
        reason: 'Selected VYORA Omni Mind for creative nuance, engaging tone, and expressive writing.',
        toolsNeeded,
      };

    case 'DATA_ANALYSIS':
    case 'GENERAL_CHAT':
    default:
      return {
        category,
        selectedModelId: DEFAULT_MODEL_ID,
        reason: 'Selected VYORA Neural Core for balanced conversational intelligence, responsiveness, and depth.',
        toolsNeeded,
      };
  }
}
