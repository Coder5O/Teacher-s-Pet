'use client';
/**
 * TrustedBy section — social proof logos and teacher count.
 */
import { motion } from 'framer-motion';

const LOGOS = [
  { name: 'Cambridge', abbr: 'CAM' },
  { name: 'IEB South Africa', abbr: 'IEB' },
  { name: 'CAPS', abbr: 'CAPS' },
  { name: 'IB World', abbr: 'IB' },
  { name: 'Common Core', abbr: 'CC' },
  { name: 'GCSE', abbr: 'GCSE' },
];

export function TrustedBy() {
  return (
    <section className="py-16 border-y" style={{ borderColor: 'rgb(var(--border))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium uppercase tracking-widest mb-8"
          style={{ color: 'rgb(var(--text-muted))' }}
        >
          Trusted by teachers across 50+ countries
        </motion.p>
        <div className="flex items-center justify-center flex-wrap gap-8">
          {LOGOS.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
              style={{
                background: 'rgb(var(--surface-2))',
                border: '1px solid rgb(var(--border))',
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                {logo.abbr.slice(0, 2)}
              </div>
              <span className="text-sm font-semibold" style={{ color: 'rgb(var(--text-secondary))' }}>
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
