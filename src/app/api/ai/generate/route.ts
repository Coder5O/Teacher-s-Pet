import { NextResponse } from 'next/server';
import { generateWithAI, buildSystemPrompt } from '@/lib/openrouter';

export const maxDuration = 60; // Allow long generations on Vercel

export async function POST(request: Request) {
  try {
    // In a real app, verify Firebase auth token here using firebase-admin
    const body = await request.json();
    const { prompt, role, model } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const messages = [
      { role: 'system' as const, content: buildSystemPrompt(role || 'Expert Teacher') },
      { role: 'user' as const, content: prompt }
    ];

    const result = await generateWithAI(messages, model);

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}
