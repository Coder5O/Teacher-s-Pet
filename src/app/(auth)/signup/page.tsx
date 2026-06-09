'use client';
/**
 * Signup page — email/password and Google sign-in.
 * After signup, redirects to onboarding flow.
 */
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  agree: z.boolean().refine((v) => v, 'You must agree to the terms'),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const { signupWithEmail, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await signupWithEmail(data.email, data.password, data.displayName);
      toast.success('Account created! Let\'s set up your profile.');
      router.push('/onboarding');
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Try logging in.');
      } else {
        toast.error(error.message ?? 'Failed to create account. Please try again.');
      }
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push('/onboarding');
    } catch {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex hero-gradient">
      {/* Left — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Logo size="md" href="/" className="mb-6" />
            <h1 className="text-3xl font-black tracking-tight mb-2">Create your account</h1>
            <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
              Join 50,000+ teachers saving hours every week.
            </p>
          </div>

          {/* Google signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full btn-secondary mb-4 py-3 justify-center"
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'rgb(var(--border))' }} />
            <span className="text-xs" style={{ color: 'rgb(var(--text-muted))' }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: 'rgb(var(--border))' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input
                {...register('displayName')}
                className="input-field"
                placeholder="Ms. Johnson"
                autoComplete="name"
              />
              {errors.displayName && (
                <p className="text-xs text-red-400 mt-1">{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                className="input-field"
                placeholder="you@school.edu"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'rgb(var(--text-muted))' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                {...register('agree')}
                type="checkbox"
                id="agree"
                className="mt-0.5 w-4 h-4 rounded accent-brand-500"
              />
              <label htmlFor="agree" className="text-xs leading-relaxed" style={{ color: 'rgb(var(--text-secondary))' }}>
                I agree to the{' '}
                <Link href="/terms" className="text-brand-400 underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-400 underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agree && (
              <p className="text-xs text-red-400">{errors.agree.message}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3.5 justify-center"
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account…</>
              ) : (
                <><Sparkles size={16} /> Create Free Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgb(var(--text-secondary))' }}>
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right — value prop panel (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgb(99 102 241 / 0.1), rgb(139 92 246 / 0.08))' }}
      >
        <div className="relative z-10 max-w-md text-center">
          <div className="text-5xl mb-6">🎯</div>
          <h2 className="text-3xl font-black mb-4">
            Stop spending evenings planning lessons
          </h2>
          <p className="text-lg mb-8" style={{ color: 'rgb(var(--text-secondary))' }}>
            Teachers who use Teacher&apos;s Pet save an average of 8 hours per week.
            That&apos;s a full working day back in your life.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Hours saved/week', value: '8+' },
              { label: 'AI tools included', value: '10+' },
              { label: 'Teachers using it', value: '50K+' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-4 rounded-2xl"
                style={{ background: 'rgb(var(--surface-1))', border: '1px solid rgb(var(--border))' }}
              >
                <div className="text-2xl font-black gradient-text">{value}</div>
                <div className="text-xs mt-1" style={{ color: 'rgb(var(--text-muted))' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
