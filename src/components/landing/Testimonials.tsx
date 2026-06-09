'use client';
/**
 * Testimonials section — real-sounding teacher quotes.
 */
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Grade 7 English Teacher',
    country: '🇿🇦 South Africa',
    avatar: 'SM',
    color: '#6366f1',
    quote: 'I used to spend my entire Sunday planning the week\'s lessons. Now I do it in 30 minutes on Friday afternoon. TeacherCopilot AI has genuinely changed my life.',
    stars: 5,
  },
  {
    name: 'James O.',
    role: 'High School Science Teacher',
    country: '🇳🇬 Nigeria',
    avatar: 'JO',
    color: '#8b5cf6',
    quote: 'The report comments generator alone is worth every penny. I generate comments for all 120 of my students in about 10 minutes. It used to take me two full weekends.',
    stars: 5,
  },
  {
    name: 'Priya K.',
    role: 'Primary School Teacher',
    country: '🇮🇳 India',
    avatar: 'PK',
    color: '#ec4899',
    quote: 'The lesson plans are so detailed and pedagogically sound. They align perfectly with our curriculum. I just edit a few details and I\'m done. My principal loves the quality.',
    stars: 5,
  },
  {
    name: 'David T.',
    role: 'Mathematics HOD',
    country: '🇬🇧 United Kingdom',
    avatar: 'DT',
    color: '#f97316',
    quote: 'I implemented this across my entire maths department. The rubric builder and assessment generator have standardised our quality beautifully. Worth every cent of the school plan.',
    stars: 5,
  },
  {
    name: 'Amara N.',
    role: 'Grade 4 Teacher',
    country: '🇰🇪 Kenya',
    avatar: 'AN',
    color: '#22c55e',
    quote: 'The differentiation options in the lesson planner are incredible. I teach a very mixed-ability class and the AI accounts for all ability levels automatically.',
    stars: 5,
  },
  {
    name: 'Emma R.',
    role: 'SEND Coordinator',
    country: '🇦🇺 Australia',
    avatar: 'ER',
    color: '#0ea5e9',
    quote: 'The inclusive education adaptations feature is something I\'ve never seen in any other platform. It genuinely supports our special needs students. Outstanding product.',
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
          >
            Loved by <span className="gradient-text">50,000+ teachers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg max-w-xl mx-auto"
            style={{ color: 'rgb(var(--text-secondary))' }}
          >
            Teachers around the world are saving hours every week and loving every minute of it.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card p-6 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} size={14} fill="#eab308" stroke="none" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgb(var(--text-secondary))' }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'rgb(var(--border))' }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
                    {t.role} · {t.country}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
