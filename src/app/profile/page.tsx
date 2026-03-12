"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Skill } from "@/types";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

export default function ProfilePage() {
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
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full bg-zinc-900 rounded-xl" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 bg-zinc-900 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-48 w-full bg-zinc-900 rounded-xl" />
        </div>
      ) : (
        <div className="max-w-2xl">
          <ProfileCard skills={skills} />
        </div>
      )}
    </div>
  );
}
