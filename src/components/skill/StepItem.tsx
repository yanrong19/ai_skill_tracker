"use client";

import { useState } from "react";
import { LearningStep, Resource } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Wrench,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepItemProps {
  step: LearningStep;
  onToggleComplete: (stepId: string, completed: boolean) => Promise<void>;
}

const resourceTypeConfig: Record<
  string,
  { icon: React.ElementType; label: string; color: string }
> = {
  docs: { icon: BookOpen, label: "Docs", color: "text-blue-400" },
  course: { icon: GraduationCap, label: "Course", color: "text-purple-400" },
  tutorial: { icon: FileText, label: "Tutorial", color: "text-green-400" },
  video: { icon: Video, label: "Video", color: "text-red-400" },
  article: { icon: FileText, label: "Article", color: "text-yellow-400" },
  tool: { icon: Wrench, label: "Tool", color: "text-cyan-400" },
};

function ResourceLink({ resource }: { resource: Resource }) {
  const config = resourceTypeConfig[resource.type] || resourceTypeConfig.article;
  const Icon = config.icon;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-700 hover:text-white group"
    >
      <Icon className={`h-3 w-3 ${config.color}`} />
      <span className="max-w-[160px] truncate">{resource.title}</span>
      <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </a>
  );
}

export function StepItem({ step, onToggleComplete }: StepItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    setIsLoading(true);
    try {
      await onToggleComplete(step.id, !step.completed);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card
      className={cn(
        "border transition-all duration-200",
        step.completed
          ? "border-green-500/30 bg-green-500/5"
          : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
      )}
    >
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Step number + checkbox */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <button
              onClick={handleToggle}
              disabled={isLoading}
              className="mt-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed"
              aria-label={step.completed ? "Mark incomplete" : "Mark complete"}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              ) : step.completed ? (
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              ) : (
                <Circle className="h-6 w-6 text-zinc-600 hover:text-blue-400 transition-colors" />
              )}
            </button>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
              {step.step_number}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <h3
                className={cn(
                  "text-sm font-semibold leading-snug",
                  step.completed ? "text-zinc-400 line-through" : "text-white"
                )}
              >
                {step.title}
              </h3>
              {step.estimated_time && (
                <Badge
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800 text-zinc-400 text-xs shrink-0 gap-1"
                >
                  <Clock className="h-2.5 w-2.5" />
                  {step.estimated_time}
                </Badge>
              )}
            </div>

            <p
              className={cn(
                "text-sm leading-relaxed mb-3",
                step.completed ? "text-zinc-500" : "text-zinc-400"
              )}
            >
              {step.description}
            </p>

            {step.resources && step.resources.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {step.resources.map((resource, idx) => (
                  <ResourceLink key={idx} resource={resource} />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
