'use client';
/**
 * Dashboard Sidebar navigation.
 * Collapsible on desktop, off-canvas on mobile.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, FileText, ClipboardList, MessageSquare, 
  Zap, Calendar, FolderOpen, Settings, CreditCard, ChevronLeft, ChevronRight,
  LogOut, Sparkles, Award
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

const MAIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Lesson Planner', href: '/lesson-planner', icon: 'BookOpen', badge: 'New' },
  { label: 'Worksheets', href: '/worksheet', icon: 'FileText' },
  { label: 'Assessments', href: '/assessment', icon: 'ClipboardList' },
  { label: 'Rubrics', href: '/rubric', icon: 'Award' },
  { label: 'Report Comments', href: '/comments', icon: 'MessageSquare' },
  { label: 'Quizzes', href: '/quiz', icon: 'Zap' },
  { label: 'AI Assistant', href: '/assistant', icon: 'Sparkles', isPro: true },
];

const ORGANIZE_NAV: NavItem[] = [
  { label: 'My Files', href: '/files', icon: 'FolderOpen' },
  { label: 'Calendar', href: '/calendar', icon: 'Calendar' },
];

const SETTINGS_NAV: NavItem[] = [
  { label: 'Billing & Plan', href: '/billing', icon: 'CreditCard' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
];

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, BookOpen, FileText, ClipboardList, MessageSquare, 
  Zap, Calendar, FolderOpen, Settings, CreditCard, Sparkles, Award
};

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useSettingsStore();

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = iconMap[item.icon];
      const isActive = pathname.startsWith(item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            'sidebar-item relative',
            isActive && 'active'
          )}
        >
          {isActive && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-brand-500"
            />
          )}
          <Icon size={18} className={cn('flex-shrink-0', isActive ? 'text-brand-500' : 'text-inherit')} />
          
          {!sidebarCollapsed && (
            <span className="flex-1 truncate">{item.label}</span>
          )}

          {!sidebarCollapsed && item.badge && (
            <span className="badge badge-pro px-1.5 py-0 text-[10px] uppercase ml-auto">
              {item.badge}
            </span>
          )}
          
          {!sidebarCollapsed && item.isPro && user?.subscription === 'free' && (
            <span className="badge px-1.5 py-0 text-[10px] uppercase ml-auto" style={{ background: 'rgb(245 158 11 / 0.15)', color: '#f59e0b' }}>
              PRO
            </span>
          )}
        </Link>
      );
    });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgb(var(--bg-overlay) / 0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r',
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ background: 'rgb(var(--surface-1))', borderColor: 'rgb(var(--border))' }}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center px-4 border-b relative" style={{ borderColor: 'rgb(var(--border))' }}>
          <Logo size="sm" showText={!sidebarCollapsed} />
          
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full items-center justify-center border transition-colors hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200"
            style={{ background: 'rgb(var(--surface-1))', borderColor: 'rgb(var(--border))', color: 'rgb(var(--text-muted))' }}
          >
            {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3 space-y-6">
          <div>
            {!sidebarCollapsed && (
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2 px-3" style={{ color: 'rgb(var(--text-muted))' }}>
                Tools
              </div>
            )}
            <nav className="space-y-1">{renderNavItems(MAIN_NAV)}</nav>
          </div>

          <div>
            {!sidebarCollapsed && (
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2 px-3" style={{ color: 'rgb(var(--text-muted))' }}>
                Organise
              </div>
            )}
            <nav className="space-y-1">{renderNavItems(ORGANIZE_NAV)}</nav>
          </div>

          <div>
            {!sidebarCollapsed && (
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2 px-3" style={{ color: 'rgb(var(--text-muted))' }}>
                Preferences
              </div>
            )}
            <nav className="space-y-1">{renderNavItems(SETTINGS_NAV)}</nav>
          </div>
        </div>

        {/* Footer Area (User & Logout) */}
        <div className="p-3 border-t" style={{ borderColor: 'rgb(var(--border))' }}>
          {/* User Info */}
          {!sidebarCollapsed && user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl" style={{ background: 'rgb(var(--surface-2))' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                   style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate" style={{ color: 'rgb(var(--text-primary))' }}>
                  {user.displayName}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider" 
                     style={{ color: user.subscription === 'free' ? 'rgb(var(--text-muted))' : '#818cf8' }}>
                  {user.subscription === 'free' ? 'Free Plan' : `${user.subscription} Plan`}
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors sidebar-item"
            style={{ color: 'rgb(var(--error))' }}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
