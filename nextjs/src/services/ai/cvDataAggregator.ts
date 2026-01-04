// Aggregates data from working-life page for AI CV generation
import {
  timelineEvents,
  softSkills,
  domainExpertise,
  programmingLanguages,
  frameworksAndTechnologies,
  toolsAndPlatforms,
  cliftonStrengths,
  recommendations,
  careerAspirations,
  careerAspirationsIntro,
} from '@/components/working-life/content';
import { cvData } from '@/components/cv/data/cvConfig';
import type { CVDataSourceSelection } from '@/types/database.types';
import { sanitizeForPromptInjection } from '@/lib/prompt-sanitizer';

export type { CVDataSourceSelection };

export interface AggregatedCVData {
  successes?: {
    achievements: Array<{
      title: string;
      subtitle?: string;
    }>;
  };
  whatLookingFor?: {
    intro: string;
    aspirations: Array<{
      title: string;
      description: string;
    }>;
  };
  workExperience?: {
    positions: Array<{
      title: string;
      company: string;
      period: string;
      description: string;
      skills: string[];
      achievements: string[];
    }>;
  };
  technicalSkills?: {
    languages: Array<{
      name: string;
      proficiency: number;
      experience: string;
      frameworks: string[];
    }>;
  };
  frameworksAndTech?: {
    frameworks: Array<{
      name: string;
      category: string;
      proficiency: number;
      experience: string;
      description: string;
      keyFeatures: string[];
    }>;
  };
  toolsAndPlatforms?: {
    tools: Array<{
      name: string;
      category: string;
      proficiency: number;
      experience: string;
      description: string;
      keyFeatures: string[];
    }>;
  };
  softSkills?: {
    skills: Array<{
      name: string;
      description: string;
      experience: string;
      highlights: string[];
    }>;
  };
  cliftonStrengths?: {
    strengths: Array<{
      name: string;
      domain: string;
      description: string;
      keyTalents: string[];
    }>;
  };
  domainExpertise?: {
    domains: Array<{
      name: string;
      description: string;
      experience: string;
      proficiency: number;
      projects: string[];
    }>;
  };
  recommendations?: {
    testimonials: Array<{
      recommenderName: string;
      recommenderTitle: string;
      company: string;
      highlight: string;
      excerpt: string;
    }>;
  };
}

export const DEFAULT_DATA_SELECTION: CVDataSourceSelection = {
  successes: true,
  whatLookingFor: true,
  workExperience: true,
  technicalSkills: true,
  frameworksAndTech: true,
  toolsAndPlatforms: false,
  softSkills: true,
  cliftonStrengths: false,
  domainExpertise: false,
  recommendations: false,
};

