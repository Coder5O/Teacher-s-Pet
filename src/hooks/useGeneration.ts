'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSettingsStore } from '@/store/settingsStore';

interface GenerationOptions {
  prompt: string;
  role?: string;
  onSuccess?: (result: string) => void;
}

export function useGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { selectedModel } = useSettingsStore();

  const generate = async ({ prompt, role, onSuccess }: GenerationOptions) => {
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, role, model: selectedModel }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setResult(data.result);
      if (onSuccess) onSuccess(data.result);
      return data.result;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during generation');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating, result, setResult };
}
