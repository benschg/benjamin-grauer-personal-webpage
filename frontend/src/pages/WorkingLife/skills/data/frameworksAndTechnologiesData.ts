interface FrameworkTechnology {
  name: string;
  proficiency: number; // 0-100
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

export const frameworksAndTechnologies: FrameworkTechnology[] = [
  {
    name: 'React',
    proficiency: 90,
    experience: '6+ years',
    category: 'Frontend',
    primaryProjects: ['Single Page Apps', 'Component Libraries', 'Hooks', 'State Management'],
    color: '#61DAFB',
    description:
      'Modern frontend development with React ecosystem and component-based architecture',
    lastUsed: 'Currently using',
    keyFeatures: ['Hooks', 'Context API', 'Redux', 'React Router'],
    complexity: 'Advanced',
    isFavorite: true,
    icon: 'react',
  },
  {
    name: '.NET',
    proficiency: 95,
    experience: '15+ years',
    category: 'Backend',
    primaryProjects: ['Enterprise Apps', 'Web APIs', 'Desktop Applications', '.Net-3D'],
    color: '#512BD4',
    description: 'Enterprise application development with .NET framework and C# programming',
    lastUsed: 'Currently using',
    keyFeatures: ['ASP.NET Core', 'Entity Framework', 'Web API', 'Blazor'],
    complexity: 'Expert',
    isFavorite: true,
    icon: 'dotnet',
  },
  {
    name: 'Angular',
    proficiency: 80,
    experience: '5+ years',
    category: 'Frontend',
    primaryProjects: ['Web Applications', 'TypeScript', 'RxJS', 'Material Design'],
    color: '#DD0031',
    description: 'Component-based web applications with TypeScript and Angular ecosystem',
    lastUsed: '2023',
    keyFeatures: ['TypeScript', 'RxJS', 'Angular CLI', 'Material'],
    complexity: 'Advanced',
    icon: 'angular',
  },
  {
    name: 'Three.js & WebGL',
    proficiency: 85,
    experience: '6+ years',
    category: '3D/Graphics',
    primaryProjects: ['3D Visualizations', 'WebGL Shaders', 'Interactive Graphics', 'Browser 3D'],
    color: '#000000',
    description: '3D web graphics, interactive visualizations, and browser-based 3D applications',
    lastUsed: 'Currently using',
    keyFeatures: ['WebGL Shaders', 'PBR Rendering', '3D Physics', 'VR/AR'],
    complexity: 'Expert',
    isFavorite: true,
    icon: 'threejs',
  },
  {
    name: 'Blender',
    proficiency: 75,
    experience: '5+ years',
    category: '3D/Graphics',
    primaryProjects: ['3D Modeling', 'Animation', 'Rendering', 'Asset Creation'],
    color: '#E87D0D',
    description:
      'Professional 3D creation suite for modeling, animation, rendering, and visual effects',
    lastUsed: 'Currently using',
    keyFeatures: ['Modeling', 'Sculpting', 'Animation', 'Cycles Rendering'],
    complexity: 'Advanced',
    icon: 'blender',
  },
  {
    name: 'Qt/WPF',
    proficiency: 88,
    experience: '12+ years',
    category: 'Desktop',
    primaryProjects: [
      'Desktop Applications',
      'Medical Simulation UI',
      'Cross-platform UI',
      'Custom Controls',
    ],
    color: '#41CD52',
    description: 'Cross-platform desktop application UI development with Qt and WPF',
    lastUsed: 'Currently using',
    keyFeatures: ['MVVM', 'Custom Controls', 'Data Binding', 'Cross-platform'],
    complexity: 'Expert',
    isFavorite: true,
    icon: 'desktop',
  },
  {
    name: 'CUDA/GPU Computing',
    proficiency: 82,
    experience: '8+ years',
    category: 'High Performance',
    primaryProjects: [
      'Volume Rendering',
      'Real-time Graphics',
      'Medical Imaging',
      'Scientific Computing',
    ],
    color: '#76B900',
    description:
      'High-performance GPU computing and parallel processing for graphics and scientific applications',
    lastUsed: '2023',
    keyFeatures: [
      'Parallel Computing',
      'Memory Optimization',
      'Kernel Programming',
      'Graphics Pipeline',
    ],
    complexity: 'Expert',
    icon: 'gpu',
  },
  {
    name: 'Docker',
    proficiency: 78,
    experience: '5+ years',
    category: 'DevOps',
    primaryProjects: [
      'Container Deployment',
      'Microservices Architecture',
      'Development Environments',
      'CI/CD',
    ],
    color: '#2496ED',
    description: 'Application containerization and deployment using Docker and orchestration tools',
    lastUsed: 'Currently using',
    keyFeatures: ['Containerization', 'Multi-stage Builds', 'Docker Compose', 'Orchestration'],
    complexity: 'Intermediate',
    icon: 'docker',
  },
];
