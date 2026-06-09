/**
 * Global TypeScript types for Teacher's Pet
 * These types are shared across the entire application.
 */

// ─── User & Auth ──────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'teacher' | 'admin';
  subscription: SubscriptionTier;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Onboarding fields
  country?: string;
  teachingLevel?: TeachingLevel;
  gradesTaught?: string[];
  subjectsTaught?: string[];
  curriculum?: string;
  schoolType?: SchoolType;
  // Preferences
  preferredLanguage?: string;
  defaultGrade?: string;
  teachingStyle?: TeachingStyle;
  darkMode?: boolean;
  generationsThisMonth?: number;
}

export type TeachingLevel = 
  | 'early-childhood'
  | 'primary'
  | 'middle-school'
  | 'high-school'
  | 'tertiary'
  | 'special-needs';

export type SchoolType = 
  | 'public'
  | 'private'
  | 'charter'
  | 'international'
  | 'online'
  | 'homeschool';

export type TeachingStyle =
  | 'inquiry-based'
  | 'direct-instruction'
  | 'project-based'
  | 'differentiated'
  | 'flipped-classroom'
  | 'constructivist';

// ─── Subscription ─────────────────────────────────────────────────────────────

export type SubscriptionTier = 'free' | 'pro' | 'school' | 'enterprise';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, { generations: number; label: string }> = {
  free: { generations: 10, label: 'Free' },
  pro: { generations: Infinity, label: 'Teacher Pro' },
  school: { generations: Infinity, label: 'School Plan' },
  enterprise: { generations: Infinity, label: 'Enterprise' },
};

// ─── Lesson Planner ───────────────────────────────────────────────────────────

export interface LessonPlanInput {
  grade: string;
  subject: string;
  topic: string;
  learningObjectives: string;
  curriculum: string;
  lessonDuration: string;
  classAbility: 'mixed' | 'high' | 'average' | 'low';
  numberOfLearners: string;
  teachingStyle: TeachingStyle;
  teachingLanguage: string;
  additionalNotes?: string;
  // Toggles
  includeDifferentiation: boolean;
  includeAssessment: boolean;
  includeHomework: boolean;
  includeExtensionTasks: boolean;
  includeGroupWork: boolean;
  includePracticalActivity: boolean;
  includeICTIntegration: boolean;
  includeInclusiveAdaptations: boolean;
  // Output options
  outputStyle: LessonOutputStyle;
  pedagogy: TeachingStyle;
}

export type LessonOutputStyle = 
  | 'detailed'
  | 'brief'
  | 'weekly'
  | 'daily'
  | 'unit';

export interface LessonPlan {
  id: string;
  userId: string;
  input: LessonPlanInput;
  title: string;
  objectives: string;
  learningOutcomes: string;
  starterActivity: string;
  teacherActivities: string;
  learnerActivities: string;
  mainContent: string;
  guidedPractice: string;
  independentPractice: string;
  assessment: string;
  differentiation: string;
  inclusiveAdaptations: string;
  homework: string;
  reflection: string;
  requiredResources: string;
  timeAllocation: string;
  createdAt: Date;
  updatedAt: Date;
  folderId?: string;
  tags?: string[];
}

// ─── Worksheet ────────────────────────────────────────────────────────────────

export type QuestionType = 
  | 'multiple-choice'
  | 'short-answer'
  | 'matching'
  | 'fill-in-blanks'
  | 'essay'
  | 'source-based'
  | 'comprehension'
  | 'practical';

export interface WorksheetInput {
  subject: string;
  grade: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
  questionTypes: QuestionType[];
  includeMemo: boolean;
}

export interface Worksheet {
  id: string;
  userId: string;
  input: WorksheetInput;
  title: string;
  instructions: string;
  questions: WorksheetQuestion[];
  memo?: WorksheetMemo;
  createdAt: Date;
  folderId?: string;
}

export interface WorksheetQuestion {
  number: number;
  type: QuestionType;
  question: string;
  options?: string[];    // for multiple choice
  marks: number;
  answer?: string;
}

export interface WorksheetMemo {
  answers: { questionNumber: number; answer: string }[];
  totalMarks: number;
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export type AssessmentType = 'test' | 'exam' | 'assignment' | 'quiz';

export interface AssessmentInput {
  type: AssessmentType;
  subject: string;
  grade: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalMarks: number;
  includeRubric: boolean;
  includeMemo: boolean;
}

export interface Assessment {
  id: string;
  userId: string;
  input: AssessmentInput;
  title: string;
  instructions: string;
  sections: AssessmentSection[];
  rubric?: string;
  memo?: string;
  createdAt: Date;
  folderId?: string;
}

export interface AssessmentSection {
  title: string;
  marks: number;
  questions: WorksheetQuestion[];
}

// ─── Report Comments ──────────────────────────────────────────────────────────

export type CommentMode = 'encouraging' | 'professional' | 'strict' | 'positive';

export interface CommentInput {
  learnerName: string;
  strengths: string;
  weaknesses: string;
  performance: 'excellent' | 'good' | 'average' | 'below-average' | 'poor';
  behavior: string;
  mode: CommentMode;
  subject?: string;
  grade?: string;
}

export interface ReportComment {
  id: string;
  userId: string;
  input: CommentInput;
  comment: string;
  createdAt: Date;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export type QuizMode = 'kahoot' | 'multiple-choice' | 'flashcards' | 'revision';

export interface QuizInput {
  subject: string;
  grade: string;
  topic: string;
  numberOfQuestions: number;
  mode: QuizMode;
  timerSeconds?: number;
}

export interface Quiz {
  id: string;
  userId: string;
  input: QuizInput;
  title: string;
  questions: QuizQuestion[];
  createdAt: Date;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  timeSeconds?: number;
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── AI Models ────────────────────────────────────────────────────────────────

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  costPer1kTokens: number;
  isDefault?: boolean;
}

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Fast, capable model — great for lesson plans',
    maxTokens: 8192,
    costPer1kTokens: 0,
    isDefault: true,
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Excellent for nuanced, detailed content',
    maxTokens: 8192,
    costPer1kTokens: 0.003,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Highly capable general-purpose model',
    maxTokens: 8192,
    costPer1kTokens: 0.005,
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B',
    provider: 'Meta',
    description: 'Fast open-source model, good for quick tasks',
    maxTokens: 4096,
    costPer1kTokens: 0,
  },
];

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsData {
  userId: string;
  month: string; // YYYY-MM
  lessonsCreated: number;
  worksheetsGenerated: number;
  assessmentsCreated: number;
  commentsGenerated: number;
  quizzesCreated: number;
  totalGenerations: number;
  estimatedHoursSaved: number;
  subjectBreakdown: Record<string, number>;
}

// ─── File System ──────────────────────────────────────────────────────────────

export interface Folder {
  id: string;
  userId: string;
  name: string;
  color?: string;
  parentId?: string;
  createdAt: Date;
}

// ─── Rubric ───────────────────────────────────────────────────────────────────

export interface RubricInput {
  assignmentTitle: string;
  criteria: string[];
  grade: string;
  subject?: string;
  totalMarks: number;
}

export interface Rubric {
  id: string;
  userId: string;
  input: RubricInput;
  title: string;
  rows: RubricRow[];
  createdAt: Date;
}

export interface RubricRow {
  criterion: string;
  excellent: string;
  good: string;
  satisfactory: string;
  needsImprovement: string;
  marks: number;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  isPro?: boolean;
}
