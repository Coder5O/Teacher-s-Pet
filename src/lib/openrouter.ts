/**
 * OpenRouter API client.
 * OpenRouter provides a unified interface to many AI models.
 * We use the OpenAI-compatible API format for simplicity.
 */

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    message: { role: string; content: string };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function generateWithAI(
  messages: OpenRouterMessage[],
  model?: string,
  maxTokens = 4096
): Promise<string> {
  const selectedModel = model ?? process.env.NEXT_PUBLIC_DEFAULT_AI_MODEL ?? 'google/gemini-2.0-flash-exp:free';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://teacherspet.ai',
      'X-Title': "Teacher's Pet",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: selectedModel,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(error?.error?.message ?? `OpenRouter API error: ${response.status}`);
  }

  const data: OpenRouterResponse = await response.json();
  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error('No content returned from AI model');
  return content;
}

// ─── Prompt Builders ──────────────────────────────────────────────────────────

export function buildSystemPrompt(role: string): string {
  return `You are an expert educational AI assistant working within Teacher's Pet — a premium platform that helps teachers reduce their workload by 70%.

Your role: ${role}

Always:
- Be professional, encouraging, and teacher-friendly
- Generate content that is age-appropriate, curriculum-aligned, and pedagogically sound
- Format responses clearly using markdown
- Be specific, detailed, and immediately usable in a real classroom
- Return structured, well-organized content`;
}
