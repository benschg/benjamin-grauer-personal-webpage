# Benjamin Grauer Personal Website - Next.js Architecture

## Tech Stack
- **Next.js 16** with App Router and TypeScript
- **Bun** for package management
- **Material-UI (MUI)** for component library and theming
- **Tailwind CSS** for utility styling
- **Supabase** for authentication and database
- **Vercel** for hosting and deployment
- **Framer Motion** for animations

## Project Structure

```
nextjs/
├── public/
│   ├── personal-life/       # Personal life images
│   ├── portfolio/           # Portfolio project images
│   ├── welcome/             # Homepage section images
│   └── working-life/        # Working life images and documents
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Homepage
│   │   ├── layout.tsx       # Root layout
│   │   ├── personal-life/
│   │   ├── working-life/
│   │   │   └── cv/          # CV generation page
│   │   ├── portfolio/
│   │   │   ├── [projectId]/ # Dynamic project pages
│   │   │   └── art-gallery/
│   │   └── api/             # API routes
│   │       ├── generate-cv/
│   │       └── generate-pdf/
│   ├── components/
│   │   ├── common/          # Shared components (Header, Footer, Timeline)
│   │   ├── cv/              # CV generation components
│   │   ├── home/            # Homepage components
│   │   ├── navigation/      # Navigation components
│   │   ├── personal-life/   # Personal life page components
│   │   ├── portfolio/       # Portfolio components
│   │   ├── social/          # Social links components
│   │   └── working-life/    # Working life components
│   │       └── skills/      # Skills cards (Domain, Soft Skills, Languages, etc.)
│   ├── contexts/            # React contexts (Auth)
│   ├── data/                # Static data files
│   │   ├── timelineData.ts
│   │   ├── portfolioData.ts
│   │   ├── recommendations.ts
│   │   └── ...
│   ├── lib/
│   │   └── supabase/        # Supabase client setup
│   ├── services/            # Business logic services
│   │   ├── ai/              # Gemini AI integration
│   │   └── cv/              # CV version management
│   ├── theme/               # MUI theme configuration
│   └── types/               # TypeScript types
├── supabase/
│   └── migrations/          # Database migrations
├── package.json
├── next.config.ts
└── tsconfig.json
```

## Commands (using Bun)
- **Install**: `cd nextjs && bun install`
- **Dev Server**: `bun dev` (starts Next.js dev server on port 3000)
- **Build**: `bun run build` (Next.js production build)
- **Start**: `bun start` (start production server)
- **Lint**: `bun run lint`
- **Type Check**: `npx tsc --noEmit`

## Deployment
- **Platform**: Vercel (automatic deployment on push)
- **Production**: Merges to `main` deploy to production
- **Preview**: PRs get preview deployments automatically
- **Config**: `vercel.json` in project root

## Key Features

### CV Generation (`/working-life/cv`)
- Interactive CV with WYSIWYG editing
- PDF export via Puppeteer
- AI-powered customization with Google Gemini
- Version management with Supabase
- Dark/light theme toggle
- Privacy controls for contact info

### Working Life Page
- Professional timeline with expandable entries
- Skills sections (Domain Expertise, Soft Skills, Languages, etc.)
- Recommendations carousel
- Documents section with downloadable PDFs

### Portfolio
- Project grid with filtering
- Dynamic project detail pages
- Art gallery with lightbox
- YouTube video integration

### Personal Life Page
- Interests grid
- Sports timeline
- Photo galleries

## Theme Configuration
Custom MUI theme at `nextjs/src/theme/theme.ts`:
- Dark mode with #343A40 background
- Primary color: #89665d (brown accent)
- Typography: Orbitron for headings, Quicksand for body text

## Environment Variables
Required environment variables (set in Vercel dashboard):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_CONTACT_PHONE=
NEXT_PUBLIC_CONTACT_ADDRESS=
GEMINI_API_KEY=
```

## Database (Supabase)
Tables:
- `cv_versions` - Stored CV customizations
- `cv_styles` - CV styling preferences

## API Routes
- `POST /api/generate-cv` - Generate AI-customized CV content
- `POST /api/generate-pdf` - Generate PDF from CV page
