import React, { useState } from 'react';
import {
  Brain,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Shield,
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { MemoryItem, UserSettings } from '../../types';

interface MemoryViewProps {
  memories: MemoryItem[];
  onAddMemory: (content: string, category: MemoryItem['category'], approved: boolean) => void;
  onUpdateMemory: (id: string, content: string, category: MemoryItem['category'], approved: boolean) => void;
  onDeleteMemory: (id: string) => void;
  settings: UserSettings;
  onToggleMemoryGlobal: (enabled: boolean) => void;
}

export const MemoryView: React.FC<MemoryViewProps> = ({
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  settings,
  onToggleMemoryGlobal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);

  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<MemoryItem['category']>('Preferences');
  const [formApproved, setFormApproved] = useState(true);

  const categories = ['All', 'Preferences', 'Projects', 'Communication', 'Context', 'Custom'];

  const filteredMemories = memories.filter((m) =>
    selectedCategory === 'All' ? true : m.category === selectedCategory
  );

  const handleOpenAdd = () => {
    setEditingMemory(null);
    setFormContent('');
    setFormCategory('Preferences');
    setFormApproved(true);
    setShowAddModal(true);
  };

  const handleOpenEdit = (m: MemoryItem) => {
    setEditingMemory(m);
    setFormContent(m.content);
    setFormCategory(m.category);
    setFormApproved(m.approved);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim()) return;

    if (editingMemory) {
      onUpdateMemory(editingMemory.id, formContent.trim(), formCategory, formApproved);
    } else {
      onAddMemory(formContent.trim(), formCategory, formApproved);
    }
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090A10] overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-semibold uppercase tracking-wider mb-1">
              <Brain className="w-3.5 h-3.5" />
              <span>User-Approved Knowledge Vault</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Personal AI Memory</h1>
            <p className="text-xs text-[#999BAE] mt-1">
              VYORA only references facts, project guidelines, and preferences that you explicitly review and approve.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Memory Toggle */}
            <button
              onClick={() => onToggleMemoryGlobal(!settings.memoryEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                settings.memoryEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-[#999BAE]'
              }`}
            >
              <span>Memory {settings.memoryEnabled ? 'Enabled' : 'Paused'}</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Memory</span>
            </button>
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <div className="p-4 rounded-xl bg-[#171925] border border-white/10 flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
          <div className="text-xs text-[#999BAE] space-y-1">
            <span className="font-semibold text-white block">Strict User Consent Policy</span>
            <span>
              Memories are never silently saved from conversational guesses. Each memory item has an explicit approval switch and can be inspected, edited, or purged at any time.
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#171925] text-white border border-white/20'
                  : 'text-[#999BAE] hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Memory Items List */}
        <div className="grid grid-cols-1 gap-3">
          {filteredMemories.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#999BAE] bg-[#171925]/30 rounded-2xl border border-white/5">
              No memory items in this category. Click 'Add Memory' to create one.
            </div>
          ) : (
            filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-4 rounded-xl bg-[#171925] border border-white/10 flex items-start justify-between gap-4 transition-all hover:border-white/20"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-[#8B5CF6] font-semibold">[{mem.category}]</span>
                    <span aria-hidden="true" className="text-[#999BAE]">·</span>
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        mem.approved ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {mem.approved ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>{mem.approved ? 'User Approved' : 'Pending Review'}</span>
                    </span>
                    <span aria-hidden="true" className="text-[#999BAE]">·</span>
                    <span className="text-[#999BAE]">
                      Updated {new Date(mem.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F5FA] leading-relaxed font-normal">{mem.content}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(mem)}
                    aria-label="Edit memory"
                    className="p-1.5 text-[#999BAE] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteMemory(mem.id)}
                    aria-label="Delete memory"
                    className="p-1.5 text-[#999BAE] hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171925] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="font-bold text-base text-white">
                {editingMemory ? 'Edit Memory' : 'Add Approved Memory'}
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#999BAE] hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs text-[#999BAE] block mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-[#10111A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="Preferences">Preferences (Style, formatting, tone)</option>
                  <option value="Projects">Projects (Current architectural goals)</option>
                  <option value="Communication">Communication (Language, conciseness)</option>
                  <option value="Context">Context (Technical stack, conventions)</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#999BAE] block mb-1">Memory Content</label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="e.g. Always generate TypeScript examples with strict types."
                  rows={4}
                  className="w-full bg-[#10111A] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-[#999BAE]/60 focus:outline-none focus:border-[#8B5CF6] resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="approveMem"
                  checked={formApproved}
                  onChange={(e) => setFormApproved(e.target.checked)}
                  className="rounded border-white/10 bg-[#10111A] text-[#8B5CF6] focus:ring-0"
                />
                <label htmlFor="approveMem" className="text-xs text-[#F5F5FA] cursor-pointer">
                  Approved for AI prompt context injection
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-[#999BAE] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#8B5CF6] text-white text-xs font-semibold hover:bg-[#7C3AED]"
                >
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
