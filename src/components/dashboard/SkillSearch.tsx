"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export function SkillSearch() {
  const [skillName, setSkillName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!skillName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // First create the skill in Supabase
      const skillRes = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: skillName.trim() }),
      });

      if (!skillRes.ok) {
        const errData = await skillRes.json();
        throw new Error(errData.error || "Failed to create skill");
      }

      const { skill } = await skillRes.json();

      // Generate the learning path via Claude
      const pathRes = await fetch("/api/generate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: skill.id,
          skillName: skill.name,
        }),
      });

      if (!pathRes.ok) {
        const errData = await pathRes.json();
        throw new Error(errData.error || "Failed to generate learning path");
      }

      // Navigate to the skill detail page
      router.push(`/skill/${skill.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="e.g. Claude API, LangChain, Docker, Rust..."
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="flex-1 h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500 focus-visible:border-blue-500 text-base"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !skillName.trim()}
          className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium gap-2 shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Path
            </>
          )}
        </Button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
