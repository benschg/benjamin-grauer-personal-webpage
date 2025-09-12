import type { DetailedSkill } from '../BaseSkillCard';

export const technicalTools: DetailedSkill[] = [
  {
    name: 'Development Tools',
    description:
      'Modern development environments, IDEs, and productivity tools for efficient coding.',
    category: 'Tools',
    experience: '10+ years',
    projects: ['VSCode', 'Git/GitHub', 'Docker', 'Postman'],
    color: '#0078D4',
  },
  {
    name: 'DevOps Engineering',
    description: 'Infrastructure automation, monitoring, and deployment pipeline management.',
    category: 'Infrastructure',
    experience: '6+ years',
    projects: ['Kubernetes', 'Terraform', 'Prometheus', 'Grafana'],
    color: '#326CE5',
  },
  {
    name: 'Cloud Development',
    description: 'Cloud-native application development and serverless architectures.',
    category: 'Cloud',
    experience: '5+ years',
    projects: ['AWS Services', 'Serverless', 'Microservices', 'CDN'],
    color: '#FF9900',
  },
  {
    name: '3D & Graphics',
    description:
      'Three-dimensional modeling, animation, and visual effects for interactive applications.',
    category: 'Graphics',
    experience: '4+ years',
    projects: ['Three.js', 'Blender', 'Unity', 'WebGL'],
    color: '#E65100',
  },
  {
    name: 'Systems Management',
    description:
      'Server administration, network configuration, and system performance optimization.',
    category: 'Systems',
    experience: '8+ years',
    projects: ['Linux Admin', 'Nginx', 'Database Tuning', 'Security'],
    color: '#D32F2F',
  },
];
