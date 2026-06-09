'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGeneration } from '@/hooks/useGeneration';

type CommentForm = {
  studentName: string;
  pronouns: string;
  tone: string;
  performance: string;
  strengths: string;
  weaknesses: string;
};

export default function CommentsPage() {
  const { generate, isGenerating, result } = useGeneration();

  const { register, handleSubmit } = useForm<CommentForm>({
    defaultValues: {
      studentName: '',
      pronouns: 'He/Him',
      tone: 'professional',
      performance: 'average',
      strengths: '',
      weaknesses: '',
    }
  });

  const buildPrompt = (data: CommentForm) => {
    return [
      'Write a term report card comment for a student.',
      'Student Name: ' + data.studentName,
      'Pronouns: ' + data.pronouns,
      'Tone: ' + data.tone,
      'Overall Performance: ' + data.performance,
      'Key Strengths: ' + data.strengths,
      'Areas for Improvement: ' + data.weaknesses,
      '',
      'Requirements:',
      '1. Write exactly ONE paragraph (4–6 sentences).',
      '2. Start on a positive note.',
      '3. Address improvement areas constructively with growth-mindset language.',
      '4. End with an encouraging forward-looking statement.',
      '5. Output ONLY the comment text — no labels, no headings.',
    ].join('\n');
  };

  const onSubmit = async (data: CommentForm) => {
    await generate({ prompt: buildPrompt(data), role: 'Professional Teacher writing report cards' });
  };

  const copyToClipboard = () => {
    if (result) { navigator.clipboard.writeText(result); toast.success('Comment copied!'); }
  };

  return (
    <div className="animate-fade-in-up pb-20 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight mb-2">Report Comments</h1>
        <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          Generate professional, constructive report card comments instantly.
        </p>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Student Name *</label>
              <input {...register('studentName', { required: true })} className="input-field" placeholder="e.g. Liam" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Pronouns</label>
              <select {...register('pronouns')} className="input-field">
                <option value="He/Him">He / Him</option>
                <option value="She/Her">She / Her</option>
                <option value="They/Them">They / Them</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Performance Level</label>
              <select {...register('performance')} className="input-field">
                <option value="excellent">Excellent / Exceeding Expectations</option>
                <option value="good">Good / Meeting Expectations</option>
                <option value="average">Average / Approaching Expectations</option>
                <option value="struggling">Struggling / Below Expectations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tone</label>
              <select {...register('tone')} className="input-field">
                <option value="professional">Professional and Direct</option>
                <option value="warm">Warm and Encouraging</option>
                <option value="academic">Highly Academic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Key Strengths (comma separated)</label>
            <input {...register('strengths')} className="input-field"
              placeholder="e.g. group work, creative writing, participation" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Areas for Improvement</label>
            <input {...register('weaknesses')} className="input-field"
              placeholder="e.g. talking in class, spelling, handing work in on time" />
          </div>

          <button type="submit" disabled={isGenerating} className="w-full btn-primary py-3.5 justify-center">
            {isGenerating
              ? <><Loader2 size={16} className="animate-spin" /> Writing Comment…</>
              : <><Sparkles size={16} /> Generate Comment</>}
          </button>
        </form>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 pt-8 border-t"
              style={{ borderColor: 'rgb(var(--border))' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Generated Comment</h3>
                <button onClick={copyToClipboard} className="btn-secondary py-1.5 px-3 text-xs gap-1.5">
                  <Copy size={14} /> Copy
                </button>
              </div>
              <div className="p-5 rounded-xl text-sm leading-relaxed" style={{ background: 'rgb(var(--surface-2))' }}>
                {result}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
