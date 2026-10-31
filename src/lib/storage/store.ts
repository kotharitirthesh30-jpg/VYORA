import {
  Conversation,
  DocumentItem,
  MemoryItem,
  ResearchSession,
  ComparisonSession,
  UserSettings,
  UserProfile,
} from '../../types';
import { chunkText } from '../documents/rag';

const STORAGE_KEYS = {
  CONVERSATIONS: 'vyora_conversations_v1',
  DOCUMENTS: 'vyora_documents_v1',
  MEMORIES: 'vyora_memories_v1',
  RESEARCH: 'vyora_research_v1',
  COMPARISONS: 'vyora_comparisons_v1',
  SETTINGS: 'vyora_settings_v1',
  PROFILE: 'vyora_profile_v1',
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-vyora-prime',
  name: 'Tirthesh Kothari',
  email: 'kotharitirthesh30@gmail.com',
  createdAt: '2026-10-31T00:00:00.000Z',
  plan: 'pro',
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  defaultProvider: 'google',
  defaultModel: 'vyora-neural-core',
  autoRouting: true,
  memoryEnabled: true,
  webSearchDefault: false,
  streamResponses: true,
  theme: 'dark',
  maxTokensPerRequest: 4096,
};

// Realistic initial demo seed data
const SEED_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    content: 'User prefers concise, production-ready TypeScript code with strict typing and no unnecessary boilerplate.',
    category: 'Preferences',
    approved: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'mem-2',
    content: 'Current core project is VYORA: an all-in-one multi-model AI assistant workspace featuring adaptive routing.',
    category: 'Projects',
    approved: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'mem-3',
    content: 'Format quantitative financial or benchmark data into markdown tables whenever comparing alternatives.',
    category: 'Communication',
    approved: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const SAMPLE_DOC_TEXT = `VYORA System Architecture Specification:
The VYORA Adaptive Intelligence Router evaluates incoming prompts across 9 distinct cognitive categories: GENERAL_CHAT, REASONING, CODING, WEB_RESEARCH, DOCUMENT_ANALYSIS, SUMMARIZATION, WRITING, COMPARISON, and DATA_ANALYSIS.
For high-throughput and live information tasks, it routes to VYORA Research Nexus, which integrates search grounding for verified web citations.
For deep mathematical proofs and algorithmic architecture, it routes to VYORA Deep Logic.
The Document Intelligence subsystem implements semantic chunking (250 tokens per chunk with 40-token overlap) and vector-indexed retrieval-augmented generation.
All user memories require explicit user confirmation before being committed to persistent storage.`;

const SEED_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-seed-1',
    title: 'VYORA_Architecture_Overview.txt',
    fileSize: 1024,
    fileType: 'txt',
    uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    chunksCount: 2,
    summary: 'Architectural specification of VYORA covering Adaptive Intelligence Routing, proprietary neural engines, and RAG document chunking.',
    status: 'ready',
    rawText: SAMPLE_DOC_TEXT,
    chunks: chunkText(SAMPLE_DOC_TEXT, 250, 40).map((c, i) => ({
      id: `chk-seed-${i}`,
      documentId: 'doc-seed-1',
      chunkIndex: c.chunkIndex,
      content: c.content,
      tokenCount: c.tokenCount,
    })),
  },
];

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-seed-1',
    title: 'Adaptive Routing & Multi-Model Architecture',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    modelId: 'vyora-neural-core',
    autoRouting: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Explain how the VYORA Adaptive Router selects the optimal model for research vs code.',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `### How VYORA Adaptive Intelligence Works

The **Adaptive Router** parses query intent, context, and required tooling:

| Task Type | Detected Intent | Selected Engine | Key Capability |
| :--- | :--- | :--- | :--- |
| **Web Research** | Fresh news, real-time lookups | **VYORA Research Nexus** | Live search grounding + verified source citations |
| **Algorithmic Coding** | Logic, debugging, TypeScript | **VYORA Deep Logic** | Multi-step mathematical deduction & strict typing |
| **Document Q&A** | Ingested PDF / TXT analysis | **VYORA Neural Core** | 1M token context window + semantic RAG chunking |
| **Summarization** | TL;DR, condensing long text | **VYORA Turbo Flash** | Sub-300ms first-token latency |

