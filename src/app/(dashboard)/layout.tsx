'use client';
/**
 * Dashboard Layout — Wraps all protected routes.
 * Handles sidebar state, mobile menu toggle, and content area.
 */
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sidebarCollapsed } = useSettingsStore();
  const { isInitialized } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent layout shift / flash before auth is checked
  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(var(--bg-page))' }}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20" />
          <div className="h-4 w-32 rounded bg-surface-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'rgb(var(--bg-page))' }}>
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 lg:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
