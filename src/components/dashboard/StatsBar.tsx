"use client";

import { Skill } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, TrendingUp, CheckCircle2, Target } from "lucide-react";

interface StatsBarProps {
  skills: Skill[];
}

export function StatsBar({ skills }: StatsBarProps) {
  const total = skills.length;
  const inProgress = skills.filter((s) => s.status === "in_progress").length;
  const completed = skills.filter((s) => s.status === "completed").length;
  const notStarted = skills.filter((s) => s.status === "not_started").length;

  const stats = [
    {
      label: "Total Skills",
      value: total,
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: TrendingUp,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Not Started",
      value: notStarted,
      icon: Target,
      color: "text-zinc-400",
      bg: "bg-zinc-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-zinc-800 bg-zinc-900">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
