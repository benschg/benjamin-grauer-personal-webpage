# Benjamin Grauer - Personal Website

A modern, responsive personal website built with React 18, TypeScript, and Material-UI, showcasing Benjamin Grauer's professional career, personal life, and project portfolio.

## 🚀 Features

- **Modern Tech Stack**: React 18 + TypeScript + Vite for fast development
- **Material-UI Design**: Professional, responsive design system with dark theme
- **Interactive Timeline**: Animated career timeline with expandable details
- **Responsive Navigation**: Desktop and mobile-optimized navigation
- **Project Portfolio**: Showcase of projects and achievements
- **Performance Optimized**: Fast loading with Vite bundler

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router DOM v7
- **Styling**: Emotion (CSS-in-JS)
- **Package Manager**: Yarn
- **Deployment**: Firebase Hosting (ready)

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Layout, Navigation, Footer
│   │   ├── personal-life/ # Personal section components
│   │   ├── working-life/  # Professional section components
│   │   └── portfolio/     # Project showcase components
│   ├── pages/             # Main page components
│   ├── data/              # Static data files
│   ├── types/             # TypeScript type definitions
│   └── theme/             # MUI theme configuration
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎨 Design Features

- **Custom MUI Theme**: Dark aesthetic with brown accent color (#89665d)
- **Typography**: Orbitron for headings, Quicksand for body text
- **Responsive Grid**: Modern MUI Grid v2 with responsive breakpoints
- **Interactive Elements**: Hover effects, smooth transitions
- **Professional Layout**: Clean, modern design inspired by portfolio standards

## 🚦 Getting Started

### Quick Setup (Recommended)

```bash
# Clone and set up everything automatically
git clone https://github.com/username/benjamin-grauer-personal-webpage.git
cd benjamin-grauer-personal-webpage
./setup-dev.sh
```

### Manual Setup

See **[SETUP.md](./SETUP.md)** for detailed setup instructions including:
- Pre-commit hooks configuration
- IDE setup recommendations  
- Troubleshooting guide

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Git

## 📝 Available Scripts

```bash
# Development
yarn dev          # Start Vite dev server
yarn build        # Build for production
yarn preview      # Preview production build locally

# Code Quality  
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues automatically
yarn type-check   # Run TypeScript compiler check
yarn format       # Format code with Prettier

# Deployment (when configured)
yarn deploy       # Deploy to Firebase
```

## 🏗️ Development

### Component Architecture
- **Modular Components**: Each section is broken into reusable components
- **TypeScript First**: Full type safety throughout the application  
- **MUI Integration**: Leverages MUI's component library and theming system
- **Responsive Design**: Mobile-first approach with touch interactions

### Key Components
- `Header`: Navigation with desktop/mobile variants
- `ProfessionalHero`: Working life introduction with profile image
- `Timeline`: Interactive career timeline (planned enhancement)
- `Footer`: Contact information and social links

## 🎯 Current Status

✅ **Completed Features**:
- Homepage with hero section and navigation
- Working Life page with professional introduction  
- Responsive navigation (desktop + mobile hamburger menu)
- MUI dark theme with custom typography
- Profile image integration
- Custom favicon from benjamingrauer.ch

🚧 **In Development**:
- Personal Life page components
- Portfolio project showcase
- Interactive timeline enhancements
- Animation improvements with Framer Motion

## 🔧 Configuration

### Environment Setup
The project uses Vite with sensible defaults. Configuration files:
- `vite.config.ts` - Vite bundler configuration
- `tsconfig.json` - TypeScript configuration  
- `eslint.config.js` - ESLint rules

### Theme Customization
Custom MUI theme located at `frontend/src/theme/theme.ts` with:
- Dark mode color palette
- Custom typography (Orbitron/Quicksand fonts)
- Component style overrides

## 🚀 Deployment

The project is configured for Firebase hosting:
```bash
firebase init    # Initialize Firebase (if not done)
yarn build      # Build production bundle
firebase deploy # Deploy to hosting
```

## 📄 License

This project is personal portfolio code. Please respect copyright and don't use for commercial purposes without permission.

## 👨‍💻 Author

**Benjamin Grauer**
- Website: [benjamingrauer.ch](https://benjamingrauer.ch)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- GitHub: [Your GitHub](https://github.com/your-username)

---

Built with ❤️ using React, TypeScript, and Material-UI