"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TOTAL_STEPS } from "./data/phases";
import { STORAGE_KEYS } from "@/lib/constants";

interface GuideState {
  completedSteps: Record<string, boolean>;
  openPhases: Record<number, boolean>;
  toggleStep: (stepId: string) => void;
  togglePhase: (phaseId: number) => void;
  getProgress: () => { done: number; total: number; percent: number };
  isComplete: () => boolean;
  resetProgress: () => void;
}

export const useGuideStore = create<GuideState>()(
  persist(
    (set, get) => ({
      completedSteps: {},
      openPhases: { 1: true },

      toggleStep: (stepId) =>
        set((state) => ({
          completedSteps: {
            ...state.completedSteps,
            [stepId]: !state.completedSteps[stepId],
          },
        })),

      togglePhase: (phaseId) =>
        set((state) => ({
          openPhases: {
            ...state.openPhases,
            [phaseId]: !state.openPhases[phaseId],
          },
        })),

      getProgress: () => {
        const { completedSteps } = get();
        const done = Object.values(completedSteps).filter(Boolean).length;
        return {
          done,
          total: TOTAL_STEPS,
          percent: Math.round((done / TOTAL_STEPS) * 100),
        };
      },

      isComplete: () => {
        const { done, total } = get().getProgress();
        return done >= total;
      },

      resetProgress: () => set({ completedSteps: {} }),
    }),
    {
      name: STORAGE_KEYS.GUIDE_PROGRESS,
    }
  )
);