export function aggregateCVData(selection: CVDataSourceSelection): AggregatedCVData {
  const data: AggregatedCVData = {};

  if (selection.successes) {
    data.successes = {
      achievements: cvData.sidebar.successes.map((s) => ({
        title: s.title,
        subtitle: s.subtitle,
      })),
    };
  }

  if (selection.whatLookingFor) {
    data.whatLookingFor = {
      intro: careerAspirationsIntro,
      aspirations: careerAspirations.map((a) => ({
        title: a.title,
        description: a.description,
      })),
    };
  }

  if (selection.workExperience) {
    const workPositions = timelineEvents
      .filter((e) => e.type === 'work')
      .map((e) => ({
        title: e.title,
        company: e.company,
        period: e.year,
        description: e.description,
        skills: e.skills || [],
        achievements: e.achievements || [],
      }));

    data.workExperience = { positions: workPositions };
  }

  if (selection.technicalSkills) {
    data.technicalSkills = {
      languages: programmingLanguages.map((lang) => ({
        name: lang.name,
        proficiency: lang.proficiency,
        experience: lang.experience,
        frameworks: lang.frameworks || [],
      })),
    };
  }

  if (selection.frameworksAndTech) {
    data.frameworksAndTech = {
      frameworks: frameworksAndTechnologies.map((fw) => ({
        name: fw.name,
        category: fw.category,
        proficiency: fw.proficiency,
        experience: fw.experience,
        description: fw.description,
        keyFeatures: fw.keyFeatures || [],
      })),
    };
  }

  if (selection.toolsAndPlatforms) {
    data.toolsAndPlatforms = {
      tools: toolsAndPlatforms.map((tool) => ({
        name: tool.name,
        category: tool.category,
        proficiency: tool.proficiency || 0,
        experience: tool.experience,
        description: tool.description,
        keyFeatures: tool.keyFeatures || [],
      })),
    };
  }

  if (selection.softSkills) {
    data.softSkills = {
      skills: softSkills.map((skill) => ({
        name: skill.name,
        description: skill.description,
        experience: skill.experience,
        highlights: skill.projects || [],
      })),
    };
  }

  if (selection.cliftonStrengths) {
    data.cliftonStrengths = {
      strengths: cliftonStrengths.map((strength) => ({
        name: strength.name,
        domain: strength.domain,
        description: strength.description || '',
        keyTalents: strength.keyTalents || [],
      })),
    };
  }

  if (selection.domainExpertise) {
    data.domainExpertise = {
      domains: domainExpertise.map((domain) => ({
        name: domain.name,
        description: domain.description,
        experience: domain.experience,
        proficiency: domain.proficiency || 0,
        projects: domain.projects,
      })),
    };
  }

  if (selection.recommendations) {
    data.recommendations = {
      testimonials: recommendations.map((rec) => {
        // Sanitize recommendation text to prevent prompt injection
        const sanitizedHighlight = sanitizeForPromptInjection(rec.highlightText);
        const sanitizedText = sanitizeForPromptInjection(rec.recommendationText);
        return {
          recommenderName: rec.recommenderName,
          recommenderTitle: rec.recommenderTitle,
          company: rec.recommenderCompany,
          highlight: sanitizedHighlight,
          excerpt:
            sanitizedText.length > 200
              ? sanitizedText.substring(0, 200) + '...'
              : sanitizedText,
        };
      }),
    };
  }

  return data;
}

