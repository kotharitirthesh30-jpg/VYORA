import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Search,
  Globe,
  Paperclip,
  RotateCcw,
  Copy,
  Check,
  Cpu,
  ExternalLink,
  ChevronRight,
  Info,
  Square,
  FileText,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Conversation, ChatMessage, DocumentItem, MemoryItem } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { MODEL_REGISTRY, getModelById } from '../../lib/ai/models';

interface ChatViewProps {
  conversation: Conversation;
  onSendMessage: (text: string, options: { webSearch: boolean; documentId?: string }) => Promise<void>;
  onRegenerateResponse: (messageIndex: number) => Promise<void>;
  isGenerating: boolean;
  onStopGeneration?: () => void;
  documents: DocumentItem[];
  memories: MemoryItem[];
  autoRouting: boolean;
  selectedModelId: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  onSendMessage,
  onRegenerateResponse,
  isGenerating,
  onStopGeneration,
  documents,
  memories,
  autoRouting,
  selectedModelId,
}) => {
  const [inputText, setInputText] = useState('');
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [expandedRationaleId, setExpandedRationaleId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, isGenerating]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isGenerating) return;

    const text = inputText.trim();
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await onSendMessage(text, {
      webSearch: webSearchEnabled,
      documentId: selectedDocId || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const activeModel = MODEL_REGISTRY.find((m) => m.id === selectedModelId) || MODEL_REGISTRY[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090A10] relative overflow-hidden">
      {/* Top Conversation Header bar */}
      <div className="h-11 border-b border-white/5 px-4 flex items-center justify-between text-xs text-[#999BAE] bg-[#10111A]/40 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2 truncate">
          <span className="font-medium text-[#F5F5FA] truncate max-w-sm sm:max-w-md">
            {conversation.title}
          </span>
          <span aria-hidden="true">·</span>
          <span>{conversation.messages.length} messages</span>
        </div>

        <div className="flex items-center gap-2">
          {selectedDocId && (
            <div className="flex items-center gap-1.5 text-xs text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded-md border border-[#22D3EE]/20">
              <FileCheck className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">
                {documents.find((d) => d.id === selectedDocId)?.title || 'Linked Doc'}
              </span>
            </div>
          )}
          <span className="hidden sm:inline text-[11px] text-[#999BAE]">
            {autoRouting ? '⚡ Adaptive Intelligence active' : '⚡ VYORA Core Engine active'}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-6">
        {conversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 py-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#22D3EE]/20 border border-white/10 flex items-center justify-center text-[#22D3EE] mb-4 shadow-lg">
              <Sparkles className="w-6 h-6 text-[#22D3EE]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Connect Your Intelligence</h2>
            <p className="text-xs text-[#999BAE] leading-relaxed mb-6">
              VYORA dynamically selects the optimal model, retrieves verified live web citations, and references your documents and approved memories.
            </p>

            {/* Quick Starter Cards */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {[
                {
                  label: 'Search Grounding',
                  desc: 'What are the latest AI breakthroughs announced this month?',
                  icon: Search,
                  web: true,
                },
                {
                  label: 'Architecture Reasoning',
                  desc: 'Compare monolithic vs microservices latency tradeoffs with a table.',
                  icon: Cpu,
                  web: false,
                },
                {
                  label: 'Document Analysis',
                  desc: 'Summarize the core specifications of the uploaded architecture doc.',
                  icon: FileText,
                  web: false,
                },
                {
                  label: 'Coding & Precision',
                  desc: 'Write a TypeScript generic LRU Cache with TTL expiration.',
                  icon: Sparkles,
                  web: false,
                },
              ].map((starter, i) => {
                const Icon = starter.icon;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setInputText(starter.desc);
                      setWebSearchEnabled(starter.web);
                      if (starter.label === 'Document Analysis' && documents.length > 0) {
                        setSelectedDocId(documents[0].id);
                      }
                    }}
                    className="p-3 rounded-lg bg-[#171925] border border-white/5 hover:border-white/20 text-xs transition-all text-left hover:bg-[#1a1c2c] group"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-white mb-1">
                      <Icon className="w-3.5 h-3.5 text-[#22D3EE]" />
                      <span>{starter.label}</span>
                    </div>
                    <div className="text-[11px] text-[#999BAE] line-clamp-2">
                      {starter.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          conversation.messages.map((message, index) => {
            const isUser = message.role === 'user';
            const isLatestAssistant =
              message.role === 'assistant' && index === conversation.messages.length - 1;

            return (
              <div
                key={message.id || index}
                className={`flex gap-3 max-w-4xl mx-auto ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#171925] to-[#10111A] border border-white/10 flex items-center justify-center shrink-0 text-[#22D3EE] shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                  </div>
                )}

                <div className={`flex flex-col space-y-2 max-w-[88%] sm:max-w-[80%]`}>
                  {/* Message Bubble Container */}
                  <div
                    className={`rounded-2xl px-4 py-3.5 text-sm transition-all ${
                      isUser
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-md rounded-br-sm'
                        : 'bg-[#171925] border border-white/10 text-[#F5F5FA] rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    ) : (
                      <>
                        <MarkdownRenderer content={message.content} />

                        {/* Verified Grounding Citations */}
                        {message.citations && message.citations.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE]">
                              <Globe className="w-3.5 h-3.5" />
                              <span>Verified Web Sources ({message.citations.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {message.citations.map((cite) => (
                                <a
                                  key={cite.id}
                                  href={cite.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#10111A] border border-white/10 hover:border-[#22D3EE]/50 text-[11px] text-[#999BAE] hover:text-white transition-colors group"
                                >
                                  <span className="font-mono text-[10px] text-[#22D3EE]">
                                    [{cite.index}]
                                  </span>
                                  <span className="truncate max-w-[150px]">{cite.title}</span>
                                  <ExternalLink className="w-3 h-3 text-[#999BAE] group-hover:text-[#22D3EE]" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Message Metadata & Action Bar */}
                  <div
                    className={`flex items-center gap-3 text-[11px] text-[#999BAE] px-1 ${
                      isUser ? 'justify-end' : 'justify-between'
                    }`}
                  >
                    {!isUser && message.routingDecision && (
                      <button
                        onClick={() =>
                          setExpandedRationaleId(
                            expandedRationaleId === message.id ? null : message.id
                          )
                        }
                        className="flex items-center gap-1 text-[11px] text-[#22D3EE] hover:underline"
                      >
                        <Info className="w-3 h-3" />
                        <span>Engine: {getModelById(message.modelUsed || 'vyora-neural-core').name}</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      {message.tokens && (
                        <span>
                          {message.tokens.input + message.tokens.output} tokens
                        </span>
                      )}

                      {!isUser && (
                        <>
                          <button
                            onClick={() => handleCopyMessage(message.id, message.content)}
                            aria-label="Copy assistant answer"
                            className="hover:text-white p-1 rounded transition-colors"
                          >
                            {copiedMsgId === message.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {isLatestAssistant && (
                            <button
                              onClick={() => onRegenerateResponse(index)}
                              aria-label="Regenerate response"
                              className="hover:text-white p-1 rounded transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Adaptive Routing Detail Drawer */}
                  {!isUser && expandedRationaleId === message.id && message.routingDecision && (
                    <div className="p-3 bg-[#10111A] border border-[#22D3EE]/20 rounded-xl text-xs space-y-1.5 text-[#999BAE]">
                      <div className="flex items-center justify-between text-white font-semibold">
                        <span>Intelligence Router Diagnostic</span>
                        <span className="text-[10px] text-[#8B5CF6]">
                          Category: {message.routingDecision.category}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {message.routingDecision.reason}
                      </p>
                      {message.routingDecision.toolsUsed.length > 0 && (
                        <div className="text-[10px] text-[#22D3EE]">
                          Tools executed: {message.routingDecision.toolsUsed.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Live Generation Indicator */}
        {isGenerating && (
          <div className="flex gap-3 max-w-4xl mx-auto justify-start">
            <div className="w-8 h-8 rounded-lg bg-[#171925] border border-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#22D3EE] animate-spin" />
            </div>
            <div className="bg-[#171925] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 text-xs text-[#999BAE] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
              <span>Generating response with VYORA Neural Core...</span>
              {onStopGeneration && (
                <button
                  onClick={onStopGeneration}
                  className="ml-3 px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded text-[11px] flex items-center gap-1"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 border-t border-white/5 bg-[#10111A]/90 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-2">
          {/* Controls strip */}
          <div className="flex items-center justify-between text-xs text-[#999BAE] px-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Web Search Toggle */}
              <button
                type="button"
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  webSearchEnabled
                    ? 'bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40'
                    : 'bg-[#171925] hover:text-white border border-white/5'
                }`}
                title="Enable live Google Search grounding for real-time citations"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Web Grounding</span>
              </button>

              {/* Document RAG Selector */}
              {documents.length > 0 && (
                <div className="flex items-center gap-1 bg-[#171925] border border-white/5 rounded-md px-2 py-1">
                  <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    className="bg-transparent text-xs text-[#F5F5FA] focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[200px] truncate"
                    aria-label="Select document for grounding"
                  >
                    <option value="" className="bg-[#171925] text-[#999BAE]">
                      No document linked
                    </option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id} className="bg-[#171925] text-white">
                        {doc.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <span className="text-[11px] text-[#999BAE] hidden sm:inline">
              Shift + Enter for newline
            </span>
          </div>

          {/* Textarea & Send button */}
          <div className="relative flex items-end bg-[#171925] border border-white/10 rounded-xl p-2 focus-within:border-[#8B5CF6]/50 transition-colors shadow-inner">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything, query documents, or research current events..."
              rows={1}
              className="w-full bg-transparent text-sm text-[#F5F5FA] placeholder-[#999BAE]/60 focus:outline-none resize-none px-2 py-1 max-h-44"
              aria-label="Message input"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              aria-label="Send message"
              className={`p-2 rounded-lg transition-all ml-2 ${
                inputText.trim() && !isGenerating
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-md hover:opacity-90'
                  : 'bg-white/5 text-[#999BAE] cursor-not-allowed opacity-50'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
