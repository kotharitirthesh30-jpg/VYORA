/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './lib/storage/store';
import {
  Conversation,
  ChatMessage,
  DocumentItem,
  MemoryItem,
  ResearchSession,
  ComparisonSession,
  UserSettings,
  UserProfile,
} from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ChatView } from './components/chat/ChatView';
import { ResearchView } from './components/research/ResearchView';
import { DocumentsView } from './components/documents/DocumentsView';
import { CompareView } from './components/compare/CompareView';
import { MemoryView } from './components/memory/MemoryView';
import { ModelsView } from './components/models/ModelsView';
import { SettingsView } from './components/settings/SettingsView';
import { LandingPage } from './components/marketing/LandingPage';
import { FeaturesPage } from './components/marketing/FeaturesPage';
import { PricingPage } from './components/marketing/PricingPage';
import { AuthModal } from './components/auth/AuthModal';
import { LegalModal } from './components/legal/LegalModal';
import { formatMemoryContext, findRelevantMemories } from './lib/memory/memory';
import { DEFAULT_MODEL_ID } from './lib/ai/models';
import { useAuth } from './lib/firebase/authContext';

export default function App() {
  // Navigation & View state
  const { userProfile: authProfile, updateLocalProfile } = useAuth();
  const [currentView, setCurrentView] = useState<string>('chat');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Core Data Entities from StorageService & Firebase Auth
  const [profile, setProfile] = useState<UserProfile>(authProfile || StorageService.getProfile());

  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
    }
  }, [authProfile]);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [conversations, setConversations] = useState<Conversation[]>(StorageService.getConversations());
  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [documents, setDocuments] = useState<DocumentItem[]>(StorageService.getDocuments());
  const [memories, setMemories] = useState<MemoryItem[]>(StorageService.getMemories());
  const [researchSessions, setResearchSessions] = useState<ResearchSession[]>(
    StorageService.getResearchSessions()
  );
  const [comparisonSessions, setComparisonSessions] = useState<ComparisonSession[]>(
    StorageService.getComparisonSessions()
  );

  // Active AI Model & Generation States
  const [selectedModelId, setSelectedModelId] = useState<string>(settings.defaultModel || DEFAULT_MODEL_ID);
  const [autoRouting, setAutoRouting] = useState<boolean>(settings.autoRouting);
  const [isGenerating, setIsGenerating] = useState(false);
  const [geminiConnected, setGeminiConnected] = useState(true);
  const [totalTokensUsed, setTotalTokensUsed] = useState<number>(1420);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  // Check backend server health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setGeminiConnected(data.geminiConfigured);
      })
      .catch(() => {
        setGeminiConnected(false);
      });
  }, []);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // Sync active conversation
  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ||
    conversations[0] || {
      id: 'conv-fallback',
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modelId: selectedModelId,
      autoRouting: true,
      messages: [],
    };

  // Conversation Management Handlers
  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modelId: selectedModelId,
      autoRouting: autoRouting,
      messages: [],
    };
    StorageService.upsertConversation(newConv);
    setConversations(StorageService.getConversations());
    setActiveConversationId(newConv.id);
  };

  const handleDeleteConversation = (id: string) => {
    StorageService.deleteConversation(id);
    const updated = StorageService.getConversations();
    setConversations(updated);
    if (activeConversationId === id) {
      if (updated.length > 0) {
        setActiveConversationId(updated[0].id);
      } else {
        handleNewConversation();
      }
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    const conv = StorageService.getConversation(id);
    if (conv) {
      conv.title = newTitle;
      conv.updatedAt = new Date().toISOString();
      StorageService.upsertConversation(conv);
      setConversations(StorageService.getConversations());
    }
  };

  // Send Message with Adaptive Routing, Search Grounding, and Memory (Streaming supported)
  const handleSendMessage = async (
    text: string,
    options: { webSearch: boolean; documentId?: string }
  ) => {
    if (!text.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Auto-update conversation title on first message
    let updatedTitle = activeConversation.title;
    if (activeConversation.messages.length === 0) {
      updatedTitle = text.length > 35 ? text.slice(0, 35) + '...' : text;
    }

    const updatedMessages = [...activeConversation.messages, userMessage];
    const currentConvId = activeConversation.id;

    // Format approved memory context if enabled
    let memoryContext = '';
    if (settings.memoryEnabled) {
      const relevantMems = findRelevantMemories(text, memories, 3);
      memoryContext = formatMemoryContext(relevantMems);
    }

    // Format document RAG context if linked
    let documentContext = '';
    if (options.documentId) {
      const doc = documents.find((d) => d.id === options.documentId);
      if (doc && doc.rawText) {
        documentContext = doc.rawText.slice(0, 8000);
      }
    }

    const assistantMsgId = `msg-${Date.now() + 1}`;
    let accumulatedContent = '';
    let citations: any[] = [];
    let modelUsed = 'vyora-neural-core';
    let taskCategory: any = 'GENERAL_CHAT';
    let routingDecision: any = undefined;
    let tokens: any = undefined;

    // Initial placeholder assistant message for immediate real-time response feedback
    const placeholderAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      modelUsed: 'vyora-neural-core',
    };

    const streamingConv: Conversation = {
      ...activeConversation,
      title: updatedTitle,
      messages: [...updatedMessages, placeholderAssistantMsg],
      updatedAt: new Date().toISOString(),
    };

    StorageService.upsertConversation(streamingConv);
    setConversations(StorageService.getConversations());

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: updatedMessages,
          modelId: selectedModelId,
          autoRoute: autoRouting,
          webSearch: options.webSearch || settings.webSearchDefault,
          stream: true,
          documentContext,
          memoryContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat API responded with status ${res.status}`);
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              try {
                const payload = JSON.parse(trimmed.slice(6));
                if (payload.type === 'chunk') {
                  accumulatedContent += payload.text;
                  setConversations((prev) =>
                    prev.map((c) => {
                      if (c.id !== currentConvId) return c;
                      const msgs = [...c.messages];
                      const lastMsg = msgs[msgs.length - 1];
                      if (lastMsg && lastMsg.id === assistantMsgId) {
                        lastMsg.content = accumulatedContent;
                      }
                      return { ...c, messages: msgs };
                    })
                  );
                } else if (payload.type === 'done') {
                  accumulatedContent = payload.content || accumulatedContent;
                  if (payload.citations) citations = payload.citations;
                  if (payload.modelUsed) modelUsed = payload.modelUsed;
                  if (payload.taskCategory) taskCategory = payload.taskCategory;
                  if (payload.routingDecision) routingDecision = payload.routingDecision;
                  if (payload.tokens) tokens = payload.tokens;
                }
              } catch {
                // Ignore parse errors on individual stream chunks
              }
            }
          }
        }
      } else {
        const data = await res.json();
        accumulatedContent = data.content || '';
        citations = data.citations || [];
        modelUsed = data.modelUsed || 'vyora-neural-core';
        taskCategory = data.taskCategory;
        routingDecision = data.routingDecision;
        tokens = data.tokens;
      }

      const finalAssistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: accumulatedContent || 'Response generated.',
        timestamp: new Date().toISOString(),
        modelUsed,
        taskCategory,
        routingDecision,
        citations,
        tokens,
      };

      const finalConv: Conversation = {
        ...streamingConv,
        messages: [...updatedMessages, finalAssistantMessage],
        updatedAt: new Date().toISOString(),
      };

      StorageService.upsertConversation(finalConv);
      setConversations(StorageService.getConversations());

      if (tokens) {
        setTotalTokensUsed((prev) => prev + (tokens.input + tokens.output));
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const stoppedMsg: ChatMessage = {
          id: assistantMsgId,
          role: 'assistant',
          content: accumulatedContent
            ? accumulatedContent + '\n\n*(Generation stopped by user)*'
            : '*(Generation stopped)*',
          timestamp: new Date().toISOString(),
          modelUsed,
        };
        const stoppedConv: Conversation = {
          ...streamingConv,
          messages: [...updatedMessages, stoppedMsg],
          updatedAt: new Date().toISOString(),
        };
        StorageService.upsertConversation(stoppedConv);
        setConversations(StorageService.getConversations());
        return;
      }

      console.error('Error generating chat message:', err);
      const errorMessage: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: `**VYORA Notice:** Could not complete request (${err.message || 'Network error'}). Please try again.`,
        timestamp: new Date().toISOString(),
        modelUsed: selectedModelId,
      };

      const finalConv: Conversation = {
        ...streamingConv,
        messages: [...updatedMessages, errorMessage],
        updatedAt: new Date().toISOString(),
      };
      StorageService.upsertConversation(finalConv);
      setConversations(StorageService.getConversations());
    } finally {
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  // Regenerate Response
  const handleRegenerateResponse = async (messageIndex: number) => {
    if (isGenerating || messageIndex < 1) return;
    const previousMessages = activeConversation.messages.slice(0, messageIndex);
    const lastUserMsg = previousMessages[previousMessages.length - 1];
    if (!lastUserMsg) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: previousMessages,
          modelId: selectedModelId,
          autoRoute: autoRouting,
          webSearch: settings.webSearchDefault,
        }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.content || 'Regenerated response.',
        timestamp: new Date().toISOString(),
        modelUsed: data.modelUsed,
        taskCategory: data.taskCategory,
        routingDecision: data.routingDecision,
        citations: data.citations || [],
        tokens: data.tokens,
      };

      const finalConv: Conversation = {
        ...activeConversation,
        messages: [...previousMessages, assistantMessage],
        updatedAt: new Date().toISOString(),
      };

      StorageService.upsertConversation(finalConv);
      setConversations(StorageService.getConversations());
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Web Research Execution
  const handleExecuteResearch = async (queryText: string): Promise<ResearchSession> => {
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryText }),
    });

    if (!res.ok) {
      throw new Error('Research query failed.');
    }

    const session: ResearchSession = await res.json();
    StorageService.saveResearchSession(session);
    setResearchSessions(StorageService.getResearchSessions());
    return session;
  };

  // Multi-Model Comparison Execution
  const handleRunComparison = async (
    prompt: string,
    modelIds: string[]
  ): Promise<ComparisonSession> => {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, modelIds }),
    });

    if (!res.ok) {
      throw new Error('Comparison failed.');
    }

    const session: ComparisonSession = await res.json();
    StorageService.saveComparisonSession(session);
    setComparisonSessions(StorageService.getComparisonSessions());
    return session;
  };

  // Document Ingestion & RAG
  const handleUploadDocument = async (
    title: string,
    rawText: string,
    fileType: 'pdf' | 'txt' | 'docx' | 'md'
  ) => {
    const res = await fetch('/api/documents/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, rawText, fileType }),
    });

    if (!res.ok) {
      throw new Error('Document processing failed.');
    }

    const processedDoc: DocumentItem = await res.json();
    processedDoc.rawText = rawText;
    StorageService.upsertDocument(processedDoc);
    setDocuments(StorageService.getDocuments());
  };

  const handleDeleteDocument = (id: string) => {
    StorageService.deleteDocument(id);
    setDocuments(StorageService.getDocuments());
  };

  const handleQueryDocument = async (question: string, documentId: string) => {
    const doc = documents.find((d) => d.id === documentId);
    if (!doc || !doc.chunks) {
      throw new Error('Document has no indexable chunks.');
    }

    const res = await fetch('/api/documents/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, chunks: doc.chunks }),
    });

    if (!res.ok) {
      throw new Error('Document query failed.');
    }

    return await res.json();
  };

  // Personal Memory Handlers
  const handleAddMemory = (
    content: string,
    category: MemoryItem['category'],
    approved: boolean
  ) => {
    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      content,
      category,
      approved,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.upsertMemory(newMem);
    setMemories(StorageService.getMemories());
  };

  const handleUpdateMemory = (
    id: string,
    content: string,
    category: MemoryItem['category'],
    approved: boolean
  ) => {
    const existing = memories.find((m) => m.id === id);
    if (existing) {
      existing.content = content;
      existing.category = category;
      existing.approved = approved;
      existing.updatedAt = new Date().toISOString();
      StorageService.upsertMemory(existing);
      setMemories(StorageService.getMemories());
    }
  };

  const handleDeleteMemory = (id: string) => {
    StorageService.deleteMemory(id);
    setMemories(StorageService.getMemories());
  };

  // Profile & Settings
  const handleSaveProfile = (newProfile: UserProfile) => {
    StorageService.saveProfile(newProfile);
    setProfile(newProfile);
    updateLocalProfile(newProfile);
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
    setSelectedModelId(newSettings.defaultModel);
    setAutoRouting(newSettings.autoRouting);
  };

  // Data Export & Purge
  const handleExportData = () => {
    const dataStr = StorageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VYORA_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const handlePurgeAllData = () => {
    StorageService.purgeAllData();
    setConversations(StorageService.getConversations());
    setDocuments(StorageService.getDocuments());
    setMemories(StorageService.getMemories());
    setResearchSessions([]);
    setComparisonSessions([]);
    setProfile(StorageService.getProfile());
    setSettings(StorageService.getSettings());
    setCurrentView('chat');
  };

  const isMarketing = currentView === 'landing' || currentView === 'features' || currentView === 'pricing';

  return (
    <div className={`bg-[#090A10] text-[#F5F5FA] font-sans ${isMarketing ? 'min-h-screen w-full overflow-y-auto' : 'flex h-screen w-screen overflow-hidden'}`}>
      {/* Marketing / Public Views */}
      {currentView === 'landing' && (
        <LandingPage
          onEnterApp={() => setCurrentView('chat')}
          onOpenFeatures={() => setCurrentView('features')}
          onOpenPricing={() => setCurrentView('pricing')}
          onOpenPrivacy={() => setLegalModalType('privacy')}
          onOpenTerms={() => setLegalModalType('terms')}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
      )}

      {currentView === 'features' && (
        <FeaturesPage
          onBack={() => setCurrentView('landing')}
          onEnterApp={() => setCurrentView('chat')}
        />
      )}

      {currentView === 'pricing' && (
        <PricingPage
          onBack={() => setCurrentView('landing')}
          onEnterApp={() => setCurrentView('chat')}
        />
      )}

      {/* Authenticated Workspace Application */}
      {currentView !== 'landing' && currentView !== 'features' && currentView !== 'pricing' && (
        <div className="flex w-full h-full">
          {/* Main Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => setActiveConversationId(id)}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
            isOpenMobile={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Main App Workspace Content Column */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <Navbar
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view)}
              selectedModelId={selectedModelId}
              onSelectModel={(mId) => setSelectedModelId(mId)}
              autoRouting={autoRouting}
              onToggleAutoRouting={() => setAutoRouting(!autoRouting)}
              userProfile={profile}
              settings={settings}
              onOpenAuth={() => setAuthModalOpen(true)}
              onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              geminiConnected={geminiConnected}
            />

            {/* Active Workspace View Switcher */}
            <main className="flex-1 overflow-hidden relative">
              {currentView === 'chat' && (
                <ChatView
                  conversation={activeConversation}
                  onSendMessage={handleSendMessage}
                  onRegenerateResponse={handleRegenerateResponse}
                  isGenerating={isGenerating}
                  onStopGeneration={handleStopGeneration}
                  documents={documents}
                  memories={memories}
                  autoRouting={autoRouting}
                  selectedModelId={selectedModelId}
                />
              )}

              {currentView === 'research' && (
                <ResearchView
                  onExecuteResearch={handleExecuteResearch}
                  sessions={researchSessions}
                />
              )}

              {currentView === 'documents' && (
                <DocumentsView
                  documents={documents}
                  onUploadDocument={handleUploadDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onQueryDocument={handleQueryDocument}
                />
              )}

              {currentView === 'compare' && (
                <CompareView
                  onRunComparison={handleRunComparison}
                  comparisonHistory={comparisonSessions}
                />
              )}

              {currentView === 'memory' && (
                <MemoryView
                  memories={memories}
                  onAddMemory={handleAddMemory}
                  onUpdateMemory={handleUpdateMemory}
                  onDeleteMemory={handleDeleteMemory}
                  settings={settings}
                  onToggleMemoryGlobal={(val) => handleSaveSettings({ ...settings, memoryEnabled: val })}
                />
              )}

              {currentView === 'models' && (
                <ModelsView
                  onSelectModelForChat={(mId) => {
                    setSelectedModelId(mId);
                    setAutoRouting(false);
                    setCurrentView('chat');
                  }}
                  geminiConnected={geminiConnected}
                />
              )}

              {(currentView === 'settings' || currentView === 'settings-privacy') && (
                <SettingsView
                  initialTab={currentView === 'settings-privacy' ? 'privacy' : 'preferences'}
                  profile={profile}
                  settings={settings}
                  onSaveProfile={handleSaveProfile}
                  onSaveSettings={handleSaveSettings}
                  onExportData={handleExportData}
                  onPurgeAllData={handlePurgeAllData}
                  totalTokensUsed={totalTokensUsed}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(newProfile) => {
          handleSaveProfile(newProfile);
          setCurrentView('chat');
        }}
      />

      {/* Legal & Terms Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
