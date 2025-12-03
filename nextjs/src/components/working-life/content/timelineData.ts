export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  shortDescription?: string; // Short, punchy summary for CV functions section
  type: 'work' | 'education' | 'certification' | 'project' | 'personal';
  skills?: string[];
  achievements?: string[];
  image?: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: '2023-verity',
    year: '2023-2025',
    title: 'Head of Applications and Frameworks',
    company: 'Verity AG',
    description:
      'Member of a team of 5 dev heads responsible for leading 70+ engineers across the software organization. Focused on leveling up user experience and simplicity of applications throughout the entire product lifecycle and streamlining teams toward client-oriented impact. Successfully spearheaded value-stream aligned teams and transformed 30 CLI tools into one intuitive web application for rollout. Championed cross-functional collaboration between hardware, firmware, and software teams to deliver integrated drone logistics solutions. Established skills hubs fostering knowledge sharing and professional growth across the organization.',
    shortDescription: 'Led 70+ engineers across the software organization. Unified 30 CLI tools into one intuitive web app. Championed cross-functional collaboration between hardware, firmware, and software teams. Established skills hubs fostering knowledge sharing across the organization.',
    type: 'work',
    skills: [
      'AWS',
      'React/TypeScript',
      'Python',
      'Value-Stream Teams',
      'UX/3D Visualization',
      'Skills Hubs Leadership',
      'Drone & Robotics Tech',
      'Logistics',
    ],
    achievements: [
      'Initiated value stream-oriented development with lean agile cross-functional/full stack teams',
      'Introduced product managers in each value-stream team',
      'Led skills hubs to build up knowledge sharing groups',
      'Redefined UX standards with engaging 3D visualizations improving the ease of use of the system',
      'Transformed stack of 30 CLI and mixed technology tools into one intuitive single page web application',
    ],
    image: '/working-life/verity-1024x496.webp',
  },
  {
    id: '2021-9tlabs',
    year: '2021-2023',
    title: 'Head of Software',
    company: '9T Labs AG',
    description:
      'Software Lead for CAD Solutions, Cloud App Development, Architecture, DevOps and IT Services. Responsible for planning and development of fibirfy Production cloud platform and fibirfy Design Suite 3D manufacturing design tool. Improved workflows from team collaboration to planning tools, retrospectives, and managed service integrations. Built and mentored a team of software engineers from scratch, establishing coding standards and development practices. Drove the adoption of modern DevOps practices including CI/CD pipelines, infrastructure as code, and automated testing. Collaborated closely with mechanical engineers and material scientists to translate complex manufacturing requirements into intuitive software solutions.',
    shortDescription: 'Built fibirfy Production cloud platform and fibirfy Design Suite for carbon fiber manufacturing. Mentored a team of software engineers from scratch, establishing coding standards and DevOps practices including CI/CD pipelines. Collaborated with mechanical engineers and material scientists to translate complex requirements into intuitive solutions.',
    type: 'work',
    skills: [
      'Cloud Platform Development',
      'CAD Solutions',
      '3D Manufacturing',
      'DevOps',
      'IT Infrastructure',
      'Product Management',
      'Additive Manufacturing',
    ],
    achievements: [
      'Built fibirfy Production cloud platform',
      'Developed fibirfy Design Suite for 3D manufacturing',
      'Implemented DevOps automation for multiple teams',
      'Managed IT infrastructure and SAAS integrations',
      'Coached young developers in software engineering best practices',
    ],
    image: '/working-life/9TLabs_logo-white2x.png',
  },
  {
    id: '2019-shiftup',
    year: '2019',
    title: 'Shift-up Business Agility and Innovation Leader Workshop',
    company: 'Professional Development',
    description:
      'Certificate in Leading Digital Transformation. Sparked interest in business ideas and agile models.',
    type: 'certification',
    skills: ['Digital Transformation', 'Business Agility', 'Innovation Leadership', 'Agile Models'],
    achievements: [
      'Digital transformation expertise',
      'Business agility knowledge',
      'Innovation leadership skills',
    ],
  },
  {
    id: '2017-head-data',
    year: '2017-2020',
    title: 'Head of Data Services',
    company: 'VirtaMed AG',
    description:
      "Entrusted with development lead of VirtaMed's data services, aiming to interconnect simulators globally, manage updates remotely, and store training results in centralized databases in strict compliance with data protection regulations. Managed digitalization IoT project with nearshoring team. Designed and implemented a cloud-native architecture enabling real-time monitoring of simulator health and usage analytics across hospitals worldwide. Led the evaluation and establishment of nearshoring partnerships within the EU, successfully integrating remote teams into the development workflow. Created comprehensive Power BI dashboards providing actionable insights for sales, support, and product development teams.",
    shortDescription: 'Connected global simulator fleet to cloud with GDPR-compliant IoT platform. Designed cloud-native architecture for real-time monitoring of simulator health and usage analytics across hospitals worldwide. Led nearshoring partnerships within the EU and created Power BI dashboards providing actionable insights for sales, support, and product teams.',
    type: 'work',
    skills: [
      'Cloud & IoT Technologies',
      'Near-shoring Management',
      'GDPR Compliance',
      'Data Analytics',
      'Power-BI',
      'Remote Fleet Management',
      'Multi-language Deployment',
    ],
    achievements: [
      'Evaluated and established near-shoring partnerships within EU',
      'Unified deployment pipeline across all products',
      'Implemented GDPR compliant data management system',
      'Created comprehensive data analytics dashboards',
      'Enabled remote management of global simulator fleet',
      'All standard products now communicate with cloud',
    ],
  },
  {
    id: '2017-ireb',
    year: '2017',
    title: 'IREB (Requirements Engineer)',
    company: 'Zühlke',
    description:
      'Requirements engineering certification focused on systematic approach to software specifications.',
    type: 'certification',
    skills: [
      'Requirements Engineering',
      'Business Analysis',
      'System Design',
      'Software Specifications',
    ],
    achievements: ['Requirements engineering expertise', 'Systematic specification approach'],
  },
  {
    id: '2016-father',
    year: '2016',
    title: 'Became a Father',
    company: 'Family Life',
    description:
      'Son Arthur Isidor Faehndrich born. Life-changing experience bringing new perspective on priorities.',
    type: 'personal',
    skills: ['Time Management', 'Prioritization', 'Patience', 'Work-Life Balance'],
    achievements: [
      'Gained new life perspective',
      'Enhanced time management',
      'Work-life balance mastery',
    ],
    image: '/working-life/ben-and-arthur.webp',
  },
  {
    id: '2016-management3',
    year: '2016',
    title: 'Management 3.0',
    company: 'Pragmatic Solutions',
    description:
      'Gained insights into scalable team organizations. Helped reshape development team structure.',
    type: 'certification',
    skills: ['Team Organization', 'Scalable Management', 'Team Structure', 'Modern Leadership'],
    achievements: [
      'Reshaped team structure',
      'Scalable organization insights',
      'Enhanced team management',
    ],
    image: '/working-life/mgt3.0.jpg',
  },
  {
    id: '2012-scrum',
    year: '2012',
    title: 'Certified Scrum Master',
    company: 'The Knowledge Hut',
    description: 'Focused on automation, testing procedures, and meeting optimization.',
    type: 'certification',
    skills: [
      'Scrum Methodology',
      'Process Automation',
      'Testing Procedures',
      'Meeting Optimization',
    ],
    achievements: [
      'Implemented automation',
      'Optimized testing procedures',
      'Improved meeting efficiency',
    ],
    image: '/working-life/Scrum_Pic-1024x782.webp',
  },
  {
    id: '2012-leading-applied',
    year: '2012',
    title: '"Leading applied" Management Course',
    company: 'Rudolf Obrecht AG',
    description:
      'Management course focusing on applied leadership techniques and practical management skills.',
    type: 'certification',
    skills: [
      'Applied Leadership',
      'Management Techniques',
      'Practical Leadership',
      'Team Development',
    ],
    achievements: ['Applied leadership skills', 'Practical management expertise'],
    image: '/working-life/rudolf-obrecht.png',
  },
  {
    id: '2011-eng-manager',
    year: '2011-2017',
    title: 'Engineering Manager',
    company: 'VirtaMed AG',
    description:
      'As member of management, built up several teams across R&D department. Re-organized entire development team along value stream. Led more than 20 people and helped hire many more throughout the company. Built teams for framework developers, testers, dev-ops engineers, UI/UX professionals.',
    shortDescription: 'Built and led 20+ engineers across framework, QA, DevOps, and UI/UX teams.',
    type: 'work',
    skills: [
      'Engineering Management',
      'Value Stream Organization',
      'Framework Design',
      'Team Building',
      'DevOps Infrastructure',
      'UI/UX Team Leadership',
      'IT Management',
    ],
    achievements: [
      'Built and led teams of 20+ engineers',
      'Established manual testing team integrated into all teams',
      'Built gameplay development team with 3D artists and researchers',
      'Created DevOps/deployment infrastructure with team of three',
      'Expanded UI/UX team to four people for customization needs',
      'Managed company IT infrastructure and crucial services',
    ],
  },
  {
    id: '2008-software-eng',
    year: '2008-2011',
    title: 'Software Engineer',
    company: 'VirtaMed AG',
    description:
      'Expanded doctorate thesis framework to enable ease of use for modelers and non-technically experienced people. Ported multi-threaded application to Windows, built versatile interface for parsing models, animations, and scripts.',
    shortDescription: 'Developed core 3D medical simulation framework in C++, C#, and Python.',
    type: 'work',
    skills: [
      'C++',
      'C#',
      'Python',
      'Qt',
      'WPF',
      'Multi-threading',
      'Framework Development',
      'UI/UX Development',
    ],
    achievements: [
      'Ported multi-threaded application to Windows',
      'Built versatile scripting and parsing interface',
      'Crafted first UI using Qt and later WPF',
      'Defined coding guidelines for C++, C#, and Python',
    ],
  },
  {
    id: '2007-masters-thesis',
    year: '2007',
    title: 'Masters Thesis',
    company: 'Surgical Planning Lab, Harvard Medical School, Boston',
    description:
      'GPGPU Accelerated Volume Renderer for surgical guidance. Advanced research in medical technology.',
    type: 'education',
    skills: ['GPGPU Programming', 'Volume Rendering', 'Medical Technology', 'Surgical Guidance'],
    achievements: ['Advanced medical research', 'GPGPU expertise', 'Surgical guidance innovation'],
  },
  {
    id: '2007-internship',
    year: '2007',
    title: 'Software Developer Internship',
    company: 'Cymicon, New Zealand',
    description:
      'International internship experience in software development, gaining global perspective.',
    shortDescription: 'International software development experience.',
    type: 'work',
    skills: [
      'Software Development',
      'International Experience',
      'Cross-cultural Communication',
      'Adaptation',
    ],
    achievements: ['International work experience', 'Global perspective', 'Cross-cultural skills'],
  },
  {
    id: '2006-semester-thesis',
    year: '2006',
    title: 'Semester Thesis: "Scalable Multiplayer Game Networks"',
    company: 'ETH Zürich',
    description:
      'Research on network architecture and scalability solutions for multiplayer gaming systems.',
    type: 'project',
    skills: ['Network Architecture', 'Game Development', 'Scalability', 'Research Methodology'],
    achievements: [
      'Network scalability research',
      'Gaming architecture expertise',
      'Academic excellence',
    ],
  },
  {
    id: '2004-orxonox',
    year: '2004',
    title: 'Inventor/Lead of Open Source Project "Orxonox"',
    company: 'ETH Zürich',
    description:
      'Developed learning platform for electrical engineers. Founded and led open-source 3D game engine development.',
    type: 'project',
    skills: [
      'Open Source Development',
      '3D Engine Development',
      'Educational Platforms',
      'Project Leadership',
    ],
    achievements: [
      'Created educational platform',
      'Led open-source community',
      'Innovative learning tools',
    ],
    image: '/working-life/orxonoxfighter-inside-small.jpg',
  },
  {
    id: '2001-education',
    year: '2001-2008',
    title: 'Masters in Information Technology and Electrical Engineering',
    company: 'ETH Zürich',
    description:
      'Federal Institute of Science (ETHZ) Grade 5.13, 5.81 in study project work. Comprehensive education combining information technology and electrical engineering disciplines.',
    type: 'education',
    skills: [
      'Information Technology',
      'Electrical Engineering',
      'Computer Science',
      'Systems Engineering',
    ],
    achievements: [
      'Masters degree from ETH Zürich',
      'Grade 5.13 overall, 5.81 in project work',
      'Strong technical foundation in IT and EE',
    ],
  },
  {
    id: '1980-birth',
    year: '1980',
    title: 'Born',
    company: 'Personal Milestone',
    description: 'Born in April - the beginning of the journey.',
    type: 'personal',
    skills: [],
    achievements: ['Life begins'],
  },
];
