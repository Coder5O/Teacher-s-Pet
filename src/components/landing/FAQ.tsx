'use client';
/**
 * FAQ section — common teacher questions with accordion-style reveal.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: "Do I need any AI experience to use Teacher's Pet?",
    a: "Not at all! Teacher's Pet is designed for teachers, not engineers. Just fill in a few fields about your class and topic, and the AI does all the heavy lifting. If you can send an email, you can use this platform.",
  },
  {
    q: 'Which curricula does it support?',
    a: 'We support CAPS (South Africa), Cambridge IGCSE, IB, Common Core (USA), the National Curriculum (UK), Australian Curriculum, CBSE (India), and 20+ more. You can also upload your own custom curriculum documents for alignment.',
  },
  {
    q: 'How many teachers can use the School Plan?',
    a: 'The School Plan supports up to 10 teacher accounts at $49/month. For larger deployments — departments, districts, or entire school systems — contact us for our Enterprise plan with custom pricing.',
  },
  {
    q: 'Can I edit the AI-generated content?',
    a: 'Absolutely. Every piece of content is fully editable. You can regenerate individual sections, edit the text directly, add your own notes, and then export to PDF or Word. The AI gives you a perfect starting point — you make it yours.',
  },
  {
    q: 'Is my data safe and private?',
    a: 'Yes. All data is encrypted in transit and at rest using Firebase. We never share your content with third parties or use it to train AI models. Each teacher\'s data is completely isolated. We\'re GDPR and POPIA compliant.',
  },
  {
    q: "What AI models power Teacher's Pet?",
    a: "We use OpenRouter to provide access to multiple premium AI models including Google Gemini 2.0 Flash, Claude 3.5 Sonnet, and GPT-4o. You can switch models in settings. Pro and School plan users get access to all models.",
  },
  {
    q: 'Can I generate report comments for my entire class at once?',
    a: 'Yes! The Bulk Comment Generator lets you upload a CSV with your students\' names, strengths, weaknesses, and performance levels. The AI generates personalised professional comments for every student in seconds.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes! The free plan gives you 10 AI generations per month — enough to explore the platform and see how it transforms your planning. Upgrade to Teacher Pro for unlimited generations at just $9/month.',
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border rounded-xl overflow-hidden"
      style={{ borderColor: 'rgb(var(--border))' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors duration-150"
        style={{ background: open ? 'rgb(var(--surface-2))' : 'rgb(var(--surface-1))' }}
      >
        <span className="font-medium text-sm pr-4">{q}</span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ background: open ? 'rgb(99 102 241 / 0.15)' : 'rgb(var(--surface-3))' }}
        >
          {open
            ? <Minus size={13} className="text-brand-400" />
            : <Plus size={13} style={{ color: 'rgb(var(--text-muted))' }} />
          }
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="px-5 pb-5 text-sm leading-relaxed"
              style={{ color: 'rgb(var(--text-secondary))' }}
            >
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
          >
            Frequently asked <span className="gradient-text">questions</span>
          </motion.h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
