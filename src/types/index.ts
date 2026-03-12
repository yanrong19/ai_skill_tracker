export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string | null;
  status: "not_started" | "in_progress" | "completed";
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface LearningPath {
  id: string;
  skill_id: string;
  total_steps: number;
  created_at: string;
}

export interface Resource {
  title: string;
  url: string;
  type: "docs" | "course" | "tutorial" | "video" | "article" | "tool";
}

export interface LearningStep {
  id: string;
  path_id: string;
  step_number: number;
  title: string;
  description: string;
  estimated_time: string | null;
  completed: boolean;
  resources: Resource[];
  created_at: string;
}

export interface GeneratedStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: string;
  resources: Resource[];
}

export interface GeneratedPath {
  steps: GeneratedStep[];
}

export interface SkillWithPath extends Skill {
  learning_paths?: (LearningPath & { learning_steps: LearningStep[] })[];
}

export interface TrendingSkill {
  name: string;
  category: string;
  description: string;
}
