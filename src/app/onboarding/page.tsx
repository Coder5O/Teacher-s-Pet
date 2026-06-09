'use client';
/**
 * Onboarding page — multi-step wizard to collect teacher profile info.
 * Stores data in Firestore. Shown once after first signup.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Logo } from '@/components/shared/Logo';
import { useAuthStore } from '@/store/authStore';
import { completeOnboarding } from '@/lib/firestore';
import { COUNTRIES, CURRICULA, SUBJECTS, GRADE_LEVELS } from '@/lib/utils';
import type { TeachingLevel, SchoolType } from '@/types';

const TEACHING_LEVELS: { value: TeachingLevel; label: string; emoji: string }[] = [
  { value: 'early-childhood', label: 'Early Childhood (Pre-K)', emoji: '🧸' },
  { value: 'primary', label: 'Primary School', emoji: '📚' },
  { value: 'middle-school', label: 'Middle School', emoji: '✏️' },
  { value: 'high-school', label: 'High School', emoji: '🎓' },
  { value: 'tertiary', label: 'Tertiary / University', emoji: '🏛️' },
  { value: 'special-needs', label: 'Special Needs / SEND', emoji: '🌟' },
];

const SCHOOL_TYPES: { value: SchoolType; label: string }[] = [
  { value: 'public', label: 'Public / Government' },
  { value: 'private', label: 'Private / Independent' },
  { value: 'charter', label: 'Charter / Academy' },
  { value: 'international', label: 'International School' },
  { value: 'online', label: 'Online School' },
  { value: 'homeschool', label: 'Homeschool' },
];

const STEPS = ['Your Country', 'Teaching Level', 'Grades & Subjects', 'Curriculum', 'Almost Done!'];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Form state
  const [country, setCountry] = useState('');
  const [teachingLevel, setTeachingLevel] = useState<TeachingLevel | ''>('');
  const [gradesTaught, setGradesTaught] = useState<string[]>([]);
  const [subjectsTaught, setSubjectsTaught] = useState<string[]>([]);
  const [curriculum, setCurriculum] = useState('');
  const [schoolType, setSchoolType] = useState<SchoolType | ''>('');

  const toggleItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const canProceed = [
    country !== '',
    teachingLevel !== '',
    gradesTaught.length > 0 && subjectsTaught.length > 0,
    curriculum !== '',
    schoolType !== '',
  ][step];

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await completeOnboarding(user.uid, {
        country,
        teachingLevel: teachingLevel as TeachingLevel,
        gradesTaught,
        subjectsTaught,
        curriculum,
        schoolType: schoolType as SchoolType,
      });
      toast.success("Profile saved! Welcome to Teacher's Pet 🎉");
      router.push('/dashboard');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Logo size="md" href="/" className="mb-8 justify-center" />

        {/* Progress bar */}
        <div className="mb-2 flex items-center justify-between text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="w-full h-1.5 rounded-full mb-8" style={{ background: 'rgb(var(--surface-3))' }}>
          <motion.div
            className="h-1.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="card p-8"
          >
            {/* Step 0: Country */}
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-black mb-2">Where do you teach? 🌍</h2>
                <p className="text-sm mb-6" style={{ color: 'rgb(var(--text-secondary))' }}>
                  We&apos;ll use this to tailor AI content to your region.
                </p>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="input-field">
                  <option value="">Select your country…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {/* Step 1: Teaching level */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-black mb-2">What level do you teach? 📖</h2>
                <p className="text-sm mb-6" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Select the phase or level that best describes your classroom.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {TEACHING_LEVELS.map((level) => (
                    <button key={level.value} onClick={() => setTeachingLevel(level.value)}
                      className={`p-4 rounded-xl text-left transition-all duration-150 border ${
                        teachingLevel === level.value
                          ? 'border-brand-500 bg-brand-500/10'
                          : 'border-transparent hover:border-brand-500/30'
                      }`}
                      style={{ background: teachingLevel === level.value ? undefined : 'rgb(var(--surface-2))' }}>
                      <div className="text-xl mb-1">{level.emoji}</div>
                      <div className="text-sm font-medium">{level.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Grades & Subjects */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-black mb-2">Grades & Subjects 📝</h2>
                <p className="text-sm mb-5" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Select all that apply — this helps us pre-fill your forms.
                </p>
                <div className="mb-5">
                  <label className="text-sm font-semibold mb-3 block">Grades taught</label>
                  <div className="flex flex-wrap gap-2">
                    {GRADE_LEVELS.slice(0, 16).map((g) => (
                      <button key={g} onClick={() => toggleItem(gradesTaught, setGradesTaught, g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                          gradesTaught.includes(g)
                            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/40'
                            : 'border'
                        }`}
                        style={!gradesTaught.includes(g) ? {
                          background: 'rgb(var(--surface-2))',
                          borderColor: 'rgb(var(--border))',
                          color: 'rgb(var(--text-secondary))'
                        } : {}}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-3 block">Subjects taught</label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((s) => (
                      <button key={s} onClick={() => toggleItem(subjectsTaught, setSubjectsTaught, s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                          subjectsTaught.includes(s)
                            ? 'bg-violet-500/15 text-violet-400 border border-violet-500/40'
                            : 'border'
                        }`}
                        style={!subjectsTaught.includes(s) ? {
                          background: 'rgb(var(--surface-2))',
                          borderColor: 'rgb(var(--border))',
                          color: 'rgb(var(--text-secondary))'
                        } : {}}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Curriculum */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-black mb-2">Which curriculum do you follow? 📋</h2>
                <p className="text-sm mb-6" style={{ color: 'rgb(var(--text-secondary))' }}>
                  AI-generated content will align to your selected curriculum.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {CURRICULA.map((c) => (
                    <button key={c} onClick={() => setCurriculum(c)}
                      className={`p-3.5 rounded-xl text-sm text-left transition-all duration-150 border ${
                        curriculum === c
                          ? 'border-brand-500 bg-brand-500/10 text-brand-400 font-medium'
                          : 'border-transparent'
                      }`}
                      style={curriculum !== c ? { background: 'rgb(var(--surface-2))', color: 'rgb(var(--text-secondary))' } : {}}>
                      {curriculum === c && <span className="mr-2">✓</span>}{c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: School Type */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-black mb-2">Almost done! 🎉</h2>
                <p className="text-sm mb-6" style={{ color: 'rgb(var(--text-secondary))' }}>
                  What type of school do you teach at?
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {SCHOOL_TYPES.map((type) => (
                    <button key={type.value} onClick={() => setSchoolType(type.value)}
                      className={`p-4 rounded-xl text-sm font-medium text-left transition-all duration-150 border ${
                        schoolType === type.value
                          ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                          : 'border-transparent'
                      }`}
                      style={schoolType !== type.value ? { background: 'rgb(var(--surface-2))', color: 'rgb(var(--text-secondary))' } : {}}>
                      {type.label}
                    </button>
                  ))}
                </div>
                <div className="p-4 rounded-xl flex items-start gap-3"
                  style={{ background: 'rgb(99 102 241 / 0.08)', border: '1px solid rgb(99 102 241 / 0.2)' }}>
                  <CheckCircle size={18} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                    <strong className="text-brand-400">You&apos;re all set!</strong> Your TeacherCopilot AI profile is ready.
                    You can always update these in Settings.
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
            className="btn-secondary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-30">
            <ChevronLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canProceed}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-40">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleFinish} disabled={!canProceed || saving}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-40">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <>Go to Dashboard <ChevronRight size={16} /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
