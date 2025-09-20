export interface ProgrammingLanguage {
  name: string;
  logo?: string;
  proficiency: number; // 0-100
  experience: string;
  category: 'Frontend' | 'Backend' | 'Systems' | 'Web';
  primaryProjects: string[];
  color: string;
  description: string;
  lastUsed?: string;
  frameworks?: string[];
  icon?: string;
}

export const programmingLanguages: ProgrammingLanguage[] = [
  {
    name: 'C#',
    proficiency: 95,
    experience: '15+ years',
    category: 'Backend',
    primaryProjects: ['VirtaMed Simulators', 'Enterprise Applications', '.NET APIs'],
    color: '#239120',
    description:
      'Deep hands-on understanding of desktop application stack; Managed cloud applications',
    lastUsed: 'Currently using',
    frameworks: ['.NET Core', 'ASP.NET', 'WPF', 'Unity'],
    icon: 'csharp',
  },
  {
    name: 'C++',
    proficiency: 85,
    experience: '12+ years',
    category: 'Systems',
    primaryProjects: ['3D Graphics', 'Game Engines', 'Performance Critical Apps'],
    color: '#00599C',
    description: 'High-performance game engine and graphics development.',
    lastUsed: '2023',
    frameworks: ['OpenGL', 'CUDA', 'Qt'],
    icon: 'cplusplus',
  },
  {
    name: 'TypeScript',
    proficiency: 85,
    experience: '6+ years',
    category: 'Frontend',
    primaryProjects: ['Verity Web Apps', 'React Applications', 'Cloud Dashboards'],
    color: '#3178C6',
    description: 'Designed rich user experience web applications in multiple contexts',
    lastUsed: 'Currently using',
    frameworks: ['React', 'Angular', 'Node.js'],
    icon: 'typescript',
  },
  {
    name: 'Python',
    proficiency: 80,
    experience: '8+ years',
    category: 'Backend',
    primaryProjects: ['Automation', 'Data Processing', 'Cloud Functions'],
    color: '#3776AB',
    description: 'Scripting and backend cloud services as well as local applications',
    lastUsed: 'Currently using',
    frameworks: ['FastAPI'],
    icon: 'python',
  },
];
