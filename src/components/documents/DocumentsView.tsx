import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  Trash2,
  CheckCircle,
  Layers,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

interface DocumentsViewProps {
  documents: DocumentItem[];
  onUploadDocument: (title: string, rawText: string, fileType: 'pdf' | 'txt' | 'docx' | 'md') => Promise<void>;
  onDeleteDocument: (id: string) => void;
  onQueryDocument: (question: string, documentId: string) => Promise<{ answer: string; retrievedChunks: any[] }>;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onUploadDocument,
  onDeleteDocument,
  onQueryDocument,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // RAG query state
  const [ragQuestion, setRagQuestion] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [ragResult, setRagResult] = useState<{ answer: string; retrievedChunks: any[] } | null>(null);

  // Manual paste or file upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualText, setManualText] = useState('');

  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0] || null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'txt';
        const validExt: 'pdf' | 'txt' | 'docx' | 'md' =
          fileExt === 'pdf' || fileExt === 'docx' || fileExt === 'md' ? fileExt : 'txt';

        await onUploadDocument(file.name, text, validExt);
        setShowUploadModal(false);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to process document');
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read file from disk.');
      setIsUploading(false);
    };

    reader.readAsText(file);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualText.trim()) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      await onUploadDocument(manualTitle.trim(), manualText.trim(), 'txt');
      setManualTitle('');
      setManualText('');
      setShowUploadModal(false);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuestion.trim() || !currentDoc || isQuerying) return;

    setIsQuerying(true);
    try {
      const res = await onQueryDocument(ragQuestion.trim(), currentDoc.id);
      setRagResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#090A10] overflow-hidden">
      {/* Document Explorer Left Panel */}
      <div className="w-full md:w-72 border-r border-white/5 bg-[#10111A] p-4 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#8B5CF6]" />
            <span>Document Hub ({documents.length})</span>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-2.5 py-1 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto space-y-1.5">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#999BAE]">
              No documents yet. Ingest a document to enable RAG.
            </div>
          ) : (
            documents.map((doc) => {
              const isSelected = currentDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setRagResult(null);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#171925] border-[#8B5CF6]/40 text-white shadow-sm'
                      : 'bg-transparent border-white/5 text-[#999BAE] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-semibold line-clamp-1">{doc.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDocument(doc.id);
                      }}
                      aria-label={`Delete ${doc.title}`}
                      className="text-[#999BAE] hover:text-rose-400 p-0.5 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#999BAE]">
                    <span className="uppercase font-mono text-[#22D3EE]">{doc.fileType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.chunksCount} chunks</span>
                    <span aria-hidden="true">·</span>
                    <span>{Math.round(doc.fileSize / 1024)} KB</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Document Workspace Right Panel */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        {currentDoc ? (
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-semibold mb-1">
                  <FileCheck className="w-4 h-4" />
                  <span>RAG Grounding Workspace</span>
                </div>
                <h1 className="text-xl font-bold text-white truncate max-w-xl">{currentDoc.title}</h1>
                <div className="text-xs text-[#999BAE] mt-1 flex items-center gap-2">
                  <span>Uploaded {new Date(currentDoc.uploadedAt).toLocaleDateString()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentDoc.chunksCount} Semantic Chunks</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">Status: {currentDoc.status}</span>
                </div>
              </div>
            </div>

            {/* Document Executive Summary */}
            <div className="p-5 rounded-2xl bg-[#171925] border border-white/10 space-y-2">
              <div className="text-xs font-semibold text-[#22D3EE] flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Document Summary</span>
              </div>
              <div className="text-xs text-[#F5F5FA] leading-relaxed">
                <MarkdownRenderer content={currentDoc.summary} />
              </div>
            </div>

            {/* Interactive Document Q&A Panel */}
            <div className="p-5 rounded-2xl bg-[#171925] border border-white/10 space-y-4">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Semantic Passage Query (RAG)</span>
              </div>

              <form onSubmit={handleRunQuery} className="flex gap-2">
                <input
                  type="text"
                  value={ragQuestion}
                  onChange={(e) => setRagQuestion(e.target.value)}
                  placeholder="Ask a factual question about this document..."
                  className="flex-1 bg-[#10111A] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#999BAE]/60 focus:outline-none focus:border-[#8B5CF6]/50"
                />
                <button
                  type="submit"
                  disabled={!ragQuestion.trim() || isQuerying}
                  className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {isQuerying ? 'Retrieving...' : 'Ask Doc'}
                </button>
              </form>

              {/* RAG Query Result */}
              {ragResult && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <div className="p-4 rounded-xl bg-[#10111A] border border-[#22D3EE]/20 space-y-2">
                    <div className="text-xs font-semibold text-[#22D3EE]">Grounded Answer:</div>
                    <div className="text-xs text-[#F5F5FA]">
                      <MarkdownRenderer content={ragResult.answer} />
                    </div>
                  </div>

                  {/* Cited Passages */}
                  {ragResult.retrievedChunks?.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[#999BAE]">
                        Relevant Passages Identified ({ragResult.retrievedChunks.length}):
                      </div>
                      <div className="space-y-2">
                        {ragResult.retrievedChunks.map((tc: any, i: number) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg bg-[#10111A] border border-white/5 text-xs text-[#999BAE]"
                          >
                            <div className="flex items-center justify-between text-[11px] text-[#22D3EE] mb-1 font-mono">
                              <span>Passage {i + 1} (Chunk #{tc.chunkIndex})</span>
                              <span>Score: {tc.score ? tc.score.toFixed(2) : '0.95'}</span>
                            </div>
                            <p className="line-clamp-3 italic text-white/90">"{tc.content}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chunk Inspector */}
            {currentDoc.chunks && currentDoc.chunks.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#999BAE] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Semantic Chunks Inspector ({currentDoc.chunks.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentDoc.chunks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-3.5 rounded-xl bg-[#171925]/60 border border-white/5 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#999BAE]">
                        <span className="font-mono text-[#8B5CF6]">Chunk #{chk.chunkIndex}</span>
                        <span>{chk.tokenCount} estimated tokens</span>
                      </div>
                      <p className="text-[#F5F5FA] leading-relaxed text-xs">{chk.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <FileText className="w-12 h-12 text-[#999BAE] mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Document Selected</h3>
            <p className="text-xs text-[#999BAE] mb-4">
              Upload a PDF, TXT, or markdown file to index semantic embeddings and query it with RAG.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-xs font-semibold hover:bg-[#7C3AED]"
            >
              Upload Document Now
            </button>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171925] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="font-bold text-base text-white">Ingest New Document</div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#999BAE] hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Drag & drop or file browse input */}
            <div className="border-2 border-dashed border-white/10 hover:border-[#8B5CF6]/50 rounded-xl p-6 text-center transition-colors">
              <UploadCloud className="w-8 h-8 text-[#22D3EE] mx-auto mb-2" />
              <div className="text-xs font-semibold text-white mb-1">Select a file to upload</div>
              <p className="text-[11px] text-[#999BAE] mb-3">Supports .TXT, .MD, .PDF, .DOCX up to 10MB</p>
              <label className="px-3.5 py-1.5 rounded-lg bg-[#10111A] border border-white/10 text-xs font-medium text-white hover:bg-white/5 cursor-pointer">
                <span>Browse Files</span>
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="relative text-center text-xs text-[#999BAE]">
              <span className="bg-[#171925] px-2 z-10 relative">Or paste raw text</span>
              <div className="absolute inset-x-0 top-1/2 border-t border-white/5" />
            </div>

            {/* Manual text form */}
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#999BAE] block mb-1">Document Title</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Q4 Financial Roadmap"
                  className="w-full bg-[#10111A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-[#999BAE] block mb-1">Text Content</label>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste document text here..."
                  rows={4}
                  className="w-full bg-[#10111A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6] resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-[#999BAE] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-1.5 rounded-lg bg-[#8B5CF6] text-white text-xs font-semibold hover:bg-[#7C3AED]"
                >
                  {isUploading ? 'Chunking & Indexing...' : 'Process Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
