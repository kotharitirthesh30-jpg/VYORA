import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Globe,
  Sliders,
  Shield,
  User,
  LogOut,
  ExternalLink,
  Menu,
  Check,
  Cpu,
  LogIn,
} from 'lucide-react';
import { UserProfile, UserSettings } from '../../types';
import { useAuth } from '../../lib/firebase/authContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  autoRouting: boolean;
  onToggleAutoRouting: () => void;
  userProfile: UserProfile;
  settings: UserSettings;
  onOpenAuth: () => void;
  onToggleMobileSidebar: () => void;
  geminiConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  selectedModelId,
  onSelectModel,
  autoRouting,
  onToggleAutoRouting,
  userProfile,
  onOpenAuth,
  onToggleMobileSidebar,
  geminiConnected,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isGoogleAuthenticated, signOut, signInWithGoogle, isSigningIn } = useAuth();
  const [isNavbarSigningIn, setIsNavbarSigningIn] = useState(false);

  const handleGoogleQuickSignIn = async () => {
    if (isNavbarSigningIn || isSigningIn) return;
    setIsNavbarSigningIn(true);
    try {
      const res = await signInWithGoogle();
      if (res) {
        setUserMenuOpen(false);
      }
    } catch (e) {
      onOpenAuth();
    } finally {
      setIsNavbarSigningIn(false);
    }
  };

  return (
    <header className="h-14 border-b border-white/5 bg-[#10111A]/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
          className="md:hidden p-1.5 text-[#999BAE] hover:text-white rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* View Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#999BAE]">
          <span className="font-semibold text-white capitalize">{currentView.replace('-', ' ')}</span>
          <span aria-hidden="true">·</span>
          <span>Workspace</span>
        </div>

        {/* Proprietary VYORA AI Engine Badge & Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Proprietary Core Pill */}
          <div className="flex items-center gap-2 bg-[#171925] border border-white/10 rounded-lg px-2.5 py-1 text-xs shadow-sm">
            <div className="flex items-center gap-1.5 text-[#22D3EE] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>VYORA AI</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Neural Core Active</span>
            </div>
          </div>

          {/* Intelligence Mode Toggle */}
          <button
            onClick={onToggleAutoRouting}
            aria-label="Toggle AI Intelligence Mode"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
              autoRouting
                ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/40 shadow-sm'
                : 'bg-[#171925] text-[#999BAE] hover:text-white border-white/10'
            }`}
            title="Adaptive Neural Routing dynamically orchestrates deep logic, web intelligence, and high-speed synthesis"
          >
            <Cpu className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>{autoRouting ? 'Adaptive Reasoning' : 'Standard Core'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Engine Performance Specs */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#171925]/80 border border-white/5 text-[11px] text-[#999BAE]">
          <span className="text-[#22D3EE] font-mono text-[10px] font-semibold">1M Context</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#F5F5FA] font-medium">Proprietary AI Architecture</span>
        </div>

        {/* Public Landing Link */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-xs text-[#999BAE] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors hidden sm:block"
        >
          Landing Overview
        </button>

        {/* Quick Google Sign In button if not logged in */}
        {!isGoogleAuthenticated && (
          <button
            onClick={handleGoogleQuickSignIn}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-medium transition-colors"
            title="Sign in with Google to sync your AI chats and memories"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Login</span>
          </button>
        )}

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label="Open user profile menu"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6]"
          >
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-sm"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {userProfile.name.charAt(0)}
              </div>
            )}
            <span className="text-xs font-medium text-[#F5F5FA] hidden md:inline max-w-[110px] truncate">
              {userProfile.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#999BAE] hidden md:inline" />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-60 bg-[#171925] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 text-xs"
              role="menu"
            >
              <div className="px-3 py-2 border-b border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  {userProfile.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-xs font-bold text-white">
                      {userProfile.name.charAt(0)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="font-semibold text-white truncate">{userProfile.name}</div>
                    <div className="text-[11px] text-[#999BAE] truncate">{userProfile.email}</div>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-[#22D3EE] font-semibold uppercase tracking-wider">
                    {userProfile.plan} Tier
                  </span>
                  {isGoogleAuthenticated ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Google Connected
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#999BAE]">Local Profile</span>
                  )}
                </div>
              </div>

              {!isGoogleAuthenticated && (
                <div className="p-1 border-b border-white/5">
                  <button
                    onClick={handleGoogleQuickSignIn}
                    disabled={isNavbarSigningIn || isSigningIn}
                    className="w-full text-left px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <div className="flex-1">
                      <div className="font-semibold text-white">Sign In with Google</div>
                      <div className="text-[10px] text-[#999BAE]">Sync history & memories</div>
                    </div>
                  </button>
                </div>
              )}

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-[#999BAE] hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Preferences & Keys</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('models');
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-[#999BAE] hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Globe className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Model Registry</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('settings-privacy');
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-[#999BAE] hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy & Export</span>
                </button>
              </div>

              <div className="border-t border-white/5 pt-1 mt-1">
                {isGoogleAuthenticated ? (
                  <button
                    onClick={async () => {
                      await signOut();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out (Google)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[#22D3EE] hover:bg-[#22D3EE]/10 flex items-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>All Login Options</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
