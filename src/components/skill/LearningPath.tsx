"use client";

import { useState, useCallback } from "react";
import { LearningStep } from "@/types";
import { StepItem } from "./StepItem";
import { supabase } from "@/lib/supabase";

interface LearningPathProps {
  steps: LearningStep[];
  skillId: string;
  onProgressUpdate: (progress: number) => void;
}

export function LearningPath({ steps: initialSteps, skillId, onProgressUpdate }: LearningPathProps) {
  const [steps, setSteps] = useState<LearningStep[]>(initialSteps);

  const handleToggleComplete = useCallback(
    async (stepId: string, completed: boolean) => {
      // Optimistically update
      const updatedSteps = steps.map((s) =>
        s.id === stepId ? { ...s, completed } : s
      );
      setSteps(updatedSteps);

      // Calculate new progress
      const completedCount = updatedSteps.filter((s) => s.completed).length;
      const newProgress =
        updatedSteps.length > 0
          ? Math.round((completedCount / updatedSteps.length) * 100)
          : 0;

      // Update step in DB
      await supabase
        .from("learning_steps")
        .update({ completed })
        .eq("id", stepId);

      // Determine new skill status
      let newStatus: "not_started" | "in_progress" | "completed" = "not_started";
      if (completedCount === updatedSteps.length && updatedSteps.length > 0) {
        newStatus = "completed";
      } else if (completedCount > 0) {
        newStatus = "in_progress";
      }

      // Update skill progress and status in DB
      await supabase
        .from("skills")
        .update({
          progress: newProgress,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", skillId);

      onProgressUpdate(newProgress);
    },
    [steps, skillId, onProgressUpdate]
  );

  if (steps.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        No learning steps found. The path may still be generating.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {steps
        .sort((a, b) => a.step_number - b.step_number)
        .map((step) => (
          <StepItem
            key={step.id}
            step={step}
            onToggleComplete={handleToggleComplete}
          />
        ))}
    </div>
  );
}
