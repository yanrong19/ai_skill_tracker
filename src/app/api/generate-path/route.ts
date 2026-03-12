import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateLearningPath } from "@/lib/claude";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();

  let body: {
    skillId: string;
    skillName: string;
    skillDescription?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { skillId, skillName, skillDescription } = body;

  if (!skillId || !skillName) {
    return NextResponse.json(
      { error: "skillId and skillName are required" },
      { status: 400 }
    );
  }

  try {
    // Generate learning path with Claude
    const generated = await generateLearningPath(skillName, skillDescription);

    if (!generated.steps || !Array.isArray(generated.steps)) {
      throw new Error("Invalid response format from Claude");
    }

    // Create learning path record
    const { data: pathData, error: pathError } = await supabase
      .from("learning_paths")
      .insert({
        skill_id: skillId,
        total_steps: generated.steps.length,
      })
      .select()
      .single();

    if (pathError) {
      throw new Error(`Failed to create learning path: ${pathError.message}`);
    }

    // Insert all steps
    const stepsToInsert = generated.steps.map(
      (step: {
        stepNumber: number;
        title: string;
        description: string;
        estimatedTime: string;
        resources: { title: string; url: string; type: string }[];
      }) => ({
        path_id: pathData.id,
        step_number: step.stepNumber,
        title: step.title,
        description: step.description,
        estimated_time: step.estimatedTime,
        completed: false,
        resources: step.resources || [],
      })
    );

    const { error: stepsError } = await supabase
      .from("learning_steps")
      .insert(stepsToInsert);

    if (stepsError) {
      throw new Error(`Failed to insert steps: ${stepsError.message}`);
    }

    // Update skill status to in_progress
    await supabase
      .from("skills")
      .update({
        status: "in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", skillId);

    return NextResponse.json({
      success: true,
      pathId: pathData.id,
      stepsCreated: generated.steps.length,
    });
  } catch (err) {
    console.error("Error generating learning path:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to generate learning path",
      },
      { status: 500 }
    );
  }
}
