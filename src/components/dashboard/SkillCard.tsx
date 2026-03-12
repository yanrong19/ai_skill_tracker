"use client";

import Link from "next/link";
import { Skill } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "@/lib/dateUtils";

interface SkillCardProps {
  skill: Skill;
}

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

function getCategoryColor(category: string): string {
  return (
    categoryColors[category] ||
    "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
  );
}

export function SkillCard({ skill }: SkillCardProps) {
  const status = statusConfig[skill.status];

  return (
    <Link href={`/skill/${skill.id}`} className="block group">
      <Card className="border-zinc-800 bg-zinc-900 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-black/20 cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
              {skill.name}
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <Badge
              variant="outline"
              className={`text-xs ${getCategoryColor(skill.category)}`}
            >
              {skill.category}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${status.className}`}
            >
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {skill.description && (
            <p className="text-xs text-zinc-400 mb-3 line-clamp-2">
              {skill.description}
            </p>
          )}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Progress</span>
              <span className="font-medium text-zinc-300">{skill.progress}%</span>
            </div>
            <Progress
              value={skill.progress}
              className="h-1.5 bg-zinc-800 [&>div]:bg-blue-500"
            />
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Updated {formatDistanceToNow(new Date(skill.updated_at))}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
