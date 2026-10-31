import React, { useState } from 'react';
import {
  Settings,
  User,
  Sliders,
  Shield,
  BarChart3,
  Download,
  Trash2,
  Check,
  AlertTriangle,
  Sparkles,
  Cpu,
  Key,
} from 'lucide-react';
import { UserProfile, UserSettings } from '../../types';
import { MODEL_REGISTRY } from '../../lib/ai/models';
import { useAuth } from '../../lib/firebase/authContext';

interface SettingsViewProps {
  initialTab?: 'profile' | 'preferences' | 'privacy' | 'usage';
  profile: UserProfile;
  settings: UserSettings;
  onSaveProfile: (profile: UserProfile) => void;
  onSaveSettings: (settings: UserSettings) => void;
  onExportData: () => void;
  onPurgeAllData: () => void;
  totalTokensUsed: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  initialTab = 'preferences',
  profile,
  settings,
  onSaveProfile,
  onSaveSettings,
  onExportData,
  onPurgeAllData,
  totalTokensUsed,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'privacy' | 'usage'>(
    initialTab
  );
  const { user, isGoogleAuthenticated, signInWithGoogle, signOut, isSigningIn } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  // Form states
  const [profileName, setProfileName] = useState(profile.name);
  const [profileEmail, setProfileEmail] = useState(profile.email);
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync with profile prop updates
  React.useEffect(() => {
    setProfileName(profile.name);
    setProfileEmail(profile.email);
  }, [profile]);

  // AI Preferences state
  const [localSettings, setLocalSettings] = useState<UserSettings>({ ...settings });

