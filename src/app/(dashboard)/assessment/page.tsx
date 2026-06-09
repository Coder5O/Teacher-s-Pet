'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Save, Copy, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGeneration } from '@/hooks/useGeneration';
import { useAuth } from '@/hooks/useAuth';
import { saveAssessment } from '@/lib/firestore';
import { GRADE_LEVELS, SUBJECTS, cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import type { AssessmentInput } from '@/types';

export default function AssessmentPage() {
  const { user } = useAuth();
  const { generate, isGenerating, result } = useGeneration();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  const { register, handleSubmit, watch } = useForm<AssessmentInput>({
    defaultValues: {
      type: 'test',
      subject: '',
      grade: user?.defaultGrade || '',
      topic: '',
      difficulty: 'medium',
      totalMarks: 50,
      includeRubric: true,
      includeMemo: true,
    }
  });

  const values = watch();

  const buildPrompt = (data: AssessmentInput) => {
    const typeLabel = data.type.toUpperCase();
    const parts = [
      'Create a formal ' + data.type + ' for students.',
      'Grade: ' + data.grade,
      'Subject: ' + data.subject,
      'Topic / Scope: ' + data.topic,
      'Difficulty: ' + data.difficulty,
      'Total Marks: ' + data.totalMarks,
      '',
      'Format Requirements:',
      '1. Use Markdown.',
      '2. Title: "# ' + typeLabel + ': ' + data.topic + '"',
      '3. Include standard exam instructions.',
      '4. Organize into logical Sections (e.g. Section A: Multiple Choice, Section B: Long Questions).',
      '5. Show mark allocation per question in brackets, e.g. [5].',
      '6. Ensure marks sum exactly to ' + data.totalMarks + '.',
      data.includeRubric ? '7. Include a grading rubric for essay/long-answer sections under "## Grading Rubric".' : '',
      data.includeMemo ? '8. Include a complete Answer Memo at the end under "## Answer Memo".' : '',
    ].filter(Boolean);
    return parts.join('\n');
  };

  const onSubmit = async (data: AssessmentInput) => {
    setActiveTab('output');
    await generate({ prompt: buildPrompt(data), role: 'Expert Examiner and Assessor' });
  };

  const handleSave = async () => {
    if (!result || !user) return;
    setIsSaving(true);
    try {
      await saveAssessment(user.uid, {
        input: values,
        title: values.type.toUpperCase() + ': ' + values.topic,
        instructions: '',
        sections: [],
      });
      toast.success('Assessment saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (result) { navigator.clipboard.writeText(result); toast.success('Copied!'); }
  };

  return (
    <div className="animate-fade-in-up pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Assessment Builder</h1>
          <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
            Design tests, exams and assignments with custom mark allocations.
          </p>
        </div>
        {result && (
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg" style={{ background: 'rgb(var(--surface-2))' }}>
            <button onClick={() => setActiveTab('input')}
              className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                activeTab === 'input' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500')}>
              Edit Details
            </button>
            <button onClick={() => setActiveTab('output')}
              className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                activeTab === 'output' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500')}>
              Preview
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className={cn('lg:col-span-4', result && activeTab === 'output' ? 'hidden lg:block' : 'block')}>
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Assessment Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['test', 'exam', 'assignment', 'quiz'] as const).map(t => (
                  <label key={t}
                    className={cn('border p-3 rounded-xl text-sm font-medium text-center cursor-pointer capitalize transition-colors',
                      values.type === t
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300')}>
                    <input type="radio" value={t} {...register('type')} className="hidden" />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Topic / Scope *</label>
              <input {...register('topic', { required: true })} className="input-field" placeholder="e.g. World War II Causes" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Subject</label>
                <select {...register('subject')} className="input-field">
                  <option value="">Select…</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Grade</label>
                <select {...register('grade')} className="input-field">
                  <option value="">Select…</option>
                  {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Difficulty</label>
                <select {...register('difficulty')} className="input-field">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Total Marks</label>
                <input type="number" {...register('totalMarks', { valueAsNumber: true, min: 5, max: 300 })} className="input-field" />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" {...register('includeRubric')} className="rounded accent-brand-500" />
                Include Grading Rubric
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" {...register('includeMemo')} className="rounded accent-brand-500" />
                Include Answer Memo
              </label>
            </div>

            <button type="submit" disabled={isGenerating} className="w-full btn-primary py-3.5 justify-center">
              {isGenerating
                ? <><Loader2 size={16} className="animate-spin" /> Building…</>
                : <><Sparkles size={16} /> Build Assessment</>}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className={cn('lg:col-span-8', !result && activeTab === 'input' ? 'hidden lg:block' : 'block')}>
          <div className="card h-full min-h-[600px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface-2))' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-semibold">Generated Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <button disabled={!result} onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors">
                  <Copy size={16} style={{ color: 'rgb(var(--text-secondary))' }} />
                </button>
                <button onClick={handleSave} disabled={!result || isSaving} className="btn-primary py-1.5 px-3 text-xs gap-1.5">
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar" style={{ background: 'rgb(var(--surface-1))' }}>
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full min-h-[400px] flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-brand-500" />
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="rounded-xl border p-8 shadow-sm" style={{ background: 'white', borderColor: '#e5e7eb' }}>
                    <MarkdownRenderer content={result} />
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <ClipboardList size={48} className="mb-4" style={{ color: 'rgb(var(--text-muted))' }} />
                    <h3 className="font-bold text-lg mb-2">Set up your assessment</h3>
                    <p className="text-sm" style={{ color: 'rgb(var(--text-muted))' }}>
                      Configure the details on the left and generate a professional, mark-allocated assessment.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
