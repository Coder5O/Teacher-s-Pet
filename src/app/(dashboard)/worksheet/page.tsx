'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Save, Download, Copy, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGeneration } from '@/hooks/useGeneration';
import { useAuth } from '@/hooks/useAuth';
import { saveWorksheet } from '@/lib/firestore';
import { GRADE_LEVELS, SUBJECTS, cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import type { WorksheetInput, QuestionType } from '@/types';

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'short-answer', label: 'Short Answer' },
  { value: 'matching', label: 'Matching' },
  { value: 'fill-in-blanks', label: 'Fill in the Blanks' },
  { value: 'essay', label: 'Essay / Long Answer' },
  { value: 'source-based', label: 'Source-Based' },
  { value: 'comprehension', label: 'Comprehension' },
  { value: 'practical', label: 'Practical Activity' },
];

export default function WorksheetPage() {
  const { user } = useAuth();
  const { generate, isGenerating, result } = useGeneration();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  const { register, handleSubmit, watch } = useForm<WorksheetInput>({
    defaultValues: {
      subject: '',
      grade: user?.defaultGrade || '',
      topic: '',
      difficulty: 'medium',
      numberOfQuestions: 10,
      questionTypes: ['multiple-choice', 'short-answer'],
      includeMemo: true,
    }
  });

  const values = watch();

  const buildPrompt = (data: WorksheetInput) => {
    const parts = [
      'Create a highly professional student worksheet.',
      'Grade: ' + data.grade,
      'Subject: ' + data.subject,
      'Topic: ' + data.topic,
      'Difficulty: ' + data.difficulty,
      'Total Questions: ' + data.numberOfQuestions,
      'Question Types: ' + data.questionTypes.join(', '),
      '',
      'Format Requirements:',
      '1. Use Markdown.',
      '2. Title: "# Worksheet: [Topic]"',
      '3. Include Name, Date, Grade fields at the top.',
      '4. Provide clear instructions for each section.',
      '5. Number each question clearly.',
      '6. Leave space (blank lines / underscores) for student answers.',
      data.includeMemo
        ? '7. At the very end, include a complete Teacher Memo / Answer Key under "## Answer Key" with mark allocations.'
        : '7. Do NOT include an answer key.',
    ];
    return parts.join('\n');
  };

  const onSubmit = async (data: WorksheetInput) => {
    setActiveTab('output');
    await generate({ prompt: buildPrompt(data), role: 'Expert Curriculum Content Creator' });
  };

  const handleSave = async () => {
    if (!result || !user) return;
    setIsSaving(true);
    try {
      await saveWorksheet(user.uid, {
        input: values,
        title: 'Worksheet: ' + values.topic,
        instructions: '',
        questions: [],
      });
      toast.success('Worksheet saved!');
    } catch {
      toast.error('Failed to save worksheet.');
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
          <h1 className="text-3xl font-black tracking-tight mb-1">Worksheet Generator</h1>
          <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
            Generate custom worksheets and answer memos instantly.
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
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Topic *</label>
              <input {...register('topic', { required: true })} className="input-field" placeholder="e.g. Shakespeare Act 2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Subject</label>
              <select {...register('subject')} className="input-field">
                <option value="">Select…</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Grade</label>
                <select {...register('grade')} className="input-field">
                  <option value="">Select…</option>
                  {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Difficulty</label>
                <select {...register('difficulty')} className="input-field">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Number of Questions</label>
              <input type="number" {...register('numberOfQuestions', { valueAsNumber: true })} className="input-field" min="1" max="50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Question Types</label>
              <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                {QUESTION_TYPES.map(type => (
                  <label key={type.value}
                    className="flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                    <input type="checkbox" value={type.value} {...register('questionTypes')} className="rounded accent-brand-500 w-4 h-4" />
                    {type.label}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer p-3 rounded-xl border"
              style={{ background: 'rgb(99 102 241 / 0.06)', borderColor: 'rgb(99 102 241 / 0.2)' }}>
              <input type="checkbox" {...register('includeMemo')} className="rounded accent-brand-500 w-4 h-4" />
              <span className="font-medium text-brand-600 dark:text-brand-400">Generate Answer Memo / Key</span>
            </label>
            <button type="submit" disabled={isGenerating} className="w-full btn-primary py-3.5 justify-center">
              {isGenerating
                ? <><Loader2 size={16} className="animate-spin" /> Generating…</>
                : <><Sparkles size={16} /> Generate Worksheet</>}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className={cn('lg:col-span-8', !result && activeTab === 'input' ? 'hidden lg:block' : 'block')}>
          <div className="card h-full min-h-[600px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface-2))' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-semibold">Generated Worksheet</span>
              </div>
              <div className="flex items-center gap-2">
                <button disabled={!result} onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors" title="Copy">
                  <Copy size={16} style={{ color: 'rgb(var(--text-secondary))' }} />
                </button>
                <button disabled={!result}
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors" title="Download">
                  <Download size={16} style={{ color: 'rgb(var(--text-secondary))' }} />
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
                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 size={32} className="animate-spin text-brand-500" />
                    <h3 className="font-bold text-lg">Writing questions…</h3>
                    <p className="text-sm max-w-xs" style={{ color: 'rgb(var(--text-muted))' }}>
                      Generating perfectly levelled questions and compiling the answer memo.
                    </p>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="rounded-xl border p-8 shadow-sm"
                    style={{ background: 'white', borderColor: '#e5e7eb' }}>
                    <MarkdownRenderer content={result} />
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <FileText size={48} className="mb-6" style={{ color: 'rgb(var(--text-muted))' }} />
                    <h3 className="font-bold text-lg mb-2">Create a Worksheet</h3>
                    <p className="text-sm" style={{ color: 'rgb(var(--text-muted))' }}>
                      Fill out the form to generate a printable worksheet and answer key.
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
