'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Send, Loader2, Sparkles, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';

type Message = { role: 'user' | 'assistant'; content: string };

const INITIAL_MESSAGE = 'Hello! I am your AI Teaching Assistant. I can help you brainstorm ideas, explain complex topics in different ways, draft parent emails, suggest classroom activities, or help you design grading rubrics. How can I help you today?';

export default function AssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: INITIAL_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isPro = user?.subscription !== 'free';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !isPro) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, role: 'Helpful Teaching Assistant', model: 'google/gemini-2.5-flash' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
    } catch {
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <Sparkles size={32} className="text-white" />
        </div>
        <span className="badge badge-pro mb-4 text-xs">PRO FEATURE</span>
        <h1 className="text-3xl font-black mb-3">AI Teaching Assistant</h1>
        <p className="mb-8" style={{ color: 'rgb(var(--text-secondary))' }}>
          The open-ended AI Teaching Assistant is a premium feature. Upgrade to Teacher Pro to unlock unrestricted chat, brainstorming, and advanced AI capabilities.
        </p>
        <a href="/billing" className="btn-primary py-3 px-8 text-sm">Upgrade to Pro — $9/mo</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto animate-fade-in-up" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-black tracking-tight">AI Assistant</h1>
        <span className="badge badge-pro text-[10px]">PRO</span>
      </div>

      <div className="flex-1 card flex flex-col overflow-hidden min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-4', msg.role === 'user' && 'flex-row-reverse')}>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                msg.role === 'user' ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-400' : 'bg-brand-500 text-white'
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={cn(
                'max-w-[85%] rounded-2xl p-4',
                msg.role === 'user'
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-800 dark:text-gray-200'
              )} style={msg.role === 'assistant' ? { background: 'rgb(var(--surface-2))' } : {}}>
                {msg.role === 'user'
                  ? <p className="text-sm">{msg.content}</p>
                  : <MarkdownRenderer content={msg.content} className="text-sm" />}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shrink-0 text-white">
                <Sparkles size={16} />
              </div>
              <div className="rounded-2xl p-4 flex gap-1.5 items-center" style={{ background: 'rgb(var(--surface-2))' }}>
                {[0, 150, 300].map(delay => (
                  <div key={delay} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: delay + 'ms' }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: 'rgb(var(--border))' }}>
          <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-3xl mx-auto">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
              placeholder="Ask me anything… (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="w-full rounded-xl px-4 py-3 text-sm resize-none min-h-[48px] max-h-32 custom-scrollbar focus:outline-none focus:ring-2 focus:ring-brand-500"
              style={{ background: 'rgb(var(--surface-2))', border: '1px solid rgb(var(--border))' }}
            />
            <button type="submit" disabled={!input.trim() || isTyping}
              className="w-12 h-12 shrink-0 rounded-xl bg-brand-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-600 transition-colors">
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
            </button>
          </form>
          <p className="text-center mt-2 text-[11px]" style={{ color: 'rgb(var(--text-muted))' }}>
            AI can make mistakes. Always review content before sharing with students.
          </p>
        </div>
      </div>
    </div>
  );
}
