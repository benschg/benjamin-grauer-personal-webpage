export interface Attribution {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
}

export const attributions: Attribution[] = [
  {
    id: 'nextjs',
    name: 'Next.js',
    description:
      'The React Framework for the Web. Powers this website with server-side rendering, static generation, and the App Router.',
    image: '/attributions/nextjs.svg',
    link: 'https://nextjs.org/',
  },
  {
    id: 'react',
    name: 'React',
    description:
      'A JavaScript library for building user interfaces. The foundation for all interactive components on this site.',
    image: '/attributions/react.svg',
    link: 'https://react.dev/',
  },
  {
    id: 'mui',
    name: 'Material UI',
    description:
      'A comprehensive React component library implementing Material Design. Provides the UI components, theming, and icons used throughout the site.',
    image: '/attributions/mui.svg',
    link: 'https://mui.com/',
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    description:
      'A utility-first CSS framework for rapidly building custom designs. Used for additional styling alongside MUI.',
    image: '/attributions/tailwindcss.svg',
    link: 'https://tailwindcss.com/',
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    description:
      'A production-ready motion library for React. Powers all animations and transitions across the website.',
    image: '/attributions/framer-motion.svg',
    link: 'https://www.framer.com/motion/',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description:
      'A strongly typed programming language that builds on JavaScript. Ensures type safety and better developer experience.',
    image: '/attributions/typescript.svg',
    link: 'https://www.typescriptlang.org/',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description:
      'An open source Firebase alternative. Provides authentication, database, and backend services for the CV system.',
    image: '/attributions/supabase.svg',
    link: 'https://supabase.com/',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description:
      'The platform for frontend developers. Hosts and deploys this website with automatic CI/CD and edge functions.',
    image: '/attributions/vercel.svg',
    link: 'https://vercel.com/',
  },
  {
    id: 'emotion',
    name: 'Emotion',
    description:
      'A performant and flexible CSS-in-JS library. Used by MUI for styling and theming components.',
    image: '/attributions/emotion.png',
    link: 'https://emotion.sh/',
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    description:
      'A Node.js library for controlling headless Chrome. Used for generating PDF exports of the CV.',
    image: '/attributions/puppeteer.svg',
    link: 'https://pptr.dev/',
  },
  {
    id: 'pdf-lib',
    name: 'pdf-lib',
    description:
      'A library for creating and modifying PDF documents. Assists with PDF generation features.',
    image: '/attributions/pdf-lib.svg',
    link: 'https://pdf-lib.js.org/',
  },
  {
    id: 'react-icons',
    name: 'React Icons',
    description:
      'Popular icon packs as React components. Provides additional icons beyond MUI Icons.',
    image: '/attributions/react-icons.svg',
    link: 'https://react-icons.github.io/react-icons/',
  },
  {
    id: 'eslint',
    name: 'ESLint',
    description:
      'A pluggable linting utility for JavaScript and TypeScript. Ensures code quality and consistency.',
    image: '/attributions/eslint.svg',
    link: 'https://eslint.org/',
  },
  {
    id: 'bun',
    name: 'Bun',
    description:
      'An all-in-one JavaScript runtime and toolkit. Used as the package manager for faster installs and scripts.',
    image: '/attributions/bun.svg',
    link: 'https://bun.sh/',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    description:
      'An agentic coding tool by Anthropic. Assisted in building features, writing code, and developing this attributions page.',
    image: '/attributions/claude.svg',
    link: 'https://claude.ai/code',
  },
];
