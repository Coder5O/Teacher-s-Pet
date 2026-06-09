'use client';
/**
 * Pricing section — 4-tier pricing with Stripe integration links.
 */
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Sparkles, Building2, Globe } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out the platform.',
    icon: null,
    color: '#64748b',
    features: [
      '10 AI generations per month',
      'Lesson Planner (basic)',
      'Worksheet Generator',
      'PDF export',
      'Email support',
    ],
    cta: 'Start Free',
    ctaHref: '/signup',
    highlight: false,
  },
  {
    name: 'Teacher Pro',
    price: '$9',
    period: '/month',
    description: 'Everything a teacher needs. Unlimited.',
    icon: Sparkles,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    features: [
      'Unlimited AI generations',
      'All 10+ AI tools',
      'PDF & DOCX export',
      'AI Teaching Assistant',
      'Curriculum alignment',
      'Report comment generator',
      'Analytics dashboard',
      'Priority support',
    ],
    cta: 'Start Pro — $9/mo',
    ctaHref: '/signup?plan=pro',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'School Plan',
    price: '$49',
    period: '/month',
    description: 'For entire departments and schools.',
    icon: Building2,
    color: '#8b5cf6',
    features: [
      'Everything in Teacher Pro',
      'Up to 10 teacher accounts',
      'School admin dashboard',
      'Usage analytics',
      'Shared resource library',
      'Bulk comment generation',
      'Dedicated support',
      'Custom branding',
    ],
    cta: 'Get School Plan',
    ctaHref: '/signup?plan=school',
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For districts, provinces, and ministries.',
    icon: Globe,
    color: '#0ea5e9',
    features: [
      'Unlimited teachers',
      'Custom AI model',
      'API access',
      'SSO integration',
      'Custom curriculum upload',
      'White-label option',
      'SLA guarantee',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    ctaHref: 'mailto:enterprise@teacherspet.ai',
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgb(99 102 241 / 0.2), transparent)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
          >
            Simple, <span className="gradient-text">transparent</span> pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg max-w-xl mx-auto"
            style={{ color: 'rgb(var(--text-secondary))' }}
          >
            Start free. Upgrade when you need more. No hidden fees, no surprises.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative flex flex-col rounded-2xl p-6 ${
                plan.highlight
                  ? 'ring-2 ring-brand-500'
                  : 'border'
              }`}
              style={{
                background: plan.highlight
                  ? 'linear-gradient(160deg, rgb(99 102 241 / 0.1) 0%, rgb(var(--surface-1)) 60%)'
                  : 'rgb(var(--surface-1))',
                borderColor: plan.highlight ? undefined : 'rgb(var(--border))',
                boxShadow: plan.highlight
                  ? '0 0 40px rgb(99 102 241 / 0.2)'
                  : undefined,
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {plan.icon && (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${plan.color}20` }}
                    >
                      <plan.icon size={14} style={{ color: plan.color }} />
                    </div>
                  )}
                  <span className="font-semibold text-sm">{plan.name}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm" style={{ color: 'rgb(var(--text-muted))' }}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={15}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: plan.highlight ? '#6366f1' : '#22c55e' }}
                    />
                    <span style={{ color: 'rgb(var(--text-secondary))' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-150 block ${
                  plan.highlight ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm mt-10"
          style={{ color: 'rgb(var(--text-muted))' }}
        >
          🔒 30-day money-back guarantee · Cancel anytime · No contracts
        </motion.p>
      </div>
    </section>
  );
}
