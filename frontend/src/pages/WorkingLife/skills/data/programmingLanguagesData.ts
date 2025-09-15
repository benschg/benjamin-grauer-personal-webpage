export interface ProgrammingLanguage {
  name: string;
  logo?: string;
  proficiency: number; // 0-100
  experience: string;
  category: 'Frontend' | 'Backend' | 'Systems' | 'Database' | 'Web';
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
    description: 'Primary language for enterprise development',
    lastUsed: 'Currently using',
    frameworks: ['.NET Core', 'ASP.NET', 'WPF', 'Unity'],
    icon: 'csharp',
  },
  {
    name: 'TypeScript',
    proficiency: 85,
    experience: '6+ years',
    category: 'Frontend',
    primaryProjects: ['Verity Web Apps', 'React Applications', 'Cloud Dashboards'],
    color: '#3178C6',
    description: 'Modern web development with type safety',
    lastUsed: 'Currently using',
    frameworks: ['React', 'Angular', 'Node.js'],
    icon: 'typescript',
  },
  {
    name: 'C++',
    proficiency: 85,
    experience: '12+ years',
    category: 'Systems',
    primaryProjects: ['3D Graphics', 'Game Engines', 'Performance Critical Apps'],
    color: '#00599C',
    description: 'High-performance systems and graphics',
    lastUsed: '2023',
    frameworks: ['OpenGL', 'CUDA', 'Qt'],
    icon: 'cplusplus',
  },
  {
    name: 'Python',
    proficiency: 80,
    experience: '8+ years',
    category: 'Backend',
    primaryProjects: ['Automation', 'Data Processing', 'Cloud Functions'],
    color: '#3776AB',
    description: 'Scripting and backend services',
    lastUsed: 'Currently using',
    frameworks: ['FastAPI', 'Django', 'NumPy'],
    icon: 'python',
  },
  {
    name: 'JavaScript',
    proficiency: 90,
    experience: '10+ years',
    category: 'Frontend',
    primaryProjects: ['Web Applications', 'Node.js Services', 'Frontend Development'],
    color: '#F7DF1E',
    description: 'Full-stack web development',
    lastUsed: 'Currently using',
    frameworks: ['React', 'Vue', 'Express'],
    icon: 'javascript',
  },
  {
    name: 'SQL',
    proficiency: 85,
    experience: '15+ years',
    category: 'Database',
    primaryProjects: ['Database Design', 'Query Optimization', 'Data Architecture'],
    color: '#336791',
    description: 'Database management and optimization',
    lastUsed: 'Currently using',
    frameworks: ['PostgreSQL', 'MySQL', 'SQL Server'],
    icon: 'sql',
  },
  {
    name: 'HTML/CSS',
    proficiency: 90,
    experience: '12+ years',
    category: 'Web',
    primaryProjects: ['Responsive Design', 'Web Components', 'UI Development'],
    color: '#E34F26',
    description: 'Modern web markup and styling',
    lastUsed: 'Currently using',
    frameworks: ['Tailwind', 'Material-UI', 'SASS'],
    icon: 'html',
  },
  {
    name: 'C',
    proficiency: 70,
    experience: '10+ years',
    category: 'Systems',
    primaryProjects: ['Embedded Systems', 'Low-level Programming'],
    color: '#A8B9CC',
    description: 'Systems programming',
    lastUsed: '2022',
    icon: 'c',
  },
];
