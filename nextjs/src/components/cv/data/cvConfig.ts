import type {
  CVData,
  CVExperienceEntry,
  CVEducationEntry,
  CVFunctionEntry,
  CVPageLayout,
  CVReferenceEntry,
  CVDomainEntry,
} from "../types/CVTypes";
import { timelineEvents, careerAspirations } from "@/components/working-life/content";
import { sharedProfile } from "@/data/shared-profile";
import { cvAboutMe } from "@/data/interestsData";

// Page layouts - define which sections appear on each page
// Add more pages as needed - no cap on number of pages
// For experience, use sliced sections: { type: 'experience', start: 0, end: 3 }
export const cvPageLayouts: CVPageLayout[] = [
  // Page 1
  {
    sidebar: ["successes", "hardSkills", "softSkills", "languages"],
    main: ["header", "badges", "slogan", "profile", "usp", "lookingFor"],
  },
  // Page 2
  {
    sidebar: ["education", "courses", "portfolio", "volunteer", "aboutMe"],
    main: ["functions", "sideProjects", "domains", "references"],
  },
  // Page 3 - First 3 experience entries
  {
    sidebar: [],
    main: [{ type: "experience", start: 0, end: 3 }],
  },
  // Page 4 - Remaining experience entries
  {
    sidebar: [],
    main: [{ type: "experience", start: 3, showTitle: false }],
  },
];

// Transform timeline work entries to CV experience format
const getExperienceFromTimeline = (): CVExperienceEntry[] => {
  return timelineEvents
    .filter((event) => event.type === "work")
    .map((event) => ({
      company: event.company,
      role: event.title,
      period: event.year,
      description: event.description,
      achievements: event.achievements || [],
      skills: event.skills,
    }))
    .sort((a, b) => {
      const yearA = parseInt(a.period.split("-")[0]);
      const yearB = parseInt(b.period.split("-")[0]);
      return yearB - yearA;
    });
};

// Transform timeline education entries to CV education format
const getEducationFromTimeline = (): CVEducationEntry[] => {
  return timelineEvents
    .filter((event) => event.type === "education")
    .map((event) => ({
      institution: event.company,
      degree: event.title,
      period: event.year,
      description: event.description,
      grade: event.achievements
        ?.find((a) => a.includes("Grade"))
        ?.replace("Grade ", ""),
    }))
    .sort((a, b) => {
      const yearA = parseInt(a.period.split("-")[0]);
      const yearB = parseInt(b.period.split("-")[0]);
      return yearB - yearA;
    });
};

// Transform timeline certification entries to CV courses format
const getCoursesFromTimeline = (): {
  name: string;
  provider: string;
  year: string;
}[] => {
  return timelineEvents
    .filter((event) => event.type === "certification")
    .map((event) => ({
      name: event.title,
      provider: event.company,
      year: event.year,
    }))
    .sort((a, b) => {
      const yearA = parseInt(a.year.split("-")[0]);
      const yearB = parseInt(b.year.split("-")[0]);
      return yearB - yearA;
    });
};

// Extract function titles from work timeline
const getFunctionsFromTimeline = (): CVFunctionEntry[] => {
  const workEvents = timelineEvents
    .filter((event) => event.type === "work")
    .sort((a, b) => {
      const yearA = parseInt(a.year.split("-")[0]);
      const yearB = parseInt(b.year.split("-")[0]);
      return yearB - yearA;
    });

  return workEvents.map((event, index) => {
    // Only show description for the first 4 roles (most recent)
    const showDescription = index < 4;

    return {
      title: event.title,
      subtitle: `${event.company}, ${event.year}`,
      description: showDescription ? event.shortDescription : undefined,
    };
  });
};

// Get references from JSON environment variable
// Format: [{"name":"John","title":"CTO","company":"Acme","email":"j@a.com","phone":"+41..."}]
const getReferences = (): CVReferenceEntry[] => {
  const json = process.env.NEXT_PUBLIC_CV_REFERENCES;
  if (!json) return [];

  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed.map((ref) => ({
        name: ref.name || "",
        title: ref.title || "",
        company: ref.company || "",
        email: ref.email,
        phone: ref.phone,
      }));
    }
  } catch (e) {
    console.error("Failed to parse CV references:", e);
  }

  return [];
};

