interface ToolPlatform {
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

export const toolsAndPlatforms: ToolPlatform[] = [
  {
    name: 'Cloud Platforms',
    description:
      'Multi-cloud infrastructure management and deployment across major cloud providers.',
    category: 'Cloud',
    experience: '7+ years',
    projects: [
      'AWS (3+ years at Verity)',
      'Azure (5+ years)',
      'GCP (Google Cloud Platform)',
      'Cloud Architecture & IoT',
    ],
    color: '#FF9900',
    icon: 'cloud',
    proficiency: 85,
    lastUsed: 'Currently using',
    keyFeatures: [
      'AWS EC2/Lambda',
      'Azure DevOps',
      'Google Cloud Functions',
      'Infrastructure as Code',
    ],
    isFavorite: true,
  },
  {
    name: 'DevOps & CI/CD Tools',
    description:
      'Infrastructure automation, continuous integration, and deployment pipeline management.',
    category: 'DevOps',
    experience: '7+ years',
    projects: [
      'Jenkins (7 years)',
      'Azure DevOps (2 years)',
      'GitHub Actions',
      'Vercel Deployment',
    ],
    color: '#326CE5',
    icon: 'devops',
    proficiency: 88,
    lastUsed: 'Currently using',
    keyFeatures: ['Jenkins Pipelines', 'GitHub Actions', 'Azure DevOps', 'Automated Deployment'],
    isFavorite: true,
  },
  {
    name: 'Development Admin',
    description: 'Expert-level administration of development tools and source control systems.',
    category: 'Administration',
    experience: '15+ years',
    projects: [
      'Jira/Confluence/Bitbucket Admin',
      'GitHub/GitLab/BitBucket (expert)',
      'Azure Active Directory',
      'Team Workflow Setup',
    ],
    color: '#0078D4',
    icon: 'admin',
    proficiency: 92,
    lastUsed: 'Currently using',
    keyFeatures: ['Jira Administration', 'Git Management', 'Team Workflows', 'Access Control'],
    isFavorite: true,
  },
  {
    name: '3D & Creative Tools',
    description:
      'Professional 3D modeling, rendering, and creative software for visualization projects.',
    category: 'Creative',
    experience: '10+ years',
    projects: ['Blender/Maya', 'Unity/Unreal Engine', 'DaVinci Resolve', 'Custom 3D Pipelines'],
    color: '#E65100',
    icon: '3d',
    proficiency: 80,
    lastUsed: 'Currently using',
    keyFeatures: ['3D Modeling', 'Game Engines', 'Video Editing', 'Rendering Pipelines'],
  },
  {
    name: 'Systems Management',
    description: 'Cross-platform system administration and infrastructure management.',
    category: 'Systems',
    experience: '15+ years',
    projects: [
      'Windows/Active Directory',
      'Linux Server infrastructure',
      'macOS/OSX Administration',
      'Network Configuration',
    ],
    color: '#D32F2F',
    icon: 'systems',
    proficiency: 85,
    lastUsed: 'Currently using',
    keyFeatures: [
      'Windows Server',
      'Linux Administration',
      'Network Management',
      'Security Configuration',
    ],
  },
  {
    name: 'Development Tools',
    description: 'Modern IDEs and development environments with containerization.',
    category: 'IDE',
    experience: '18+ years',
    projects: [
      'VS Code (3 years)',
      'Visual Studio (15 years)',
      'Docker (2 years)',
      'Development Workflow',
    ],
    color: '#4285F4',
    icon: 'ide',
    proficiency: 95,
    lastUsed: 'Currently using',
    keyFeatures: ['Visual Studio', 'VS Code', 'Docker Containers', 'Development Environments'],
    isFavorite: true,
  },
  {
    name: 'Data Analytics & BI',
    description: 'Business intelligence, data visualization, and analytics reporting tools.',
    category: 'Analytics',
    experience: '8+ years',
    projects: [
      'Power BI',
      'SQL & Document DBs',
      'Data Analytics Dashboards',
      'Performance Metrics',
    ],
    color: '#F2C811',
    icon: 'analytics',
    proficiency: 75,
    lastUsed: 'Currently using',
    keyFeatures: ['Power BI', 'Data Visualization', 'SQL Databases', 'Business Intelligence'],
  },
  {
    name: 'Productivity Tools',
    description: 'Comprehensive productivity and collaboration tools for business communication.',
    category: 'Productivity',
    experience: '12+ years',
    projects: [
      'Microsoft Office Suite (6 years)',
      'Google Workspace (12 years)',
      'Business Presentations',
      'Documentation Systems',
    ],
    color: '#34A853',
    icon: 'productivity',
    proficiency: 90,
    lastUsed: 'Currently using',
    keyFeatures: ['Office Suite', 'Google Workspace', 'Documentation', 'Collaboration'],
  },
];
