/**
 * Zustand store for app-wide settings.
 * Persists user preferences like the selected AI model.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  selectedModel: string;
  darkMode: boolean;
  sidebarCollapsed: boolean;
  // Actions
  setModel: (model: string) => void;
  toggleDarkMode: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selectedModel: 'google/gemini-2.0-flash-exp:free',
      darkMode: true,
      sidebarCollapsed: false,

      setModel: (selectedModel) => set({ selectedModel }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    {
      name: 'teacherspet-settings',
    }
  )
);
