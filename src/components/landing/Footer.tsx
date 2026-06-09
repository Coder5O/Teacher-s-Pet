'use client';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Mail, Heart, Globe } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Roadmap', href: '/roadmap' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Help Centre', href: '/help' },
    { label: 'API Docs', href: '/docs' },
    { label: 'Status', href: '/status' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
  ],
};

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { icon: XIcon, href: 'https://twitter.com/teacherspetai', label: 'X (Twitter)' },
  { icon: LinkedInIcon, href: 'https://linkedin.com/company/teacherspetai', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@teacherspet.ai', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="border-t pt-16 pb-8" style={{ borderColor: 'rgb(var(--border))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <Logo size="md" className="mb-4" />
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: 'rgb(var(--text-secondary))' }}>
              The world&apos;s most powerful AI productivity platform for teachers.
              Save 8+ hours every week.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150"
                  style={{ background: 'rgb(var(--surface-2))', border: '1px solid rgb(var(--border))', color: 'rgb(var(--text-secondary))' }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'rgb(var(--text-muted))' }}>
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm transition-colors duration-150"
                      style={{ color: 'rgb(var(--text-secondary))' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgb(var(--border))' }}>
          <p className="text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
            © {new Date().getFullYear()} Teacher&apos;s Pet. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'rgb(var(--text-muted))' }}>
            Made with <Heart size={11} fill="#ec4899" stroke="none" /> for teachers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
