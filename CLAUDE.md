# Benjamin Grauer Personal Website - React/TypeScript Architecture

## Tech Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Yarn** for package management
- **Material-UI (MUI)** for component library and theming
- **Firebase** for hosting and backend services
- **Framer Motion** for animations

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout/
│   │   │   ├── Navigation/
│   │   │   ├── Footer/
│   │   │   └── UI/ (buttons, cards, etc.)
│   │   ├── personal-life/
│   │   │   ├── PersonalHero/
│   │   │   ├── LifeStory/
│   │   │   ├── Hobbies/
│   │   │   └── PersonalGallery/
│   │   ├── working-life/
│   │   │   ├── ProfessionalHero/
│   │   │   ├── Timeline/ ⭐ INTERACTIVE TIMELINE
│   │   │   ├── Skills/
│   │   │   ├── Documents/
│   │   │   └── Achievements/
│   │   └── portfolio/
│   │       ├── ProjectGrid/
│   │       ├── ProjectFilter/
│   │       ├── ProjectCard/
│   │       └── ProjectDetail/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── PersonalLife.tsx
│   │   ├── WorkingLife.tsx
│   │   └── Portfolio.tsx
│   ├── data/
│   │   ├── timeline-data.ts
│   │   ├── projects-data.ts
│   │   ├── skills-data.ts
│   │   └── personal-data.ts
│   ├── types/
│   │   ├── timeline.ts
│   │   ├── project.ts
│   │   └── common.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── components/
│   └── utils/
│       ├── firebase.ts
│       └── helpers.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── firebase.json
```

## Interactive Timeline Features

### Timeline Component Enhancements:
- **Animated Timeline**: Scroll-triggered animations as timeline items come into view
- **Interactive Dots**: Clickable timeline nodes with hover effects
- **Expandable Details**: Click to expand job details, achievements, and projects
- **Skill Progression**: Visual skill evolution over time
- **Video/Image Integration**: Embed media for specific career milestones
- **Achievement Badges**: Interactive badges for certifications and accomplishments

### Timeline Data Structure:
```typescript
interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  company: string;
  role: string;
  description: string;
  achievements: string[];
  skills: string[];
  media?: {
    type: 'image' | 'video';
    url: string;
    caption?: string;
  }[];
  documents?: {
    name: string;
    url: string;
    type: 'pdf' | 'link';
  }[];
}
```

## Enhanced Features Plan:
1. **Smooth Animations**: Framer Motion for timeline reveals and interactions
2. **Responsive Design**: Mobile-first approach with touch interactions
3. **Dark/Light Theme**: Toggle between themes (keeping your current dark aesthetic)
4. **Performance**: Lazy loading for media and components
5. **SEO**: Meta tags and structured data for better search visibility

## Commands (using Yarn + Vite)
- **Install**: `cd frontend && yarn install`
- **Dev Server**: `yarn dev` (starts Vite dev server)
- **Build**: `yarn build` (Vite build for production)
- **Preview**: `yarn preview` (preview production build)
- **Deploy**: `yarn deploy` (Firebase deploy)
- **Lint**: `yarn lint`
- **Type Check**: `yarn type-check`

## Setup Instructions
1. Create React + TypeScript + Vite project: `yarn create vite frontend --template react-ts`
2. Install MUI dependencies: `yarn add @mui/material @emotion/react @emotion/styled @mui/icons-material`
3. Install additional dependencies: `yarn add react-router-dom framer-motion firebase`
4. Install dev dependencies: `yarn add -D @types/node`
5. Setup Firebase: `firebase init` in project root
6. Configure Vite for Firebase hosting

## Implementation Status
✅ **Homepage Complete**: Fully implemented with MUI components
- Header with navigation (AppBar, Toolbar, Typography, Button)
- Hero section with video background and main title
- Three main section cards (Working Life, Personal Life, Portfolio) 
- Footer with contact info and social links
- Custom MUI theme matching original design (dark theme, Orbitron/Quicksand fonts, brown accent)
- Responsive hamburger menu for mobile devices
- Modular navigation components

## Component Architecture
### Navigation Components (`frontend/src/components/navigation/`)
```
navigation/
├── NavItem.ts              # TypeScript interface for nav items
├── NavigationLinks.tsx     # Navigation data array
├── DesktopNavigation.tsx   # Desktop button navigation
├── MobileNavigation.tsx    # Mobile hamburger menu with drawer
└── index.ts               # Clean exports
```

### TypeScript Import Pattern
Fixed import/export issues using TypeScript's `import type` syntax:
```typescript
// NavItem.ts
export interface NavItem {
  text: string;
  href: string;
}

// NavigationLinks.tsx
import type { NavItem } from './NavItem';
export const navigationItems: NavItem[] = [...]

// Component files
import { navigationItems } from './NavigationLinks';
import type { NavItem } from './NavItem';
```

## Features Implemented
- **Video Header**: Auto-playing background video with overlay text
- **Responsive Navigation**: Desktop buttons + mobile hamburger menu
- **Grid Layout**: Modern MUI Grid with `size={{ xs: 12, sm: 6, lg: 4 }}` syntax
- **Theme Integration**: Consistent MUI theme throughout all components

## MUI Grid Usage
Modern MUI Grid API syntax used throughout:
```tsx
<Grid container spacing={3}>
  <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
    <Card>...</Card>
  </Grid>
</Grid>
```

## Theme Configuration
Custom MUI theme located at `frontend/src/theme/theme.ts`:
- Dark mode with #343A40 background
- Primary color: #89665d (brown accent) 
- Typography: Orbitron for headings, Quicksand for body text
- Custom component overrides for Button, Card, AppBar