'use client';
/**
 * Dashboard Header — Contains breadcrumbs, theme toggle, and mobile menu trigger.
 */
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sun, Bell, Search } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for theme
  useEffect(() => setMounted(true), []);

  // Format pathname into a readable page title
  const getPageTitle = () => {
    const path = pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header 
      className="h-16 flex items-center justify-between px-4 lg:px-8 border-b sticky top-0 z-30"
      style={{ background: 'rgb(var(--surface-1) / 0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgb(var(--border))' }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Page Title */}
        <h1 className="text-lg font-semibold tracking-tight" style={{ color: 'rgb(var(--text-primary))' }}>
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search (Placeholder) */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm"
                style={{ background: 'rgb(var(--surface-2))', borderColor: 'rgb(var(--border))', color: 'rgb(var(--text-muted))' }}>
          <Search size={14} />
          <span>Search...</span>
          <kbd className="ml-4 px-1.5 py-0.5 rounded text-[10px] bg-black/5 dark:bg-white/10 font-sans">⌘K</kbd>
        </button>

        <button className="sm:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
          <Search size={18} style={{ color: 'rgb(var(--text-secondary))' }} />
        </button>

        {/* Notifications (Placeholder) */}
        <button className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
          <Bell size={18} style={{ color: 'rgb(var(--text-secondary))' }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 border border-white dark:border-gray-900" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Toggle theme"
        >
          {mounted && theme === 'dark' ? (
            <Sun size={18} style={{ color: 'rgb(var(--text-secondary))' }} />
          ) : (
            <Moon size={18} style={{ color: 'rgb(var(--text-secondary))' }} />
          )}
        </button>
      </div>
    </header>
  );
}
