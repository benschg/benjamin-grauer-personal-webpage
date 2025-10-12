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
    | 'Open Source'
    | 'Creative';
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
    year: '2009-2020',
    duration: '11 years',
    status: 'Completed',
    images: {
      thumbnail: '/portfolio/projects/virtamed-simulator.webp',
      gallery: [],
    },
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
    images: {
      thumbnail: '/portfolio/projects/verity-cloud.png',
      gallery: [],
    },
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
    images: {
      thumbnail: '/portfolio/projects/orxonox-game.jpg',
      gallery: [],
    },
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
    id: 'arts-and-crafts-gallery',
    title: 'Arts & Crafts Portfolio',
    description:
      'Personal collection of digital art, paintings, and handmade crafts showcasing creative exploration.',
    longDescription:
      'A diverse collection of artistic works including digital paintings, mixed media compositions, abstract art, and ceramic crafts. This portfolio represents creative exploration alongside technical work, featuring cosmic themes, abstract compositions, and traditional craftsmanship.',
    category: 'Creative',
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
    images: {
      thumbnail: '/portfolio/arts-and-crafts/jupiter.jpg',
      gallery: [],
    },
    highlights: [
      '27+ artistic works',
      'Multiple mediums explored',
      'Featured cosmic and abstract themes',
      'Handmade ceramic pieces',
    ],
    impact: 'Demonstrates creative versatility and artistic expression beyond technical work',
    featured: true,
  },
  {
    id: 'mosaic-studio',
    title: 'AI Mosaic Studio',
    description:
      'AI-powered mosaic creation tool for generating artistic mosaic images from photos.',
    longDescription:
      'AI Mosaic Studio is a web-based application that transforms regular photos into beautiful mosaic artworks using artificial intelligence. The tool provides an intuitive interface for creating customized mosaic effects, allowing users to adjust parameters and generate unique artistic interpretations of their images.',
    category: 'Web Development',
    technologies: ['AI/ML', 'Web Technologies', 'Image Processing'],
    features: [
      'AI-powered mosaic generation',
      'Photo-to-mosaic transformation',
      'Customizable mosaic parameters',
      'Web-based interface',
      'Real-time preview',
    ],
    role: 'Developer',
    year: '2025',
    status: 'Completed',
    images: {
      thumbnail: '/portfolio/projects/mosaic-studio.jpg',
      gallery: [],
    },
    links: {
      live: 'https://mosaic-studio.0verall.com/',
    },
    highlights: [
      'AI-powered image processing',
      'Intuitive web interface',
      'Real-time mosaic generation',
    ],
    impact: 'Provides an accessible tool for creating artistic mosaic effects from photos',
    featured: false,
  },
  {
    id: 'glyphic',
    title: 'Glyphic - Font Creation Tool',
    description:
      'Web-based, touch-first font creation tool for designing custom fonts on any device with complete privacy and offline support.',
    longDescription:
      'Glyphic is a modern web application that makes font creation accessible to everyone. Built with a touch-first approach, it allows users to create custom fonts using drawing tools optimized for touch screens, tablets, and traditional computers. Developed collaboratively with Claude AI in just 2 days, this project showcases rapid modern web development. All data is stored locally in the browser, ensuring complete privacy with no server uploads, tracking, or cookies. The tool features an intuitive interface with reference image tracing, visual guidelines, and automatic saving.',
    category: 'Web Development',
    technologies: ['Next.js 14', 'TypeScript', 'Bun', 'opentype.js', 'HTML5 Canvas', 'CSS Modules'],
    features: [
      'Touch and pen-optimized drawing interface',
      'Multiple drawing tools (freehand, straight lines, points)',
      'Reference image tracing support',
      'Visual drawing guidelines',
      'Character grid management',
      'Dark mode support',
      'Auto-save functionality',
      'Export fonts as TTF format',
      'Complete offline functionality',
      'Local-only data storage (no server)',
    ],
    role: 'Creator & Developer',
    year: '2025',
    duration: '2 days',
    status: 'Completed',
    images: {
      thumbnail: '/portfolio/projects/glyphic.png',
      gallery: [],
    },
    links: {
      live: 'https://glyphic.benjamingrauer.ch',
      github: 'https://github.com/benschg/glyphic',
    },
    highlights: [
      'Built in 2 days with Claude AI assistance',
      'Privacy-first: 100% local data storage',
      'GDPR compliant with no tracking',
      'Touch-optimized for modern devices',
      'MIT licensed open source',
    ],
    impact: 'Makes font creation accessible to everyone with a focus on privacy and ease of use',
    featured: true,
  },
  {
    id: 'binary-watchface',
    title: 'Binary Watchface for Garmin',
    description:
      'Custom binary time display watch face for Garmin smartwatches, designed collaboratively with my brother Daniel.',
    longDescription:
      'A unique watch face that displays time in binary format for Garmin smartwatches. This project combines functional design with a geeky aesthetic, allowing users to read time in binary notation. Built as a collaborative project showcasing both technical skills and creative design.',
    category: 'IoT & Hardware',
    technologies: ['Monkey C', 'Garmin SDK', 'ConnectIQ'],
    features: [
      'Binary time display',
      'Optimized for Garmin Fenix series',
      'Low battery consumption',
      'Clean minimalist design',
      'Available on Garmin App Store',
    ],
    role: 'Co-Developer',
    year: '2016',
    duration: '3 months',
    status: 'Completed',
    images: {
      thumbnail: '/portfolio/projects/binary-watchface.png',
      gallery: [],
    },
    links: {
      github: 'https://github.com/kromar/garmin_fenix3',
      live: 'https://apps.garmin.com/de-DE/apps/80e17ad5-5892-4ed9-94f0-3a2c732aec87',
    },
    highlights: [
      'Published on Garmin Connect IQ Store',
      'Collaborative family project',
      'Custom binary time algorithm',
    ],
    teamSize: 2,
    impact: 'Created a unique way to display time for Garmin smartwatch enthusiasts',
    featured: false,
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
    year: '2024-2025',
    status: 'In Progress',
    images: {
      thumbnail: '/portfolio/projects/personal-website.png',
      gallery: [],
    },
    links: {
      live: 'https://benjamin-grauer.com',
      github: 'https://github.com/benschg/benjamin-grauer-personal-webpage',
    },
    featured: false,
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
