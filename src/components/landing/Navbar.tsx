'use client';
/**
 * Landing page Navbar — fixed top bar with smooth scroll links and CTA.
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'AI Tools', href: '#ai-showcase' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo size="md" />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
              style={{ color: 'rgb(var(--text-secondary))' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgb(var(--text-primary))')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgb(var(--text-secondary))')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150"
            style={{ color: 'rgb(var(--text-secondary))' }}
          >
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary text-sm px-5 py-2.5">
            <Sparkles size={15} />
            Start Free
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ color: 'rgb(var(--text-secondary))' }}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: 'rgb(var(--border))' }}>
                <Link href="/login" className="btn-secondary text-center">Sign in</Link>
                <Link href="/signup" className="btn-primary justify-center">
                  <Sparkles size={15} />
                  Start Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
