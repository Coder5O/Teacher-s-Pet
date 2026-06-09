'use client';
/**
 * Password reset page — sends a reset email via Firebase.
 */
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({ email: z.string().email('Please enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword(data.email);
      setSent(true);
    } catch {
      toast.error('Failed to send reset email. Please check the address and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 hero-gradient">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card p-8">
          <Logo size="md" href="/" className="mb-8" />
          {!sent ? (
            <>
              <h1 className="text-2xl font-black tracking-tight mb-2">Reset your password</h1>
              <p className="text-sm mb-7" style={{ color: 'rgb(var(--text-secondary))' }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email address</label>
                  <div className="relative">
                    <input {...register('email')} type="email" className="input-field pl-10"
                      placeholder="you@school.edu" autoComplete="email" />
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgb(var(--text-muted))' }} />
                  </div>
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3.5 justify-center">
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgb(34 197 94 / 0.12)' }}>
                <CheckCircle size={32} style={{ color: '#22c55e' }} />
              </div>
              <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
              <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                We&apos;ve sent a password reset link to your email. Check your spam folder if you don&apos;t see it.
              </p>
            </motion.div>
          )}
          <Link href="/login"
            className="flex items-center gap-2 text-sm mt-6 transition-colors"
            style={{ color: 'rgb(var(--text-secondary))' }}>
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
