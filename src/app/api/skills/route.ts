import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET /api/skills - fetch all skills
export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ skills: data });
}

// POST /api/skills - create a new skill
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();
  const { name, category = "AI/ML", description = null } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Skill name is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("skills")
    .insert({
      name: name.trim(),
      category,
      description,
      status: "not_started",
      progress: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ skill: data }, { status: 201 });
}
