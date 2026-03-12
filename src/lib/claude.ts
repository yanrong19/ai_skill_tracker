import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateLearningPath(
  skillName: string,
  skillDescription?: string
) {
  const prompt = `You are an expert learning path designer. Generate a comprehensive, practical learning path for someone who wants to learn: "${skillName}"${
    skillDescription ? `\n\nContext: ${skillDescription}` : ""
  }

Create 6-10 progressive learning steps that take the learner from beginner to proficient.

Return ONLY valid JSON in this exact format (no markdown, no explanation, just JSON):
{
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "description": "Detailed description of what to learn and do in this step (2-4 sentences)",
      "estimatedTime": "X hours" or "X days" or "X weeks",
      "resources": [
        {
          "title": "Resource name",
          "url": "https://actual-url.com",
          "type": "docs" | "course" | "tutorial" | "video" | "article" | "tool"
        }
      ]
    }
  ]
}

Requirements:
- Steps should be progressive and build on each other
- Each step should have 2-4 real, working resource links with actual URLs
- Resources should include official documentation, free courses, tutorials, and tools
- Estimated times should be realistic
- Descriptions should be actionable and specific
- Use real URLs from well-known platforms like: official docs, MDN, freeCodeCamp, YouTube, GitHub, Coursera, Udemy, official websites, etc.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const jsonText = content.text.trim();
  const parsed = JSON.parse(jsonText);
  return parsed;
}
