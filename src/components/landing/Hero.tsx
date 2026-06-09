'use client';
/**
 * Hero section — the first thing teachers see.
 * Animated headline, subheadline, CTA buttons, and interactive dashboard preview.
 */
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Play, ArrowRight, Clock, BookOpen, Users } from 'lucide-react';

const STATS = [
  { icon: Clock, label: 'Hours saved/week', value: '8+' },
  { icon: BookOpen, label: 'Lesson plans created', value: '2M+' },
  { icon: Users, label: 'Teachers worldwide', value: '50K+' },
];

const DASHBOARD_PREVIEW_ITEMS = [
  { color: '#6366f1', label: 'Lesson Plan: Fractions Grade 5', time: '2 min ago', type: 'lesson' },
  { color: '#8b5cf6', label: 'Worksheet: Shakespeare Act 2', time: '15 min ago', type: 'worksheet' },
  { color: '#ec4899', label: '28 Report Comments generated', time: '1 hour ago', type: 'comments' },
  { color: '#22c55e', label: 'Assessment: History Term 2', time: '3 hours ago', type: 'assessment' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden hero-gradient">
      {/* Background grid */}
      <div className="absolute inset-0 hero-grid opacity-40" />

      {/* Glowing orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left — copy */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{
                background: 'rgb(99 102 241 / 0.12)',
                border: '1px solid rgb(99 102 241 / 0.3)',
                color: '#818cf8',
              }}
            >
              <Sparkles size={14} />
              AI-powered teacher productivity platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6 text-balance"
            >
              Plan Lessons in{' '}
              <span className="gradient-text">Minutes</span>,{' '}
              <br className="hidden sm:block" />
              Not Hours
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl mb-10 max-w-2xl leading-relaxed text-balance"
              style={{ color: 'rgb(var(--text-secondary))' }}
            >
              AI-powered lesson planning, worksheets, grading tools, classroom resources,
              and teacher productivity — all in one platform. Save{' '}
              <span className="font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
                8+ hours every week
              </span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link href="/signup" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
                <Sparkles size={18} />
                Start Free — No credit card
                <ArrowRight size={16} />
              </Link>
              <button
                className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('ai-showcase')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play size={16} fill="currentColor" />
                Watch Demo
              </button>
            </motion.div>

            {/* Social proof stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-8 mt-12 justify-center lg:justify-start flex-wrap"
            >
              {STATS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ background: 'rgb(99 102 241 / 0.12)' }}>
                    <Icon size={14} className="text-brand-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold leading-none" style={{ color: 'rgb(var(--text-primary))' }}>{value}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgb(var(--text-muted))' }}>{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 w-full max-w-lg"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: '1px solid rgb(var(--border))',
                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.4), 0 0 0 1px rgb(99 102 241 / 0.1)',
              }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{
                  background: 'rgb(var(--surface-2))',
                  borderColor: 'rgb(var(--border))',
                }}
              >
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <div
                  className="flex-1 ml-2 h-5 rounded-md text-xs flex items-center justify-center"
                  style={{ background: 'rgb(var(--surface-3))', color: 'rgb(var(--text-muted))' }}
                >
                  teacherspet.ai/dashboard
                </div>
              </div>

              {/* Dashboard body */}
              <div className="p-5" style={{ background: 'rgb(var(--surface-1))' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-sm font-semibold mb-1">Good morning, Ms. Johnson 👋</div>
                    <div className="text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
                      You&apos;ve saved 6.5 hours this week
                    </div>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgb(99 102 241 / 0.12)', color: '#818cf8' }}
                  >
                    Pro Plan ✨
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Lessons', value: '24', color: '#6366f1' },
                    { label: 'Worksheets', value: '18', color: '#8b5cf6' },
                    { label: 'Comments', value: '142', color: '#ec4899' },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="p-3 rounded-xl"
                      style={{ background: 'rgb(var(--surface-2))' }}
                    >
                      <div className="text-xl font-black" style={{ color }}>{value}</div>
                      <div className="text-xs mt-1" style={{ color: 'rgb(var(--text-muted))' }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent activity */}
                <div className="space-y-2">
                  <div className="text-xs font-medium mb-3" style={{ color: 'rgb(var(--text-muted))' }}>
                    RECENT ACTIVITY
                  </div>
                  {DASHBOARD_PREVIEW_ITEMS.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                      style={{ background: 'rgb(var(--surface-2))' }}
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: item.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{item.label}</div>
                      </div>
                      <div className="text-xs flex-shrink-0" style={{ color: 'rgb(var(--text-muted))' }}>
                        {item.time}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Generate button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    boxShadow: '0 4px 15px rgb(99 102 241 / 0.3)',
                  }}
                >
                  <Sparkles size={15} />
                  Generate Lesson Plan with AI
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
