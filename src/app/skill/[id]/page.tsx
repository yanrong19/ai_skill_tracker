"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Skill, LearningStep } from "@/types";
import { LearningPath } from "@/components/skill/LearningPath";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  TrendingUp,
  Trash2,
} from "lucide-react";

const statusConfig = {
  not_started: {
    label: "Not Started",
    className: "bg-zinc-700 text-zinc-300 border-zinc-600",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  completed: {
    label: "Completed",
    className: "bg-green-500/20 text-green-300 border-green-500/30",
  },
};

const categoryColors: Record<string, string> = {
  "AI/ML": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Web Dev": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  DevOps: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Backend: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Frontend: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Database: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Tools: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Language: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.id as string;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [steps, setSteps] = useState<LearningStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSkillData();
  }, [skillId]);

  async function fetchSkillData() {
    setIsLoading(true);

    // Fetch skill
    const { data: skillData, error: skillError } = await supabase
      .from("skills")
      .select("*")
      .eq("id", skillId)
      .single();

    if (skillError || !skillData) {
      router.push("/");
      return;
    }

    setSkill(skillData);
    setProgress(skillData.progress);

    // Fetch learning paths and steps
    const { data: pathData } = await supabase
      .from("learning_paths")
      .select("id")
      .eq("skill_id", skillId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (pathData && pathData.length > 0) {
      const { data: stepsData } = await supabase
        .from("learning_steps")
        .select("*")
        .eq("path_id", pathData[0].id)
        .order("step_number", { ascending: true });

      if (stepsData) {
        setSteps(stepsData);
      }
    }

    setIsLoading(false);
  }

  const handleProgressUpdate = useCallback((newProgress: number) => {
    setProgress(newProgress);
    setSkill((prev) =>
      prev
        ? {
            ...prev,
            progress: newProgress,
            status:
              newProgress === 100
                ? "completed"
                : newProgress > 0
                ? "in_progress"
                : "not_started",
          }
        : prev
    );
  }, []);

  async function handleDelete() {
    if (!confirm("Delete this skill and its learning path? This cannot be undone."))
      return;

    setIsDeleting(true);
    await supabase.from("skills").delete().eq("id", skillId);
    router.push("/");
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-zinc-900" />
        <Skeleton className="h-32 w-full bg-zinc-900 rounded-xl" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full bg-zinc-900 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!skill) return null;

  const status = statusConfig[skill.status];
  const completedSteps = steps.filter((s) => s.completed).length;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/")}
        className="text-zinc-400 hover:text-white -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Button>

      {/* Skill header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {skill.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  categoryColors[skill.category] ||
                  "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
                }`}
              >
                {skill.category}
              </Badge>
              <Badge variant="outline" className={`text-xs ${status.className}`}>
                {status.label}
              </Badge>
            </div>
            {skill.description && (
              <p className="text-sm text-zinc-400">{skill.description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-zinc-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                {completedSteps} of {steps.length} steps completed
              </span>
              {steps.length > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-400" />
                  {steps.length} total steps
                </span>
              )}
            </div>
            <span className="font-semibold text-white flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
              {progress}%
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500"
          />
        </div>
      </div>

      {/* Learning path */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-zinc-200">Learning Path</h2>
        {steps.length > 0 ? (
          <LearningPath
            steps={steps}
            skillId={skillId}
            onProgressUpdate={handleProgressUpdate}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 py-16 text-center">
            <p className="text-zinc-400">No learning steps found.</p>
            <p className="text-zinc-600 text-sm mt-1">
              The path may still be generating — try refreshing the page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
