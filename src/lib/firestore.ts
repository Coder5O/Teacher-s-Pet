/**
 * Firestore database helpers.
 * All data access functions for Teacher's Pet are defined here.
 * Keeps database logic separate from UI components.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  UserProfile,
  LessonPlan,
  Worksheet,
  Assessment,
  ReportComment,
  Quiz,
  ChatSession,
  Rubric,
  Folder,
  AnalyticsData,
} from '@/types';

// ─── Collection Names ─────────────────────────────────────────────────────────

export const COLLECTIONS = {
  USERS: 'users',
  LESSON_PLANS: 'lessonPlans',
  WORKSHEETS: 'worksheets',
  ASSESSMENTS: 'assessments',
  COMMENTS: 'comments',
  QUIZZES: 'quizzes',
  CHATS: 'chats',
  SUBSCRIPTIONS: 'subscriptions',
  ANALYTICS: 'analytics',
  FOLDERS: 'folders',
  RUBRICS: 'rubrics',
} as const;

// ─── User Operations ──────────────────────────────────────────────────────────

/** Create or update a user profile in Firestore */
export async function upsertUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const ref = doc(db, COLLECTIONS.USERS, uid);
  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/** Fetch a user profile by UID */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, COLLECTIONS.USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { ...snap.data(), uid: snap.id } as UserProfile;
}

/** Complete onboarding — updates user profile and marks onboarding done */
export async function completeOnboarding(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  await upsertUserProfile(uid, {
    ...data,
    onboardingComplete: true,
    subscription: 'free',
    generationsThisMonth: 0,
  });
}

// ─── Lesson Plan Operations ───────────────────────────────────────────────────

/** Save a new lesson plan */
export async function saveLessonPlan(
  userId: string,
  plan: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.LESSON_PLANS), {
    ...plan,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await incrementGenerationCount(userId);
  return ref.id;
}

/** Fetch all lesson plans for a user */
export async function getUserLessonPlans(userId: string): Promise<LessonPlan[]> {
  const q = query(
    collection(db, COLLECTIONS.LESSON_PLANS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as LessonPlan));
}

/** Update a lesson plan section */
export async function updateLessonPlan(
  id: string,
  data: Partial<LessonPlan>
): Promise<void> {
  const ref = doc(db, COLLECTIONS.LESSON_PLANS, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/** Delete a lesson plan */
export async function deleteLessonPlan(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.LESSON_PLANS, id));
}

// ─── Worksheet Operations ─────────────────────────────────────────────────────

export async function saveWorksheet(
  userId: string,
  worksheet: Omit<Worksheet, 'id' | 'createdAt' | 'userId'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.WORKSHEETS), {
    ...worksheet,
    userId,
    createdAt: serverTimestamp(),
  });
  await incrementGenerationCount(userId);
  return ref.id;
}

export async function getUserWorksheets(userId: string): Promise<Worksheet[]> {
  const q = query(
    collection(db, COLLECTIONS.WORKSHEETS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Worksheet));
}

// ─── Assessment Operations ────────────────────────────────────────────────────

export async function saveAssessment(
  userId: string,
  assessment: Omit<Assessment, 'id' | 'createdAt' | 'userId'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.ASSESSMENTS), {
    ...assessment,
    userId,
    createdAt: serverTimestamp(),
  });
  await incrementGenerationCount(userId);
  return ref.id;
}

export async function getUserAssessments(userId: string): Promise<Assessment[]> {
  const q = query(
    collection(db, COLLECTIONS.ASSESSMENTS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Assessment));
}

// ─── Report Comment Operations ────────────────────────────────────────────────

export async function saveComment(
  userId: string,
  comment: Omit<ReportComment, 'id' | 'createdAt' | 'userId'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.COMMENTS), {
    ...comment,
    userId,
    createdAt: serverTimestamp(),
  });
  await incrementGenerationCount(userId);
  return ref.id;
}

export async function getUserComments(userId: string): Promise<ReportComment[]> {
  const q = query(
    collection(db, COLLECTIONS.COMMENTS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as ReportComment));
}

// ─── Quiz Operations ──────────────────────────────────────────────────────────

export async function saveQuiz(
  userId: string,
  quiz: Omit<Quiz, 'id' | 'createdAt' | 'userId'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.QUIZZES), {
    ...quiz,
    userId,
    createdAt: serverTimestamp(),
  });
  await incrementGenerationCount(userId);
  return ref.id;
}

// ─── Chat Operations ──────────────────────────────────────────────────────────

export async function createChatSession(
  userId: string,
  title: string
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.CHATS), {
    userId,
    title,
    messages: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateChatSession(
  id: string,
  data: Partial<ChatSession>
): Promise<void> {
  const ref = doc(db, COLLECTIONS.CHATS, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function getUserChats(userId: string): Promise<ChatSession[]> {
  const q = query(
    collection(db, COLLECTIONS.CHATS),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as ChatSession));
}

// ─── Folder Operations ────────────────────────────────────────────────────────

export async function createFolder(
  userId: string,
  name: string,
  color?: string
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.FOLDERS), {
    userId,
    name,
    color: color ?? '#6366f1',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserFolders(userId: string): Promise<Folder[]> {
  const q = query(
    collection(db, COLLECTIONS.FOLDERS),
    where('userId', '==', userId),
    orderBy('createdAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Folder));
}

// ─── Analytics Helpers ────────────────────────────────────────────────────────

/** Increment the user's total generation count for billing/limits */
async function incrementGenerationCount(userId: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(ref, {
    generationsThisMonth: increment(1),
  });
}

/** Fetch analytics data for a user and month */
export async function getAnalytics(
  userId: string,
  month: string
): Promise<AnalyticsData | null> {
  const ref = doc(db, COLLECTIONS.ANALYTICS, `${userId}_${month}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as AnalyticsData;
}

// ─── Usage Check ──────────────────────────────────────────────────────────────

/** Check if the user has remaining free-plan generations */
export async function checkGenerationLimit(
  userId: string,
  tier: string
): Promise<{ allowed: boolean; remaining: number }> {
  if (tier !== 'free') return { allowed: true, remaining: Infinity };
  const profile = await getUserProfile(userId);
  const used = profile?.generationsThisMonth ?? 0;
  const limit_count = 10;
  return {
    allowed: used < limit_count,
    remaining: Math.max(0, limit_count - used),
  };
}
