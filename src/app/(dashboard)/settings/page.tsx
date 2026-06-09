'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save, User, Settings2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { COUNTRIES, TEACHING_LEVELS, SCHOOL_TYPES, CURRICULA, cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { selectedModel, setModel } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');

  const { register, handleSubmit } = useForm({
    defaultValues: {
      displayName: user?.displayName || '',
      country: user?.country || '',
      teachingLevel: user?.teachingLevel || '',
      schoolType: user?.schoolType || '',
      curriculum: user?.curriculum || '',
    }
  });

  const onSubmit = async (_data: unknown) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'My Profile', icon: User },
    { id: 'preferences' as const, label: 'Preferences', icon: Settings2 },
  ];

  const AI_MODELS = [
    { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Fast, great for general tasks — available on all plans' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'Exceptional reasoning and writing quality' },
    { id: 'openai/gpt-4o', name: 'GPT-4o', desc: 'Powerful and versatile, ideal for complex tasks' },
  ];

  return (
    <div className="animate-fade-in-up pb-20 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Settings</h1>
        <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          Manage your profile, preferences, and AI models.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar nav */}
        <div className="w-full lg:w-56 shrink-0 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left',
                activeTab === id
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
              )}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card p-6 md:p-8">
              <h2 className="text-lg font-bold mb-6">Profile Information</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input {...register('displayName')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address</label>
                    <input value={user?.email || ''} disabled
                      className="input-field opacity-60 cursor-not-allowed" style={{ background: 'rgb(var(--surface-3))' }} />
                    <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: 'rgb(var(--text-muted))' }}>
                      <Shield size={10} /> Managed by authentication provider
                    </p>
                  </div>
                </div>

                <hr className="border-t" style={{ borderColor: 'rgb(var(--border))' }} />
                <h3 className="font-semibold text-sm">Teaching Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Country</label>
                    <select {...register('country')} className="input-field">
                      <option value="">Select…</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">School Type</label>
                    <select {...register('schoolType')} className="input-field">
                      <option value="">Select…</option>
                      {SCHOOL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Teaching Phase</label>
                    <select {...register('teachingLevel')} className="input-field">
                      <option value="">Select…</option>
                      {TEACHING_LEVELS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Curriculum</label>
                    <select {...register('curriculum')} className="input-field">
                      <option value="">Select…</option>
                      {CURRICULA.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={isSaving} className="btn-primary py-2.5 px-6">
                    {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Theme */}
              <div className="card p-6">
                <h2 className="text-lg font-bold mb-1">Appearance</h2>
                <p className="text-sm mb-5" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Choose your preferred colour scheme.
                </p>
                <div className="flex items-center gap-3">
                  {['light', 'dark', 'system'].map(t => (
                    <button key={t} onClick={() => setTheme(t)}
                      className={cn(
                        'px-5 py-2.5 rounded-xl text-sm font-medium capitalize border transition-colors',
                        theme === t
                          ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      )}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Model */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold">AI Model</h2>
                  <span className="badge badge-pro text-[10px]">PRO</span>
                </div>
                <p className="text-sm mb-5" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Select the AI model powering your generations. Pro and School plans have access to all models.
                </p>
                <div className="space-y-3">
                  {AI_MODELS.map(model => {
                    const isLocked = user?.subscription === 'free' && model.id !== 'google/gemini-2.5-flash';
                    return (
                      <label key={model.id}
                        className={cn(
                          'flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors',
                          isLocked && 'opacity-50 cursor-not-allowed',
                          selectedModel === model.id
                            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/5'
                            : 'border-gray-200 dark:border-gray-800'
                        )}>
                        <input type="radio" name="ai_model" value={model.id}
                          checked={selectedModel === model.id}
                          disabled={isLocked}
                          onChange={e => setModel(e.target.value)}
                          className="mt-1 rounded-full accent-brand-500 w-4 h-4" />
                        <div>
                          <div className="text-sm font-semibold flex items-center gap-2">
                            {model.name}
                            {isLocked && (
                              <span className="text-[10px] uppercase border rounded px-1.5 py-0.5"
                                style={{ color: 'rgb(var(--text-muted))', borderColor: 'rgb(var(--border))' }}>
                                Locked
                              </span>
                            )}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: 'rgb(var(--text-muted))' }}>{model.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