export function formatDataForPrompt(data: AggregatedCVData): string {
  const sections: string[] = [];

  if (data.successes) {
    sections.push('=== KEY ACHIEVEMENTS & SUCCESSES ===');
    for (const achievement of data.successes.achievements) {
      const text = achievement.subtitle
        ? `${achievement.title} (${achievement.subtitle})`
        : achievement.title;
      sections.push(`• ${text}`);
    }
    sections.push('');
  }

  if (data.whatLookingFor) {
    sections.push('=== WHAT I\'M LOOKING FOR ===');
    sections.push(data.whatLookingFor.intro);
    sections.push('');
    for (const aspiration of data.whatLookingFor.aspirations) {
      sections.push(`• ${aspiration.title}: ${aspiration.description}`);
    }
  }

  if (data.workExperience) {
    sections.push('=== WORK EXPERIENCE ===');
    for (const pos of data.workExperience.positions) {
      sections.push(`\n${pos.title} at ${pos.company} (${pos.period})`);
      sections.push(`Description: ${pos.description}`);
      if (pos.skills.length > 0) {
        sections.push(`Skills: ${pos.skills.join(', ')}`);
      }
      if (pos.achievements.length > 0) {
        sections.push(`Key Achievements:\n- ${pos.achievements.join('\n- ')}`);
      }
    }
  }

  if (data.technicalSkills) {
    sections.push('\n=== PROGRAMMING LANGUAGES ===');
    for (const lang of data.technicalSkills.languages) {
      sections.push(
        `${lang.name}: ${lang.proficiency}% proficiency, ${lang.experience} experience`
      );
      if (lang.frameworks.length > 0) {
        sections.push(`  Frameworks: ${lang.frameworks.join(', ')}`);
      }
    }
  }

  if (data.frameworksAndTech) {
    sections.push('\n=== FRAMEWORKS & TECHNOLOGIES ===');
    for (const fw of data.frameworksAndTech.frameworks) {
      sections.push(
        `${fw.name} (${fw.category}): ${fw.proficiency}% proficiency, ${fw.experience}`
      );
      sections.push(`  ${fw.description}`);
      if (fw.keyFeatures.length > 0) {
        sections.push(`  Key Features: ${fw.keyFeatures.join(', ')}`);
      }
    }
  }

  if (data.toolsAndPlatforms) {
    sections.push('\n=== TOOLS & PLATFORMS ===');
    for (const tool of data.toolsAndPlatforms.tools) {
      sections.push(
        `${tool.name} (${tool.category}): ${tool.proficiency}% proficiency, ${tool.experience}`
      );
      sections.push(`  ${tool.description}`);
      if (tool.keyFeatures.length > 0) {
        sections.push(`  Key Features: ${tool.keyFeatures.join(', ')}`);
      }
    }
  }

  if (data.softSkills) {
    sections.push('\n=== SOFT SKILLS & LEADERSHIP ===');
    for (const skill of data.softSkills.skills) {
      sections.push(`${skill.name} (${skill.experience}): ${skill.description}`);
      if (skill.highlights.length > 0) {
        sections.push(`  Highlights: ${skill.highlights.slice(0, 3).join(', ')}`);
      }
    }
  }

  if (data.cliftonStrengths) {
    sections.push('\n=== CLIFTON STRENGTHS ===');
    for (const strength of data.cliftonStrengths.strengths) {
      sections.push(`${strength.name} (${strength.domain}): ${strength.description}`);
      if (strength.keyTalents.length > 0) {
        sections.push(`  Key Talents: ${strength.keyTalents.join(', ')}`);
      }
    }
  }

  if (data.domainExpertise) {
    sections.push('\n=== DOMAIN EXPERTISE ===');
    for (const domain of data.domainExpertise.domains) {
      sections.push(
        `${domain.name} (${domain.experience}, ${domain.proficiency}%): ${domain.description}`
      );
    }
  }

  if (data.recommendations) {
    sections.push('\n=== PROFESSIONAL RECOMMENDATIONS ===');
    for (const rec of data.recommendations.testimonials) {
      sections.push(`\n"${rec.highlight}" - ${rec.recommenderName}, ${rec.recommenderTitle} at ${rec.company}`);
    }
  }

  return sections.join('\n');
}

export function getDataSourceLabels(): Record<keyof CVDataSourceSelection, { label: string; description: string }> {
  return {
    successes: {
      label: 'Key Achievements',
      description: '10+ teams built, 100+ people hired, ISO 9001 implementations',
    },
    whatLookingFor: {
      label: 'What I\'m Looking For',
      description: 'Career aspirations: Empowerment, Creativity, 3D Graphics...',
    },
    workExperience: {
      label: 'Work Experience',
      description: '5 positions with achievements & skills',
    },
    technicalSkills: {
      label: 'Programming Languages',
      description: 'C#, TypeScript, C++, Python proficiency levels',
    },
    frameworksAndTech: {
      label: 'Frameworks & Technologies',
      description: 'React, .NET, Angular, Three.js, Docker, CUDA',
    },
    toolsAndPlatforms: {
      label: 'Tools & Platforms',
      description: 'Cloud (AWS/Azure/GCP), DevOps, 3D tools',
    },
    softSkills: {
      label: 'Soft Skills & Leadership',
      description: 'Team leadership, mentoring, agile expertise',
    },
    cliftonStrengths: {
      label: 'Clifton Strengths',
      description: 'Individualization, Ideation, Learner, Input, Positivity',
    },
    domainExpertise: {
      label: 'Domain Expertise',
      description: 'Medical simulation, 3D graphics, AI/ML',
    },
    recommendations: {
      label: 'Recommendations',
      description: '6 professional testimonials',
    },
  };
}
