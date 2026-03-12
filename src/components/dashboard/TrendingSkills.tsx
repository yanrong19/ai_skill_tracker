"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Loader2, Plus } from "lucide-react";
import { TrendingSkill } from "@/types";

const trendingSkills: TrendingSkill[] = [
  { name: "Claude API", category: "AI/ML", description: "Anthropic's powerful AI assistant API" },
  { name: "LangChain", category: "AI/ML", description: "Framework for LLM-powered applications" },
  { name: "Cursor AI", category: "Tools", description: "AI-powered code editor" },
  { name: "Supabase", category: "Database", description: "Open source Firebase alternative" },
  { name: "Next.js 14", category: "Web Dev", description: "React framework with App Router" },
  { name: "Vercel AI SDK", category: "AI/ML", description: "SDK for building AI-powered UIs" },
  { name: "Tailwind CSS", category: "Frontend", description: "Utility-first CSS framework" },
  { name: "Docker", category: "DevOps", description: "Container platform for apps" },
  { name: "Kubernetes", category: "DevOps", description: "Container orchestration system" },
  { name: "GraphQL", category: "Backend", description: "Query language for APIs" },
  { name: "Rust", category: "Language", description: "Systems programming language" },
  { name: "Bun", category: "Tools", description: "Fast JavaScript runtime & toolkit" },
];

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

export function TrendingSkills() {
  const [loadingSkill, setLoadingSkill] = useState<string | null>(null);
  const router = useRouter();

  async function handleAddSkill(skill: TrendingSkill) {
    if (loadingSkill) return;
    setLoadingSkill(skill.name);

    try {
      const skillRes = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: skill.name,
          category: skill.category,
          description: skill.description,
        }),
      });

      if (!skillRes.ok) throw new Error("Failed to create skill");
      const { skill: createdSkill } = await skillRes.json();

      const pathRes = await fetch("/api/generate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: createdSkill.id,
          skillName: createdSkill.name,
          skillDescription: skill.description,
        }),
      });

      if (!pathRes.ok) throw new Error("Failed to generate learning path");

      router.push(`/skill/${createdSkill.id}`);
    } catch (err) {
      console.error(err);
      setLoadingSkill(null);
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          Trending Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1.5">
          {trendingSkills.map((skill) => (
            <button
              key={skill.name}
              onClick={() => handleAddSkill(skill)}
              disabled={!!loadingSkill}
              className="w-full text-left flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-zinc-800 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2 min-w-0">
                {loadingSkill === skill.name ? (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-blue-400" />
                ) : (
                  <Plus className="h-3.5 w-3.5 shrink-0 text-zinc-600 group-hover:text-blue-400 transition-colors" />
                )}
                <span className="text-zinc-300 truncate group-hover:text-white transition-colors">
                  {skill.name}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs shrink-0 ${
                  categoryColors[skill.category] ||
                  "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
                }`}
              >
                {skill.category}
              </Badge>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
