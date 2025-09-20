export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category:
    | 'Web Development'
    | 'Game Development'
    | '3D Graphics'
    | 'Medical Software'
    | 'IoT & Hardware'
    | 'Open Source';
  technologies: string[];
  features?: string[];
  role: string;
  year: string;
  duration?: string;
  status: 'Completed' | 'In Progress' | 'Archived';
  links?: {
    live?: string;
    github?: string;
    demo?: string;
    documentation?: string;
  };
  images?: {
    thumbnail: string;
    gallery?: string[];
  };
  highlights?: string[];
  teamSize?: number;
  impact?: string;
  featured?: boolean;
}

export const portfolioProjects: Project[] = [
  {
    id: 'virtamed-simulators',
    title: 'VirtaMed Medical Simulators',
    description:
      'High-fidelity surgical training simulators combining advanced 3D graphics with haptic feedback for medical education.',
    longDescription:
      'Led development of medical training simulators used in hospitals and medical schools worldwide. Integrated real-time 3D visualization, physics simulation, and haptic feedback to create realistic surgical training experiences.',
    category: 'Medical Software',
    technologies: ['C++', 'C#', '.NET', 'OpenGL', 'CUDA', 'Qt', 'Unity'],
    features: [
      'Real-time 3D visualization',
      'Haptic feedback integration',
      'Physics simulation',
      'Performance analytics',
      'Multi-platform support',
    ],
    role: 'Lead Software Engineer',
    year: '2012-2024',
    duration: '12+ years',
    status: 'Completed',
    highlights: [
      'Used in 100+ medical institutions globally',
      'Trained 10,000+ medical professionals',
      'Reduced training costs by 60%',
    ],
    teamSize: 15,
    impact: 'Revolutionized medical training by providing risk-free, repeatable surgical practice',
    featured: true,
  },
  {
    id: 'orxonox-game',
    title: 'Orxonox - Open Source Game',
    description:
      'Co-founded and led development of an open-source 3D space shooter game built from scratch.',
    longDescription:
      'Started as a university project at ETH Zurich, Orxonox evolved into a full-featured game engine and space shooter. Led a team of 30+ contributors over multiple years, implementing core engine systems and gameplay mechanics.',
    category: 'Game Development',
    technologies: ['C++', 'OpenGL', 'Lua', 'CEGUI', 'Ogre3D', 'Bullet Physics'],
    features: [
      'Custom game engine',
      'Multiplayer networking',
      'Physics simulation',
      'Scripting system',
      'Level editor',
    ],
    role: 'Co-Founder & Lead Developer',
    year: '2007-2012',
    duration: '5 years',
    status: 'Completed',
    links: {
      github: 'https://github.com/orxonox',
      documentation: 'https://www.orxonox.net',
    },
    highlights: [
      'Led team of 30+ contributors',
      'Won ETH Game Programming Lab award',
      '50,000+ lines of code',
    ],
    teamSize: 30,
    impact: 'Educational platform for game development and computer graphics',
    featured: true,
  },
  {
    id: 'personal-website',
    title: 'Personal Portfolio Website',
    description:
      'Modern, responsive portfolio website built with React and TypeScript showcasing professional work and personal projects.',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Material-UI', 'Vite', 'Firebase'],
    features: [
      'Responsive design',
      'Interactive timeline',
      'Dark theme',
      'Performance optimized',
      'SEO friendly',
    ],
    role: 'Full Stack Developer',
    year: '2024',
    status: 'In Progress',
    links: {
      live: 'https://benjamin-grauer.com',
      github: 'https://github.com/bgrauer',
    },
    featured: false,
  },
  {
    id: 'verity-cloud-platform',
    title: 'Verity Cloud Platform',
    description:
      'Enterprise cloud platform for drone data management and analytics with real-time processing capabilities.',
    longDescription:
      'Developed cloud infrastructure for processing and analyzing drone-captured inventory data. Built scalable microservices handling millions of data points daily.',
    category: 'Web Development',
    technologies: ['TypeScript', 'React', 'Node.js', 'Docker', 'Kubernetes', 'PostgreSQL'],
    features: [
      'Real-time data processing',
      'Interactive 3D visualizations',
      'Automated reporting',
      'RESTful APIs',
      'Role-based access control',
    ],
    role: 'Senior Software Engineer',
    year: '2020-2022',
    duration: '2 years',
    status: 'Completed',
    highlights: [
      'Processed 10M+ data points daily',
      'Reduced inventory counting time by 90%',
      'Deployed across 50+ warehouses',
    ],
    teamSize: 8,
    impact: 'Transformed warehouse inventory management through autonomous drone technology',
    featured: true,
  },
  {
    id: '3d-visualization-tools',
    title: '3D Web Visualization Tools',
    description:
      'Interactive 3D visualization components for web applications using WebGL and Three.js.',
    category: '3D Graphics',
    technologies: ['Three.js', 'WebGL', 'TypeScript', 'React', 'GLSL'],
    features: [
      'Custom shaders',
      'Performance optimization',
      'Mobile support',
      'VR/AR capabilities',
    ],
    role: 'Graphics Developer',
    year: '2018-2024',
    status: 'Completed',
    highlights: [
      'Sub-16ms frame times',
      'Cross-platform compatibility',
      'Used in production applications',
    ],
    featured: false,
  },
  {
    id: 'iot-sensor-platform',
    title: 'IoT Sensor Integration Platform',
    description:
      'Platform for collecting and analyzing data from distributed IoT sensors in industrial settings.',
    category: 'IoT & Hardware',
    technologies: ['Python', 'C++', 'MQTT', 'InfluxDB', 'Grafana', 'Docker'],
    features: [
      'Real-time data streaming',
      'Predictive analytics',
      'Alert system',
      'Dashboard visualization',
    ],
    role: 'Technical Lead',
    year: '2019',
    duration: '8 months',
    status: 'Completed',
    highlights: [
      'Monitored 500+ sensors',
      'Prevented equipment failures',
      'Reduced downtime by 40%',
    ],
    teamSize: 4,
    featured: false,
  },
  {
    id: 'game-engine-contributions',
    title: 'Game Engine Contributions',
    description: 'Contributions to various open-source game engines and graphics libraries.',
    category: 'Open Source',
    technologies: ['C++', 'OpenGL', 'Vulkan', 'DirectX'],
    features: [
      'Performance optimizations',
      'Bug fixes',
      'Feature implementations',
      'Documentation improvements',
    ],
    role: 'Contributor',
    year: '2008-2023',
    status: 'Completed',
    links: {
      github: 'https://github.com/bgrauer',
    },
    highlights: ['Multiple merged PRs', 'Performance improvements', 'Community recognition'],
    featured: false,
  },
  {
    id: '3d-printing-automation',
    title: '3D Printing Automation Tools',
    description: 'Automated workflow tools for 3D printing preparation and optimization.',
    category: 'IoT & Hardware',
    technologies: ['Python', 'OpenSCAD', 'Blender API', 'G-code'],
    features: [
      'Automated slicing',
      'Print time optimization',
      'Material calculation',
      'Quality analysis',
    ],
    role: 'Developer',
    year: '2020-2021',
    status: 'Completed',
    highlights: [
      'Reduced preparation time by 70%',
      'Improved print success rate',
      'Cost optimization',
    ],
    featured: false,
  },
  {
    id: 'arts-and-crafts-gallery',
    title: 'Arts & Crafts Portfolio',
    description:
      'Personal collection of digital art, paintings, and handmade crafts showcasing creative exploration.',
    longDescription:
      'A diverse collection of artistic works including digital paintings, mixed media compositions, abstract art, and ceramic crafts. This portfolio represents creative exploration alongside technical work, featuring cosmic themes, abstract compositions, and traditional craftsmanship.',
    category: 'Open Source',
    technologies: ['Digital Art', 'Mixed Media', 'Ceramics', 'Photography'],
    features: [
      'Digital paintings and illustrations',
      'Abstract and cosmic artwork',
      'Ceramic and pottery work',
      'Mixed media compositions',
      'Creative photography',
    ],
    role: 'Artist & Creator',
    year: '2020-2024',
    status: 'Completed',
    highlights: [
      '27+ artistic works',
      'Multiple mediums explored',
      'Featured cosmic and abstract themes',
      'Handmade ceramic pieces',
    ],
    impact: 'Demonstrates creative versatility and artistic expression beyond technical work',
    featured: true,
  },
];

// Helper function to get all unique technologies
export const getAllTechnologies = (): string[] => {
  const techSet = new Set<string>();
  portfolioProjects.forEach((project) => {
    project.technologies.forEach((tech) => techSet.add(tech));
  });
  return Array.from(techSet).sort();
};

// Helper function to get all categories
export const getCategories = (): string[] => {
  const categories = new Set<string>();
  portfolioProjects.forEach((project) => {
    categories.add(project.category);
  });
  return Array.from(categories).sort();
};

// Helper function to filter projects
export const filterProjects = (
  projects: Project[],
  category?: string,
  technology?: string,
  status?: string
): Project[] => {
  return projects.filter((project) => {
    if (category && project.category !== category) return false;
    if (technology && !project.technologies.includes(technology)) return false;
    if (status && project.status !== status) return false;
    return true;
  });
};
