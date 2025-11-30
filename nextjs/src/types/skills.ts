import type { ReactNode } from 'react';

export interface DetailedSkill {
  name: string;
  description?: string;
  category?: string;
  experience?: string;
  projects?: string[];
  color?: string;
  externalUrl?: string;
  icon?: ReactNode;
}

export interface CliftonStrength extends DetailedSkill {
  domain: string;
  keyTalents: string[];
}

export interface Language extends DetailedSkill {
  proficiencyLevel: 'Native' | 'Proficient' | 'Conversational' | 'Basic';
  contexts: string[];
  certifications?: string[];
}

export interface ProgrammingLanguage {
  name: string;
  logo?: string;
  proficiency: number;
  experience: string;
  category: 'Frontend' | 'Backend' | 'Systems' | 'Web';
  primaryProjects: string[];
  color: string;
  description: string;
  lastUsed?: string;
  frameworks?: string[];
  icon?: string;
}

export interface FrameworkTechnology {
  name: string;
  proficiency: number;
  experience: string;
  category:
    | 'Frontend'
    | 'Backend'
    | 'Desktop'
    | '3D/Graphics'
    | 'DevOps'
    | 'High Performance'
    | 'Runtime';
  primaryProjects: string[];
  color: string;
  description: string;
  lastUsed?: string;
  keyFeatures?: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  isFavorite?: boolean;
  icon?: string;
}

export interface ToolPlatform {
  name: string;
  description: string;
  category: string;
  experience: string;
  projects: string[];
  color: string;
  icon?: string;
  proficiency?: number;
  lastUsed?: string;
  keyFeatures?: string[];
  isFavorite?: boolean;
}
