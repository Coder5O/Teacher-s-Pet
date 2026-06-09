'use client';
/**
 * Logo component — used in Navbar, Sidebar, and Auth pages.
 */
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
  className?: string;
}

export function Logo({ size = 'md', showText = true, href = '/', className }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-sm' },
    md: { icon: 30, text: 'text-base' },
    lg: { icon: 38, text: 'text-xl' },
  };

  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Icon mark */}
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{
          width: sizes[size].icon,
          height: sizes[size].icon,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 4px 12px rgb(99 102 241 / 0.4)',
        }}
      >
        <svg
          width={sizes[size].icon * 0.55}
          height={sizes[size].icon * 0.55}
          viewBox="0 0 16 16"
          fill="none"
        >
          {/* Graduation cap / AI spark icon */}
          <path
            d="M8 1L14 4.5V8L8 11.5L2 8V4.5L8 1Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M4 9V12.5L8 14.5L12 12.5V9"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      {showText && (
        <span className={cn('font-bold tracking-tight', sizes[size].text)}>
          <span className="gradient-text">Teacher</span>
          <span style={{ color: 'rgb(var(--text-primary))' }}>&apos;s</span>
          <span className="text-brand-500 font-black"> Pet</span>
          <span className="ml-1 text-base" style={{ fontSize: sizes[size].icon * 0.5 }}>🐾</span>
        </span>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
