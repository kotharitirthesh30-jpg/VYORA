export type TaskCategory =
  | 'GENERAL_CHAT'
  | 'REASONING'
  | 'CODING'
  | 'WEB_RESEARCH'
  | 'DOCUMENT_ANALYSIS'
  | 'SUMMARIZATION'
  | 'WRITING'
  | 'COMPARISON'
  | 'DATA_ANALYSIS';

export type AIProviderId = 'google' | 'openai' | 'anthropic';

export interface ModelCapability {
  streaming: boolean;
  webSearch: boolean;
  vision: boolean;
  reasoning: boolean;
  maxContext: number;
  costPer1kInputTokens: number;
  costPer1kOutputTokens: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: AIProviderId;
  providerName: string;
  badge: string;
  description: string;
  strengths: string[];
  capabilities: ModelCapability;
  isAvailable: boolean;
  avgLatencyMs: number;
  recommendedFor: TaskCategory[];
}

export interface CitationSource {
  id: string;
  title: string;
  url: string;
  snippet?: string;
  index: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  taskCategory?: TaskCategory;
  citations?: CitationSource[];
  routingDecision?: {
    category: TaskCategory;
    reason: string;
    modelSelected: string;
    toolsUsed: string[];
  };
  tokens?: {
    input: number;
    output: number;
  };
  isStreaming?: boolean;
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  modelId: string;
  autoRouting: boolean;
  messages: ChatMessage[];
  pinned?: boolean;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  embedding?: number[];
  tokenCount: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  fileSize: number;
  fileType: 'pdf' | 'txt' | 'docx' | 'md';
  uploadedAt: string;
  chunksCount: number;
  summary: string;
  status: 'processing' | 'ready' | 'error';
  rawText?: string;
  chunks?: DocumentChunk[];
}

export interface MemoryItem {
  id: string;
  content: string;
  category: 'Preferences' | 'Projects' | 'Communication' | 'Context' | 'Custom';
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  snippet: string;
  sourceDomain: string;
  score?: number;
}

export interface ResearchSession {
  id: string;
  query: string;
  taskCategory: TaskCategory;
  createdAt: string;
  status: 'searching' | 'analyzing' | 'completed' | 'error';
  summaryAnswer: string;
  keyTakeaways: string[];
  sources: ResearchSource[];
  suggestedFollowUps: string[];
  modelUsed: string;
}

export interface ComparisonResponse {
  modelId: string;
  modelName: string;
  provider: AIProviderId;
  content: string;
  latencyMs: number;
  tokens: {
    input: number;
    output: number;
  };
  status: 'pending' | 'generating' | 'completed' | 'error';
  error?: string;
}

export interface ComparisonSession {
  id: string;
  prompt: string;
  timestamp: string;
  modelIds: string[];
  responses: ComparisonResponse[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface UserSettings {
  defaultProvider: AIProviderId;
  defaultModel: string;
  autoRouting: boolean;
  memoryEnabled: boolean;
  webSearchDefault: boolean;
  streamResponses: boolean;
  theme: 'dark' | 'light';
  openaiApiKey?: string;
  maxTokensPerRequest: number;
}

export interface UsageMetric {
  date: string;
  requestsCount: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  modelBreakdown: Record<string, number>;
}