Every routing decision is transparently recorded and displayed in message metadata.`,
        timestamp: new Date(Date.now() - 3600000 * 4 + 2000).toISOString(),
        modelUsed: 'vyora-neural-core',
        taskCategory: 'REASONING',
        routingDecision: {
          category: 'REASONING',
          reason: 'Identified architectural inquiry; selected VYORA Neural Core for structured comparative breakdown.',
          modelSelected: 'vyora-neural-core',
          toolsUsed: [],
        },
        tokens: { input: 32, output: 215 },
      },
    ],
  },
];

export class StorageService {
  // Profiles
  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  }

  static saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // Settings
  static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_USER_SETTINGS, ...JSON.parse(data) } : DEFAULT_USER_SETTINGS;
    } catch {
      return DEFAULT_USER_SETTINGS;
    }
  }

  static saveSettings(settings: UserSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Conversations
  static getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(SEED_CONVERSATIONS));
        return SEED_CONVERSATIONS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_CONVERSATIONS;
    }
  }

  static saveConversations(conversations: Conversation[]): void {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }

  static getConversation(id: string): Conversation | undefined {
    return this.getConversations().find((c) => c.id === id);
  }

  static upsertConversation(conversation: Conversation): void {
    const list = this.getConversations();
    const index = list.findIndex((c) => c.id === conversation.id);
    if (index >= 0) {
      list[index] = conversation;
    } else {
      list.unshift(conversation);
    }
    this.saveConversations(list);
  }

  static deleteConversation(id: string): void {
    const list = this.getConversations().filter((c) => c.id !== id);
    this.saveConversations(list);
  }

  // Documents
  static getDocuments(): DocumentItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(SEED_DOCUMENTS));
        return SEED_DOCUMENTS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_DOCUMENTS;
    }
  }

  static saveDocuments(docs: DocumentItem[]): void {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  }

  static upsertDocument(doc: DocumentItem): void {
    const list = this.getDocuments();
    const index = list.findIndex((d) => d.id === doc.id);
    if (index >= 0) {
      list[index] = doc;
    } else {
      list.unshift(doc);
    }
    this.saveDocuments(list);
  }

  static deleteDocument(id: string): void {
    const list = this.getDocuments().filter((d) => d.id !== id);
    this.saveDocuments(list);
  }

  // Memories
  static getMemories(): MemoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(SEED_MEMORIES));
        return SEED_MEMORIES;
      }
      return JSON.parse(data);
    } catch {
      return SEED_MEMORIES;
    }
  }

  static saveMemories(mems: MemoryItem[]): void {
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(mems));
  }

  static upsertMemory(mem: MemoryItem): void {
    const list = this.getMemories();
    const index = list.findIndex((m) => m.id === mem.id);
    if (index >= 0) {
      list[index] = mem;
    } else {
      list.unshift(mem);
    }
    this.saveMemories(list);
  }

  static deleteMemory(id: string): void {
    const list = this.getMemories().filter((m) => m.id !== id);
    this.saveMemories(list);
  }

  // Research Sessions
  static getResearchSessions(): ResearchSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESEARCH);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveResearchSession(session: ResearchSession): void {
    const list = this.getResearchSessions();
    list.unshift(session);
    localStorage.setItem(STORAGE_KEYS.RESEARCH, JSON.stringify(list.slice(0, 50)));
  }

  // Comparison Sessions
  static getComparisonSessions(): ComparisonSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPARISONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveComparisonSession(session: ComparisonSession): void {
    const list = this.getComparisonSessions();
    list.unshift(session);
    localStorage.setItem(STORAGE_KEYS.COMPARISONS, JSON.stringify(list.slice(0, 50)));
  }

  // Data Export & Purge
  static exportAllData(): string {
    const dump = {
      profile: this.getProfile(),
      settings: this.getSettings(),
      conversations: this.getConversations(),
      documents: this.getDocuments(),
      memories: this.getMemories(),
      research: this.getResearchSessions(),
      comparisons: this.getComparisonSessions(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(dump, null, 2);
  }

  static purgeAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }
}
