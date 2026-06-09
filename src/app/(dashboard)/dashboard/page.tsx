'use client';
/**
 * Dashboard main view (Phase 1 placeholder).
 * Will be fully built out in Phase 2.
 */
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { 
  Sparkles, BookOpen, FileText, ClipboardList, MessageSquare, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const QUICK_ACTIONS = [
    { label: 'Generate Lesson Plan', href: '/lesson-planner', icon: BookOpen, color: '#6366f1' },
    { label: 'Create Worksheet', href: '/worksheet', icon: FileText, color: '#8b5cf6' },
    { label: 'Build Assessment', href: '/assessment', icon: ClipboardList, color: '#ec4899' },
    { label: 'Write Report Comments', href: '/comments', icon: MessageSquare, color: '#f97316' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">
          Good morning, {user?.displayName?.split(' ')[0] || 'Teacher'} 👋
        </h1>
        <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          What would you like to create today?
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href}>
              <motion.div
                whileHover={{ y: -4 }}
                className="card p-5 h-full flex flex-col items-start gap-4 transition-all duration-200"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${action.color}18` }}
                >
                  <Icon size={20} style={{ color: action.color }} />
                </div>
                <div className="mt-auto">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-brand-500 transition-colors">
                    {action.label}
                  </h3>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Stats & Activity (Placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 card p-6 min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-sm">Recent Activity</h3>
            <Link href="/files" className="text-xs font-medium flex items-center gap-1 text-brand-500 hover:text-brand-600">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: 'rgb(var(--surface-2))' }}>
              <Sparkles size={20} className="text-brand-400" />
            </div>
            <p className="text-sm font-medium mb-1">No recent activity</p>
            <p className="text-xs max-w-xs" style={{ color: 'rgb(var(--text-muted))' }}>
              Start by generating a lesson plan or worksheet to see it appear here.
            </p>
          </div>
        </div>

        <div className="card p-6 min-h-[300px]">
          <h3 className="font-semibold text-sm mb-6">Your Impact</h3>
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgb(var(--surface-2))' }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--text-secondary))' }}>Time Saved</div>
              <div className="text-2xl font-black gradient-text">0 hrs</div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgb(var(--surface-2))' }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--text-secondary))' }}>Total Generations</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-brand-500">{user?.generationsThisMonth || 0}</span>
                <span className="text-xs font-medium" style={{ color: 'rgb(var(--text-muted))' }}>
                  {user?.subscription === 'free' ? '/ 10 this month' : 'unlimited'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
