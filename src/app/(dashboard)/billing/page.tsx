'use client';
import { useAuth } from '@/hooks/useAuth';
import { Check, Sparkles, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PRO_FEATURES = [
  'Unlimited AI Generations (Lesson Plans, Worksheets, Assessments…)',
  'Access to premium AI models (Claude 3.5 Sonnet, GPT-4o)',
  'Open-ended AI Teaching Assistant chat',
  'Bulk Report Comment generation via CSV upload',
  'Export to PDF and Microsoft Word',
  'Priority email support',
];

export default function BillingPage() {
  const { user } = useAuth();
  const isPro = user?.subscription !== 'free';
  const usagePercent = Math.min(((user?.generationsThisMonth || 0) / 10) * 100, 100);

  const handleUpgrade = () => {
    // Real app: call API to create Stripe Checkout Session, then redirect
    alert('Stripe Checkout would open here. Add your NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable.');
  };

  const handleManageBilling = () => {
    // Real app: call API to create Stripe Customer Portal session, then redirect
    alert('Stripe Customer Portal would open here.');
  };

  return (
    <div className="animate-fade-in-up pb-20 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Billing &amp; Plan</h1>
        <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          Manage your subscription and billing details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Current Plan Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--text-muted))' }}>
              Current Plan
            </h2>
            <div className="text-3xl font-black mb-1 capitalize">{user?.subscription || 'Free'}</div>
            <p className="text-sm mb-6" style={{ color: 'rgb(var(--text-secondary))' }}>
              {isPro ? 'You have access to all premium features.' : 'You are on the free tier.'}
            </p>
            {isPro ? (
              <button onClick={handleManageBilling} className="w-full btn-secondary py-2.5 justify-center text-sm gap-2">
                <CreditCard size={16} /> Manage Billing
              </button>
            ) : (
              <button onClick={handleUpgrade} className="w-full btn-primary py-2.5 justify-center text-sm gap-2">
                <Sparkles size={16} /> Upgrade Now
              </button>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-sm mb-4">Usage this month</h3>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: 'rgb(var(--text-secondary))' }}>AI Generations</span>
              <span className="font-semibold">
                {user?.generationsThisMonth || 0}{!isPro && ' / 10'}
              </span>
            </div>
            {!isPro && (
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgb(var(--surface-3))' }}>
                <div className="h-full rounded-full bg-brand-500 transition-all duration-500"
                  style={{ width: usagePercent + '%' }} />
              </div>
            )}
            {isPro && (
              <p className="text-xs mt-1" style={{ color: 'rgb(var(--text-muted))' }}>Unlimited on your plan</p>
            )}
          </div>
        </div>

        {/* Upgrade panel */}
        <div className="md:col-span-2">
          {!isPro ? (
            <div className="card p-8 border-brand-200 dark:border-brand-900">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
                    Teacher Pro <Sparkles size={20} className="text-brand-500" />
                  </h2>
                  <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                    Everything you need to save 8+ hours a week.
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-3xl font-black">$9</div>
                  <div className="text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--text-muted))' }}>per month</div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {PRO_FEATURES.map((feature, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgb(34 197 94 / 0.12)' }}>
                      <Check size={12} style={{ color: '#22c55e' }} />
                    </div>
                    <span className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>{feature}</span>
                  </motion.div>
                ))}
              </div>

              <button onClick={handleUpgrade} className="w-full btn-primary py-4 justify-center text-base gap-2">
                Upgrade to Teacher Pro <ArrowRight size={18} />
              </button>
              <p className="text-center text-xs mt-3" style={{ color: 'rgb(var(--text-muted))' }}>
                Cancel anytime. No contracts.
              </p>
            </div>
          ) : (
            <div className="card p-8 flex flex-col items-center justify-center text-center h-full min-h-[280px]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgb(99 102 241 / 0.12)' }}>
                <Sparkles size={32} className="text-brand-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">You&apos;re on Teacher Pro!</h2>
              <p className="text-sm max-w-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                Thank you for subscribing. You have unlimited access to all premium features and AI models.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
