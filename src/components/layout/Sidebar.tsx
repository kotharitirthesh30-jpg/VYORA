import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  FileText,
  Scale,
  Brain,
  Cpu,
  Settings,
  Plus,
  Trash2,
  Edit2,
  X,
  Compass,
  Check,
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { Conversation } from '../../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const navItems = [
    { id: 'chat', label: 'Conversations', icon: MessageSquare },
    { id: 'research', label: 'Web Research', icon: Search },
    { id: 'documents', label: 'Documents & RAG', icon: FileText },
    { id: 'compare', label: 'Neural Compare', icon: Scale },
    { id: 'memory', label: 'Personal Memory', icon: Brain },
    { id: 'models', label: 'AI Architecture', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#10111A] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <button
            onClick={() => {
              onNavigate('landing');
              onCloseMobile();
            }}
            className="text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6] rounded-lg"
          >
            <BrandLogo size="md" showTagline />
          </button>
          <button
            onClick={onCloseMobile}
            aria-label="Close navigation sidebar"
            className="md:hidden p-1.5 text-[#999BAE] hover:text-white rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action: New Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewConversation();
              onNavigate('chat');
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9d71fa] hover:to-[#8B5CF6] text-white font-semibold text-xs transition-all shadow-[0_2px_12px_rgba(139,92,246,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Main Workspaces Navigation */}
        <div className="px-3 py-1 space-y-0.5">
          <div className="text-[10px] font-semibold text-[#999BAE] uppercase tracking-wider px-2 py-1">
            Core Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#171925] text-white border border-white/10 font-semibold'
                    : 'text-[#999BAE] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#22D3EE]' : 'text-[#999BAE]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Recent Conversations List */}
        <div className="flex-1 overflow-hidden flex flex-col mt-3 border-t border-white/5 pt-3">
          <div className="px-3 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#999BAE] uppercase tracking-wider">
              Recent Threads
            </span>
            <span className="text-[10px] text-[#999BAE]">
              {conversations.length}
            </span>
          </div>

          {/* Quick filter input */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#999BAE] absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#171925] border border-white/5 rounded-md pl-8 pr-2.5 py-1 text-[11px] text-[#F5F5FA] placeholder-[#999BAE]/60 focus:outline-none focus:border-[#8B5CF6]/50"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-6 px-3 text-xs text-[#999BAE]">
                No threads found
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive =
                  currentView === 'chat' && activeConversationId === conv.id;
                const isEditing = editingId === conv.id;

                return (
                  <div
                    key={conv.id}
                    className={`group relative rounded-lg text-xs transition-colors flex items-center justify-between px-2.5 py-2 ${
                      isActive
                        ? 'bg-[#171925] text-white border border-white/10'
                        : 'text-[#999BAE] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-1 w-full">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename(conv.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="flex-1 bg-[#10111A] border border-[#8B5CF6] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveRename(conv.id)}
                          aria-label="Save title"
                          className="p-1 text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            onSelectConversation(conv.id);
                            onNavigate('chat');
                            onCloseMobile();
                          }}
                          className="text-left flex-1 truncate pr-2"
                        >
                          <span className="truncate block">{conv.title}</span>
                        </button>

                        {/* Thread Action Buttons */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(conv);
                            }}
                            aria-label={`Rename conversation ${conv.title}`}
                            className="p-1 hover:text-white text-[#999BAE] transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conv.id);
                            }}
                            aria-label={`Delete conversation ${conv.title}`}
                            className="p-1 hover:text-rose-400 text-[#999BAE] transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Link to Landing Page & Public Features */}
        <div className="p-3 border-t border-white/5 bg-[#090A10]/50">
          <button
            onClick={() => {
              onNavigate('landing');
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-[#999BAE] hover:text-[#22D3EE] transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Product Showcase & FAQ</span>
          </button>
        </div>
      </aside>
    </>
  );
};