// CV Data - edit this to customize your CV content
export const cvData: CVData = {
  // SIDEBAR (Left side - super short)
  sidebar: {
    successes: [
      { title: "40+ Projects Delivered" },
      { title: "Enabled teams to focus on the value chain" },
      { title: "Consolidated 30 CLI tools into 1 unified app" },
      { title: "Bringing legacy systems to the cloud" },
    ],

    hardSkills: [
      "React/TypeScript",
      "Python",
      "C#/.NET",
      "C++",
      "Cloud architecture",
      "AWS",
      "DevOps",
      "3D graphics",
    ],

    softSkills: [
      "Team growth",
      "Mentoring",
      "Coaching",
      "Empathy",
      "Technical communication",
      "Stakeholder management",
      "Change management",
      "Creative learning",
    ],

    languages: [
      { name: "German", level: "Native" },
      { name: "English", level: "Fluent" },
      { name: "French", level: "Basic" },
    ],

    education: getEducationFromTimeline(),

    courses: getCoursesFromTimeline(),

    portfolio: [
      {
        name: "benjamingrauer.ch/portfolio",
        link: "benjamingrauer.ch/portfolio",
      },
      {
        name: "github.com/benschg",
        link: "github.com/benschg",
      },
    ],

    volunteer: [
      {
        organization: "Stadt Zürich",
        role: "Schreibdienst",
        period: "Ongoing",
        description: "Supporting residents with administrative correspondence",
      },
      {
        organization: "Nachbarschaftshilfe Kreis 9",
        role: "Volunteer",
        period: "Ongoing",
        description: "Community support and neighborhood assistance",
      },
    ],

    hobbies: ["Triathlon", "Reading", "Crafting", "Video Games"],

    aboutMe: cvAboutMe,
  },

  // MAIN CONTENT (Right side - longer)
  main: {
    header: {
      name: sharedProfile.name,
      title: sharedProfile.tagline,
      email: sharedProfile.email,
      phone: sharedProfile.phone,
      location: sharedProfile.location,
      linkedin: sharedProfile.linkedin,
      website: sharedProfile.website,
      photo: sharedProfile.photo,
    },

    badges: [
      { value: "15+", label: "Years Experience" },
      { value: "10+", label: "Teams Empowered" },
      { value: "100+", label: "People Hired" },
      { value: "2x", label: "ISO9001 Certified" },
    ],

    slogan:
      "Transforming complex challenges into elegant solutions through collaborative leadership. Empowering engineers to ship products that matter.",

    profile: `Experienced engineering leader with 15+ years in software development,
specializing in building and scaling high-performing teams. Proven track record in
transforming complex technical challenges into intuitive solutions, from 3D medical
simulators to drone logistics platforms. Passionate about user experience, value-stream
aligned development, and fostering collaborative engineering cultures.`,

    usp: [
      {
        title: "Servant Leadership",
        description:
          "Empowering engineers through mentorship, clear vision, and removing obstacles. Fostering environments where people and products thrive together.",
      },
      {
        title: "Value-Stream Optimization",
        description:
          "Aligning engineering efforts with business outcomes. Streamlining processes to maximize delivery velocity and product impact.",
      },
      {
        title: "3D Graphics & Visualization",
        description:
          "Specialized expertise in real-time 3D applications and medical simulation. Bridging the gap between cutting-edge graphics and practical user experiences.",
      },
    ],

    lookingFor: {
      intro: "Combining technical excellence with human-centered leadership:",
      items: careerAspirations.map((a) => a.title),
    },

    functions: getFunctionsFromTimeline(),

    experience: getExperienceFromTimeline(),

    sideProjects: [
      {
        name: "DocuGap",
        description:
          "AI-powered document change analysis and categorization tool",
        link: "https://docugap.com",
        technologies: ["Next.js", "TypeScript", "AI"],
      },
      {
        name: "AI Mosaic Studio",
        description: "AI-powered photo-to-mosaic transformation tool",
        link: "https://mosaic-studio.0verall.com",
        technologies: ["AI/ML", "Image Processing"],
      },
      {
        name: "Orxonox",
        description: "Open-source 3D space shooter game & engine",
        link: "https://orxonox.net",
        technologies: ["C++", "OpenGL", "Lua"],
      },
    ],

    domains: [
      {
        name: "Medical simulation",
        description:
          "Building the equivalent to flight simulators for endoscopic medical procedures",
      },
      {
        name: "Drone logistics",
        description: "Autonomous warehouse systems",
      },
      {
        name: "Advanced manufacturing",
        description: "Carbon fiber 3D printing",
      },
      {
        name: "Compliance",
        description: "Document change management systems",
      },
      {
        name: "Game development",
        description: "Open-source 3D engines",
      },
    ] as CVDomainEntry[],

    references: getReferences(),
  },
};
