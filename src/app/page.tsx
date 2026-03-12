"use client";

import { useState, useEffect } from "react";
import { Skill } from "@/types";
import { supabase } from "@/lib/supabase";
import { SkillSearch } from "@/components/dashboard/SkillSearch";
import { SkillCard } from "@/components/dashboard/SkillCard";
import { TrendingSkills } from "@/components/dashboard/TrendingSkills";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, BookOpen } from "lucide-react";

export default function DashboardPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSkills(data);
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            AI Skill Tracker
          </h1>
        </div>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
          Search for any skill or tool — Claude AI will generate a personalized,
          step-by-step learning path with real resources to guide your journey.
        </p>
      </div>

      {/* Search bar */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
        <p className="text-sm font-medium text-zinc-300">
          Generate a new learning path
        </p>
        <SkillSearch />
        <p className="text-xs text-zinc-500">
          Try: "Claude API", "Docker", "LangChain", "Rust", "GraphQL"...
        </p>
      </div>

      {/* Stats */}
      {!isLoading && skills.length > 0 && <StatsBar skills={skills} />}

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Skills grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-200">
              Your Skills
            </h2>
            {!isLoading && (
              <span className="text-xs text-zinc-500">({skills.length})</span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-lg bg-zinc-900" />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 py-16 text-center">
              <Sparkles className="h-10 w-10 text-zinc-700 mb-3" />
              <p className="text-zinc-400 font-medium">No skills tracked yet</p>
              <p className="text-zinc-600 text-sm mt-1">
                Search for a skill above or click a trending skill to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>

        {/* Trending sidebar */}
        <div className="lg:col-span-1">
          <TrendingSkills />
        </div>
      </div>
    </div>
  );
}
