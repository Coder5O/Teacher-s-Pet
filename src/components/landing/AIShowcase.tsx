'use client';
/**
 * AIShowcase — live interactive demo showing the Lesson Planner generating content.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Loader2 } from 'lucide-react';

const DEMO_OUTPUT = `## Lesson Plan: Introduction to Fractions — Grade 5

**Duration:** 60 minutes | **Ability:** Mixed | **Learners:** 30

### 🎯 Learning Objectives
- Understand that a fraction represents equal parts of a whole
- Identify numerator and denominator in a fraction
- Compare simple fractions using visual models

### 🚀 Starter Activity (10 min)
*Pizza Problem* — Show students a picture of a pizza cut into 8 slices. Ask: "If we share this equally among 4 friends, how much does each person get?" Allow think-pair-share.

### 📖 Main Content (20 min)
**Direct Instruction:**
Introduce the fraction bar as a division symbol. Use real objects (folded paper, cut fruit) to demonstrate ½, ¼, and ¾. Key vocabulary: numerator (top = parts we have), denominator (bottom = total equal parts).

### ✏️ Guided Practice (15 min)
Work through 5 examples together on the board:
1. Shade ¾ of a rectangle
2. Write the fraction for shaded parts
3. Place fractions on a number line

### 📊 Assessment
Exit ticket: 3 questions — identify fraction from diagram, write fraction, compare ½ and ¾.

### 🌟 Differentiation
- **Support:** Use concrete manipulatives (fraction tiles)
- **Extension:** Introduce equivalent fractions (½ = 2/4 = 4/8)`;

const STEPS = [
  { label: 'Grade 5', field: 'Grade' },
  { label: 'Mathematics', field: 'Subject' },
  { label: 'Introduction to Fractions', field: 'Topic' },
  { label: 'Detailed Plan', field: 'Output Style' },
];

export function AIShowcase() {
  const [generating, setGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  const handleGenerate = () => {
    setGenerating(true);
    setShowOutput(false);
    setCharIndex(0);

    setTimeout(() => {
      setGenerating(false);
      setShowOutput(true);

      // Simulate streaming text
      let i = 0;
      const interval = setInterval(() => {
        i += 12;
        setCharIndex(i);
        if (i >= DEMO_OUTPUT.length) clearInterval(interval);
      }, 16);
    }, 1800);
  };

  return (
    <section id="ai-showcase" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgb(99 102 241 / 0.15), transparent)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              background: 'rgb(99 102 241 / 0.1)',
              border: '1px solid rgb(99 102 241 / 0.25)',
              color: '#818cf8',
            }}
          >
            <Sparkles size={12} />
            Live AI Demo
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
          >
            See it in <span className="gradient-text">action</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-xl mx-auto"
            style={{ color: 'rgb(var(--text-secondary))' }}
          >
            Watch Teacher&apos;s Pet generate a complete lesson plan in under 2 minutes.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          {/* Input panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-brand-500" />
              <h3 className="text-sm font-semibold">Lesson Planner</h3>
            </div>

            <div className="space-y-3 mb-6">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.field}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgb(var(--surface-2))' }}
                >
                  <ChevronRight size={14} className="text-brand-400 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-xs font-medium" style={{ color: 'rgb(var(--text-muted))' }}>
                      {step.field}:
                    </span>
                    <span className="text-sm font-semibold ml-2">{step.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Toggle options */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {['Differentiation', 'Assessment', 'Homework', 'Group Work'].map((opt) => (
                <div
                  key={opt}
                  className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium"
                  style={{ background: 'rgb(99 102 241 / 0.1)', color: '#818cf8' }}
                >
                  <div className="w-3.5 h-3.5 rounded-sm border-2 border-brand-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-sm bg-brand-400" />
                  </div>
                  {opt}
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full btn-primary justify-center py-3.5"
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating with AI…
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Lesson Plan
                </>
              )}
            </button>
          </motion.div>

          {/* Output panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-6 min-h-[420px] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <h3 className="text-sm font-semibold">AI Output</h3>
              </div>
              {showOutput && (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: 'rgb(34 197 94 / 0.12)', color: '#4ade80' }}>
                  ✓ Generated
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!showOutput && !generating && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-60 gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgb(var(--surface-2))' }}>
                    <Sparkles size={24} className="text-brand-400" />
                  </div>
                  <p className="text-sm text-center" style={{ color: 'rgb(var(--text-muted))' }}>
                    Click &quot;Generate&quot; to see the AI create<br />a complete lesson plan
                  </p>
                </motion.div>
              )}

              {generating && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-60 gap-4"
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgb(99 102 241 / 0.12)' }}>
                      <Sparkles size={24} className="text-brand-400" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl animate-ping"
                      style={{ background: 'rgb(99 102 241 / 0.15)' }} />
                  </div>
                  <div className="space-y-2 w-full">
                    {[80, 60, 90, 50].map((w, i) => (
                      <div key={i} className="skeleton h-3 rounded-full" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </motion.div>
              )}

              {showOutput && (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose-custom text-xs leading-relaxed overflow-y-auto max-h-80 custom-scrollbar"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {DEMO_OUTPUT.slice(0, charIndex)}
                  {charIndex < DEMO_OUTPUT.length && (
                    <span className="inline-block w-0.5 h-3 bg-brand-500 animate-pulse ml-0.5" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
