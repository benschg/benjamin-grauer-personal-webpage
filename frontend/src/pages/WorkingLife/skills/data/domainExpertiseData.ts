interface DomainExpertise {
  name: string;
  description: string;
  category: string;
  experience: string;
  projects: string[];
  color: string;
  icon?: string;
  proficiency?: number;
  isFavorite?: boolean;
}

export const domainExpertise: DomainExpertise[] = [
  {
    name: 'Game Development',
    description:
      'Leadership in game development projects from concept to completion, including team coordination and technical architecture.',
    category: 'Development',
    experience: '15+ years',
    projects: [
      'Orxonox Open-Source Project',
      'Multiplayer Game Networks',
      '3D Game Engines',
      'Team Leadership',
    ],
    color: '#9C27B0',
    icon: 'game',
    proficiency: 95,
    isFavorite: true,
  },
  {
    name: 'Medical Simulation',
    description:
      'Specialized expertise in medical training simulation systems and healthcare technology applications.',
    category: 'Domain Expertise',
    experience: '12+ years',
    projects: [
      'Surgical Training Systems',
      'Medical Instrument Simulation',
      'Healthcare IoT',
      'Clinical Integration',
    ],
    color: '#F44336',
    icon: 'medical',
    proficiency: 92,
    isFavorite: true,
  },
  {
    name: 'Computer Graphics',
    description:
      'Advanced three-dimensional graphics, rendering systems, and interactive visual applications.',
    category: 'Graphics',
    experience: '15+ years',
    projects: [
      'Real-time Rendering',
      '3D Medical Visualization',
      'Custom Graphics Engines',
      'Interactive 3D Web Apps',
    ],
    color: '#E65100',
    icon: '3d',
    proficiency: 90,
    isFavorite: true,
  },
  {
    name: '3D Printing',
    description:
      'Experience with 3D printing technologies and rapid prototyping for product development.',
    category: 'Manufacturing',
    experience: '4+ years',
    projects: [
      'Prototype Development',
      'CAD Model Preparation',
      '3D Print Optimization',
      'Material Selection',
    ],
    color: '#4CAF50',
    icon: 'print3d',
    proficiency: 70,
  },
  {
    name: 'IoT Development',
    description:
      'Connected device development and sensor integration for data collection and monitoring.',
    category: 'Technology',
    experience: '3+ years',
    projects: [
      'Sensor Integration',
      'Data Collection Systems',
      'Device Connectivity',
      'Monitoring Solutions',
    ],
    color: '#2196F3',
    icon: 'iot',
    proficiency: 65,
  },
  {
    name: 'Drone Applications',
    description:
      'Experience with drone technology for aerial photography and data collection applications.',
    category: 'Technology',
    experience: '2+ years',
    projects: ['Aerial Photography', 'Data Collection', 'Flight Planning', 'Image Processing'],
    color: '#FF9800',
    icon: 'drone',
    proficiency: 60,
  },
  {
    name: 'Logistics Software',
    description: 'Development of software solutions for logistics and supply chain management.',
    category: 'Operations',
    experience: '3+ years',
    projects: ['Tracking Systems', 'Inventory Management', 'Route Optimization', 'Data Analytics'],
    color: '#795548',
    icon: 'logistics',
    proficiency: 68,
  },
];