  // Privacy confirm modal
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: profileName.trim(),
      email: profileEmail.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSettingChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    onSaveSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090A10] overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-semibold uppercase tracking-wider mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Workspace Controls</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Platform Settings</h1>
          <p className="text-xs text-[#999BAE] mt-1">
            Configure default model routing, manage approved memory parameters, and control privacy data.
          </p>
        </div>

        {/* Saved Toast Notification */}
        {savedNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>Settings successfully updated and saved locally.</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-[#171925] rounded-xl border border-white/5 text-xs">
          {[
            { id: 'preferences', label: 'AI Preferences', icon: Sliders },
            { id: 'profile', label: 'User Profile', icon: User },
            { id: 'privacy', label: 'Privacy & Data', icon: Shield },
            { id: 'usage', label: 'Usage & Costs', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-[#10111A] text-white border border-white/10 shadow-sm'
                    : 'text-[#999BAE] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#22D3EE]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: AI PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="p-6 rounded-2xl bg-[#171925] border border-white/10 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <div className="text-sm font-bold text-white">Adaptive Intelligence Routing</div>
                  <div className="text-xs text-[#999BAE]">
                    Dynamically optimize prompts between VYORA Neural Core, Deep Logic, and Research Nexus.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.autoRouting}
                  onChange={(e) => handleSettingChange('autoRouting', e.target.checked)}
                  className="rounded bg-[#10111A] border-white/10 text-[#8B5CF6] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <div className="text-sm font-bold text-white">Default Baseline Engine</div>
                  <div className="text-xs text-[#999BAE]">
                    Fallback engine when standard conversation is initiated.
                  </div>
                </div>
                <select
                  value={localSettings.defaultModel}
                  onChange={(e) => handleSettingChange('defaultModel', e.target.value)}
                  className="bg-[#10111A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                >
                  {MODEL_REGISTRY.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.providerName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <div className="text-sm font-bold text-white">Stream AI Responses</div>
                  <div className="text-xs text-[#999BAE]">
                    Stream characters sequentially in real-time as they are synthesized.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.streamResponses}
                  onChange={(e) => handleSettingChange('streamResponses', e.target.checked)}
                  className="rounded bg-[#10111A] border-white/10 text-[#8B5CF6] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <div className="text-sm font-bold text-white">Personal Memory Injection</div>
                  <div className="text-xs text-[#999BAE]">
                    Pass approved facts and user preferences into system instructions.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.memoryEnabled}
                  onChange={(e) => handleSettingChange('memoryEnabled', e.target.checked)}
                  className="rounded bg-[#10111A] border-white/10 text-[#8B5CF6] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Web Search Grounding by Default</div>
                  <div className="text-xs text-[#999BAE]">
                    Always attach Google Search grounding tools to incoming conversations.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.webSearchDefault}
                  onChange={(e) => handleSettingChange('webSearchDefault', e.target.checked)}
                  className="rounded bg-[#10111A] border-white/10 text-[#8B5CF6] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-6 rounded-2xl bg-[#171925] border border-white/10 space-y-6">
            {/* Google Authentication Status Card */}
            <div className="p-4 rounded-xl bg-[#10111A] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-lg font-bold text-white shadow-md">
                    {profile.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{profile.name}</h3>
                    {isGoogleAuthenticated ? (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                        Google Verified
                      </span>
                    ) : (
                      <span className="text-[10px] bg-white/5 text-[#999BAE] border border-white/10 px-2 py-0.5 rounded-full font-medium">
                        Local Profile
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#999BAE] mt-0.5">{profile.email}</p>
                  <p className="text-[11px] text-[#22D3EE] font-mono mt-0.5">
                    ID: {profile.id.slice(0, 16)}...
                  </p>
                </div>
              </div>

              <div>
                {isGoogleAuthenticated ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={googleLoading || isSigningIn}
                    onClick={async () => {
                      if (googleLoading || isSigningIn) return;
                      setGoogleLoading(true);
                      try {
                        await signInWithGoogle();
                      } catch (e) {
                        console.warn('Google sign in result:', e);
                      } finally {
                        setGoogleLoading(false);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
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
                    <span>{googleLoading ? 'Connecting...' : 'Sign In with Google'}</span>
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md pt-2 border-t border-white/5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Edit Workspace Identity
              </h4>
              <div>
                <label className="text-xs text-[#999BAE] block mb-1">Display Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-[#10111A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#999BAE] block mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full bg-[#10111A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#999BAE] block mb-1">Current Membership Plan</label>
                <div className="px-3 py-2 rounded-lg bg-[#10111A] border border-white/5 text-xs text-[#22D3EE] font-bold uppercase tracking-wider">
                  {profile.plan} Edition Active
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-xs font-semibold hover:bg-[#7C3AED] transition-colors"
              >
                Save Details
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PRIVACY & DATA */}
        {activeTab === 'privacy' && (
          <div className="p-6 rounded-2xl bg-[#171925] border border-white/10 space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-white">Data Portability & Export</h2>
              <p className="text-xs text-[#999BAE] leading-relaxed">
                Export all your conversations, uploaded document metadata, approved memories, and research logs as a machine-readable JSON backup.
              </p>
              <button
                onClick={onExportData}
                className="px-4 py-2 rounded-lg bg-[#10111A] border border-white/10 hover:border-[#22D3EE]/50 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-[#22D3EE]" />
                <span>Export Complete Workspace Archive (.json)</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <h2 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Permanent Data Purge</span>
              </h2>
              <p className="text-xs text-[#999BAE] leading-relaxed">
                Irreversibly delete all chat history, documents, approved memories, and local settings from this browser storage.
              </p>
              <button
                onClick={() => setShowPurgeConfirm(true)}
                className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Purge All Workspace Data</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: USAGE & COSTS */}
        {activeTab === 'usage' && (
          <div className="p-6 rounded-2xl bg-[#171925] border border-white/10 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white">Resource Consumption & Cost Estimates</h2>
              <p className="text-xs text-[#999BAE] mt-0.5">
                Transparent telemetry for input and output token consumption based on published model rates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#10111A] border border-white/5 space-y-1">
                <span className="text-[11px] text-[#999BAE]">Session Tokens</span>
                <div className="text-xl font-mono font-bold text-white">
                  {totalTokensUsed.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-400">Tracked in realtime</span>
              </div>

              <div className="p-4 rounded-xl bg-[#10111A] border border-white/5 space-y-1">
                <span className="text-[11px] text-[#999BAE]">Estimated API Cost</span>
                <div className="text-xl font-mono font-bold text-[#22D3EE]">
                  ${((totalTokensUsed / 1000) * 0.0003).toFixed(4)}
                </div>
                <span className="text-[10px] text-[#999BAE]">Based on Gemini 3.8 rates</span>
              </div>

              <div className="p-4 rounded-xl bg-[#10111A] border border-white/5 space-y-1">
                <span className="text-[11px] text-[#999BAE]">Active AI Gateway</span>
                <div className="text-sm font-semibold text-white mt-1">
                  Google AI Studio
                </div>
                <span className="text-[10px] text-emerald-400">99.9% Uptime</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Purge Confirmation Modal */}
      {showPurgeConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171925] border border-rose-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Permanent Data Purge</span>
            </div>
            <p className="text-xs text-[#999BAE] leading-relaxed">
              This will permanently wipe all local conversations, documents, semantic chunks, and personal memories. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                className="px-3 py-1.5 text-xs text-[#999BAE] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onPurgeAllData();
                  setShowPurgeConfirm(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
