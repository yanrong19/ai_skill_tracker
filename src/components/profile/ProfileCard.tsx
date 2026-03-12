"use client";

import { Skill } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Clock, Target } from "lucide-react";

interface ProfileCardProps {
  skills: Skill[];
}

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

export function ProfileCard({ skills }: ProfileCardProps) {
  const mastered = skills.filter((s) => s.status === "completed").length;
  const inProgress = skills.filter((s) => s.status === "in_progress").length;
  const totalProgress =
    skills.length > 0
      ? Math.round(
          skills.reduce((acc, s) => acc + s.progress, 0) / skills.length
        )
      : 0;

  // Group by category
  const byCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryStats = Object.entries(byCategory).map(([cat, catSkills]) => ({
    category: cat,
    total: catSkills.length,
    completed: catSkills.filter((s) => s.status === "completed").length,
    avgProgress: Math.round(
      catSkills.reduce((acc, s) => acc + s.progress, 0) / catSkills.length
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-zinc-700">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl font-bold">
                D
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-white">Developer</h2>
              <p className="text-sm text-zinc-400">AI & Full-Stack Developer</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="text-xs text-zinc-500">Learning actively</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            icon: Trophy,
            label: "Mastered",
            value: mastered,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
          },
          {
            icon: TrendingUp,
            label: "In Progress",
            value: inProgress,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
          },
          {
            icon: Target,
            label: "Total Skills",
            value: skills.length,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
          },
          {
            icon: Clock,
            label: "Avg Progress",
            value: `${totalProgress}%`,
            color: "text-green-400",
            bg: "bg-green-400/10",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-zinc-800 bg-zinc-900">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-zinc-400">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Overall progress */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-300">
            Overall Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">
                {mastered} of {skills.length} skills mastered
              </span>
              <span className="font-semibold text-white">{totalProgress}%</span>
            </div>
            <Progress
              value={totalProgress}
              className="h-3 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category breakdown */}
      {categoryStats.length > 0 && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-300">
              Skills by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        categoryColors[cat.category] ||
                        "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
                      }`}
                    >
                      {cat.category}
                    </Badge>
                    <span className="text-xs text-zinc-500">
                      {cat.completed}/{cat.total} done
                    </span>
                  </div>
                  <span className="text-xs font-medium text-zinc-300">
                    {cat.avgProgress}%
                  </span>
                </div>
                <Progress
                  value={cat.avgProgress}
                  className="h-1.5 bg-zinc-800 [&>div]:bg-blue-500"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills list */}
      {skills.length > 0 && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-300">
              All Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      skill.status === "completed"
                        ? "bg-green-400"
                        : skill.status === "in_progress"
                        ? "bg-blue-400"
                        : "bg-zinc-600"
                    }`}
                  />
                  <span className="text-sm text-zinc-300 truncate">
                    {skill.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <div className="w-20">
                    <Progress
                      value={skill.progress}
                      className="h-1.5 bg-zinc-800 [&>div]:bg-blue-500"
                    />
                  </div>
                  <span className="text-xs text-zinc-400 w-8 text-right">
                    {skill.progress}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
