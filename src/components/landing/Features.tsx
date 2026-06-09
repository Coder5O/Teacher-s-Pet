'use client';
/**
 * Features section — showcases all the core AI tools.
 */
import { motion } from 'framer-motion';
import {
  BookOpen, FileText, ClipboardList, MessageSquare,
  Zap, BarChart3, Calendar, FolderOpen, Bot, Award
} from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'AI Lesson Planner',
    description: 'Generate detailed, curriculum-aligned lesson plans in under 2 minutes. Choose your pedagogy, grade, and topic.',
    color: '#6366f1',
    gradient: 'from-indigo-500/20 to-indigo-500/5',
    badge: 'Most Popular',
  },
  {
    icon: FileText,
    title: 'Worksheet Generator',
    description: 'Create professional worksheets with multiple choice, short answer, essays, and more — complete with memo.',
    color: '#8b5cf6',
    gradient: 'from-violet-500/20 to-violet-500/5',
  },
  {
    icon: ClipboardList,
    title: 'Assessment Builder',
    description: 'Design tests, exams, and assignments with custom mark allocations, rubrics, and answer memos.',
    color: '#ec4899',
    gradient: 'from-pink-500/20 to-pink-500/5',
  },
  {
    icon: MessageSquare,
    title: 'Report Comments',
    description: 'Generate personalised, professional report comments for every student in bulk. Upload CSV for 30 in seconds.',
    color: '#f97316',
    gradient: 'from-orange-500/20 to-orange-500/5',
  },
  {
    icon: Award,
    title: 'Rubric Builder',
    description: 'Build detailed assessment rubrics with performance descriptors across all criteria levels.',
    color: '#eab308',
    gradient: 'from-yellow-500/20 to-yellow-500/5',
  },
  {
    icon: Zap,
    title: 'Quiz Generator',
    description: 'Create engaging classroom quizzes in Kahoot-style, flashcard, or revision format with timer support.',
    color: '#22c55e',
    gradient: 'from-green-500/20 to-green-500/5',
  },
  {
    icon: Bot,
    title: 'AI Teaching Assistant',
    description: 'Chat with your personal AI assistant. Ask for classroom tips, activity ideas, or explanations.',
    color: '#14b8a6',
    gradient: 'from-teal-500/20 to-teal-500/5',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track lessons created, hours saved, subject usage, and monthly productivity trends.',
    color: '#0ea5e9',
    gradient: 'from-sky-500/20 to-sky-500/5',
  },
  {
    icon: Calendar,
    title: 'Teacher Calendar',
    description: 'Plan your term with a drag-and-drop lesson calendar. Schedule assessments and deadlines.',
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  {
    icon: FolderOpen,
    title: 'File System',
    description: 'Organise all your resources by grade or subject in custom folders. Find anything instantly.',
    color: '#a855f7',
    gradient: 'from-purple-500/20 to-purple-500/5',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
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
            Everything you need
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-5"
          >
            One platform,{' '}
            <span className="gradient-text">all your tools</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'rgb(var(--text-secondary))' }}
          >
            Stop bouncing between apps. Teacher&apos;s Pet gives you every tool you need 
            to plan, create, assess, and manage — powered by cutting-edge AI.
          </motion.p>
        </div>

        {/* Features grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="card p-6 relative group cursor-default"
            >
              {feature.badge && (
                <div
                  className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {feature.badge}
                </div>
              )}
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${feature.color}18` }}
              >
                <feature.icon size={20} style={{ color: feature.color }} />
              </div>
              <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--text-secondary))' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
