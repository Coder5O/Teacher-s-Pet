'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Save, Download, Copy, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGeneration } from '@/hooks/useGeneration';
import { useAuth } from '@/hooks/useAuth';
import { saveLessonPlan } from '@/lib/firestore';
import { GRADE_LEVELS, SUBJECTS, CURRICULA, cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import type { LessonPlanInput } from '@/types';

export default function LessonPlannerPage() {
  const { user } = useAuth();
  const { generate, isGenerating, result } = useGeneration();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  const { register, handleSubmit, watch } = useForm<LessonPlanInput>({
    defaultValues: {
      grade: user?.defaultGrade || '',
      subject: '',
      topic: '',
      learningObjectives: '',
      curriculum: user?.curriculum || '',
      lessonDuration: '60 minutes',
      classAbility: 'mixed',
      numberOfLearners: '30',
      teachingStyle: user?.teachingStyle || 'inquiry-based',
      teachingLanguage: user?.preferredLanguage || 'English',
      outputStyle: 'detailed',
      pedagogy: user?.teachingStyle || 'inquiry-based',
      includeDifferentiation: true,
      includeAssessment: true,
      includeHomework: true,
      includeExtensionTasks: false,
      includeGroupWork: true,
      includePracticalActivity: false,
      includeICTIntegration: false,
      includeInclusiveAdaptations: false,
    }
  });

  const values = watch();

  const buildPrompt = (data: LessonPlanInput) => {
    const requirements = [
      data.includeDifferentiation && '- Include differentiation strategies for different ability levels',
      data.includeAssessment && '- Include formative and summative assessment activities',
      data.includeHomework && '- Include a relevant homework assignment',
      data.includeExtensionTasks && '- Include extension tasks for fast finishers',
      data.includeGroupWork && '- Include collaborative group work activities',
      data.includePracticalActivity && '- Include a hands-on practical activity',
      data.includeICTIntegration && '- Integrate ICT and technology tools',
      data.includeInclusiveAdaptations && '- Include inclusive education adaptations',
    ].filter(Boolean).join('\n');

    return [
      'Create a ' + data.outputStyle + ' lesson plan.',
      'Grade: ' + data.grade,
      'Subject: ' + data.subject,
      'Topic: ' + data.topic,
      'Learning Objectives: ' + (data.learningObjectives || 'Determined by topic'),
      'Curriculum: ' + (data.curriculum || 'Generic'),
      'Duration: ' + data.lessonDuration,
      'Class Ability: ' + data.classAbility,
      'Number of Learners: ' + data.numberOfLearners,
      'Pedagogy: ' + data.pedagogy,
      'Language: ' + data.teachingLanguage,
      requirements && ('Requirements:\n' + requirements),
      'Format output in Markdown with clear ## and ### headings. Be professional and highly detailed.',
    ].filter(Boolean).join('\n');
  };

  const onSubmit = async (data: LessonPlanInput) => {
    setActiveTab('output');
    await generate({ prompt: buildPrompt(data), role: 'Expert Instructional Designer' });
  };

  const handleSave = async () => {
    if (!result || !user) return;
    setIsSaving(true);
    try {
      await saveLessonPlan(user.uid, {
        input: values,
        title: 'Lesson Plan: ' + values.topic,
        objectives: values.learningObjectives,
        learningOutcomes: '',
        starterActivity: '',
        teacherActivities: '',
        learnerActivities: '',
        mainContent: result,
        guidedPractice: '',
        independentPractice: '',
        assessment: '',
        differentiation: '',
        inclusiveAdaptations: '',
        homework: '',
        reflection: '',
        requiredResources: '',
        timeAllocation: values.lessonDuration,
      });
      toast.success('Lesson plan saved to your files!');
    } catch {
      toast.error('Failed to save lesson plan.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (result) { navigator.clipboard.writeText(result); toast.success('Copied to clipboard'); }
  };

  return (
    <div className="animate-fade-in-up pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Lesson Planner</h1>
          <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
            Generate curriculum-aligned lesson plans in seconds.
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
        <div className={cn('lg:col-span-5 space-y-6', activeTab === 'output' && result ? 'hidden lg:block' : 'block')}>
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6">
            <h2 className="text-lg font-bold mb-4">Core Details</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1.5">Topic *</label>
                <input {...register('topic', { required: true })} className="input-field" placeholder="e.g. Introduction to Fractions" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Grade</label>
                  <select {...register('grade')} className="input-field">
                    <option value="">Select...</option>
                    {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Subject</label>
                  <select {...register('subject')} className="input-field">
                    <option value="">Select...</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Learning Objectives</label>
                <textarea {...register('learningObjectives')} className="input-field min-h-[80px] resize-y"
                  placeholder="What should students know or be able to do by the end?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Duration</label>
                  <input {...register('lessonDuration')} className="input-field" placeholder="e.g. 45 mins" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Curriculum</label>
                  <select {...register('curriculum')} className="input-field">
                    <option value="">Generic</option>
                    {CURRICULA.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-t my-5" style={{ borderColor: 'rgb(var(--border))' }} />
            <h2 className="text-lg font-bold mb-4">Include in Plan</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
              {[
                { name: 'includeDifferentiation', label: 'Differentiation' },
                { name: 'includeAssessment', label: 'Assessment' },
                { name: 'includeGroupWork', label: 'Group Work' },
                { name: 'includeHomework', label: 'Homework' },
                { name: 'includeICTIntegration', label: 'ICT Integration' },
                { name: 'includeInclusiveAdaptations', label: 'Inclusive Edu' },
              ].map(toggle => (
                <label key={toggle.name} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" {...register(toggle.name as keyof LessonPlanInput)} className="rounded accent-brand-500 w-4 h-4" />
                  {toggle.label}
                </label>
              ))}
            </div>

            <button type="submit" disabled={isGenerating} className="w-full btn-primary py-3.5 justify-center">
              {isGenerating
                ? <><Loader2 size={16} className="animate-spin" /> Generating Plan…</>
                : <><Sparkles size={16} /> Generate Lesson Plan</>}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className={cn('lg:col-span-7', !result && activeTab === 'input' ? 'hidden lg:block' : 'block')}>
          <div className="card h-full min-h-[600px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface-2))' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-semibold">AI Generated Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyToClipboard} disabled={!result} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30" title="Copy">
                  <Copy size={16} style={{ color: 'rgb(var(--text-secondary))' }} />
                </button>
                <button disabled={!result} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30" title="Download">
                  <Download size={16} style={{ color: 'rgb(var(--text-secondary))' }} />
                </button>
                <button onClick={handleSave} disabled={!result || isSaving} className="btn-primary py-1.5 px-3 text-xs gap-1.5">
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar" style={{ background: 'rgb(var(--surface-1))' }}>
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgb(99 102 241 / 0.12)' }}>
                        <Sparkles size={28} className="text-brand-500" />
                      </div>
                      <div className="absolute inset-0 rounded-2xl animate-ping" style={{ background: 'rgb(99 102 241 / 0.12)' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Crafting your lesson…</h3>
                      <p className="text-sm" style={{ color: 'rgb(var(--text-muted))' }}>Aligning to curriculum and adding pedagogical best practices.</p>
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <MarkdownRenderer content={result} />
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgb(var(--surface-2))' }}>
                      <BookOpen size={28} style={{ color: 'rgb(var(--text-muted))' }} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Ready to plan</h3>
                    <p className="text-sm" style={{ color: 'rgb(var(--text-muted))' }}>
                      Fill out the form and hit Generate to create a comprehensive, curriculum-aligned lesson plan.
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
