'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, BookOpen, ClipboardList, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

type SavedItem = {
  id: string;
  type: 'lesson' | 'worksheet' | 'assessment';
  title: string;
  createdAt: Date;
  content: any; // Simplified for MVP
};

export default function FilesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFiles() {
      if (!user) return;
      setIsLoading(true);
      try {
        // Fetch lessons
        const lessonsQ = query(collection(db, 'users', user.uid, 'lessons'), orderBy('createdAt', 'desc'));
        const lessonsSnap = await getDocs(lessonsQ);
        const lessons = lessonsSnap.docs.map(doc => ({
          id: doc.id,
          type: 'lesson' as const,
          title: doc.data().title || 'Untitled Lesson Plan',
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          content: doc.data(),
        }));

        // Fetch worksheets
        const worksheetsQ = query(collection(db, 'users', user.uid, 'worksheets'), orderBy('createdAt', 'desc'));
        const worksheetsSnap = await getDocs(worksheetsQ);
        const worksheets = worksheetsSnap.docs.map(doc => ({
          id: doc.id,
          type: 'worksheet' as const,
          title: doc.data().title || 'Untitled Worksheet',
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          content: doc.data(),
        }));

        // Fetch assessments
        const assessmentsQ = query(collection(db, 'users', user.uid, 'assessments'), orderBy('createdAt', 'desc'));
        const assessmentsSnap = await getDocs(assessmentsQ);
        const assessments = assessmentsSnap.docs.map(doc => ({
          id: doc.id,
          type: 'assessment' as const,
          title: doc.data().title || 'Untitled Assessment',
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          content: doc.data(),
        }));

        // Combine and sort
        const allItems = [...lessons, ...worksheets, ...assessments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setItems(allItems);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load files');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFiles();
  }, [user]);

  const getIcon = (type: string) => {
    if (type === 'lesson') return <BookOpen size={16} className="text-indigo-500" />;
    if (type === 'worksheet') return <FileText size={16} className="text-violet-500" />;
    return <ClipboardList size={16} className="text-pink-500" />;
  };

  return (
    <div className="animate-fade-in-up pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">My Files</h1>
        <p className="text-sm text-gray-500">Access your saved lesson plans, worksheets, and assessments.</p>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <Loader2 size={32} className="animate-spin mb-4 text-brand-500" />
            <p>Loading your files...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-1">No files yet</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Head over to the generators to create your first lesson plan or worksheet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {items.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4 sm:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-2 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] capitalize font-medium text-gray-500">{item.type}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                      <span className="text-[11px] text-gray-500">{format(item.createdAt, 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors" title="Open">
                    <ExternalLink size={16} />
                  </button>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
