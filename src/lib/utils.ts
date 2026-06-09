/**
 * Shared utility functions used across TeacherCopilot AI.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely — resolves conflicts */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a date into a readable string (e.g. "Jun 9, 2026") */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Get the current year-month string (e.g. "2026-06") for analytics */
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

/** Estimate hours saved based on generation count */
export function estimateHoursSaved(totalGenerations: number): number {
  // Each generation saves ~45 minutes on average for teachers
  return Math.round((totalGenerations * 45) / 60);
}

/** Convert a string to a URL-friendly slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
}

/** Capitalize the first letter of each word */
export function titleCase(text: string): string {
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Generate a random pastel color for folders */
export function randomFolderColor(): string {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#0ea5e9', '#3b82f6',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/** Parse markdown-formatted AI output into sections */
export function extractSection(content: string, heading: string): string {
  const regex = new RegExp(`##?\\s*${heading}[^]*?(?=##|$)`, 'i');
  const match = content.match(regex);
  return match ? match[0].replace(/##?\s*.+\n/, '').trim() : '';
}

/** Grade level display names */
export const GRADE_LEVELS = [
  'Grade R / Pre-K', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
  'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
  'Grade 10', 'Grade 11', 'Grade 12', 'Year 1', 'Year 2',
  'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8',
  'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Form 1',
  'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Foundation Phase',
  'Intermediate Phase', 'Senior Phase', 'FET Phase',
];

/** Common subjects */
export const SUBJECTS = [
  'Mathematics', 'English', 'Science', 'Biology', 'Chemistry',
  'Physics', 'History', 'Geography', 'Life Sciences', 'Technology',
  'Computer Science', 'Art', 'Music', 'Physical Education',
  'Economics', 'Business Studies', 'Accounting', 'Languages',
  'Social Studies', 'Natural Sciences', 'Life Skills',
];

/** Common curricula */
export const CURRICULA = [
  'CAPS (South Africa)', 'National Curriculum (UK)', 'Common Core (USA)',
  'IB (International Baccalaureate)', 'Cambridge IGCSE', 'Australian Curriculum',
  'Kenya KNEC', 'Nigeria WAEC', 'Ghana GES', 'Zimbabwe ZIMSEC',
  'New Zealand Curriculum', 'Ontario Curriculum', 'CBSE (India)',
  'Custom / School-Based', 'Other',
];

/** Countries list (top countries for teachers) */
export const COUNTRIES = [
  'South Africa', 'United States', 'United Kingdom', 'Australia',
  'Canada', 'New Zealand', 'Nigeria', 'Kenya', 'Ghana', 'Zimbabwe',
  'India', 'Philippines', 'Singapore', 'UAE', 'Germany', 'France',
  'Brazil', 'Mexico', 'Jamaica', 'Namibia', 'Botswana', 'Zambia',
  'Tanzania', 'Uganda', 'Rwanda', 'Ethiopia', 'Other',
];

export const TEACHING_LEVELS = [
  { value: 'early-childhood', label: 'Early Childhood (Pre-K)' },
  { value: 'primary', label: 'Primary School' },
  { value: 'middle-school', label: 'Middle School' },
  { value: 'high-school', label: 'High School' },
  { value: 'tertiary', label: 'Tertiary / University' },
  { value: 'special-needs', label: 'Special Needs / SEND' },
];

export const SCHOOL_TYPES = [
  { value: 'public', label: 'Public / Government' },
  { value: 'private', label: 'Private / Independent' },
  { value: 'charter', label: 'Charter / Academy' },
  { value: 'international', label: 'International School' },
  { value: 'online', label: 'Online School' },
  { value: 'homeschool', label: 'Homeschool' },
];
