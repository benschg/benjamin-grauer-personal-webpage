import type {
  CVData,
  CVExperienceEntry,
  CVEducationEntry,
  CVFunctionEntry,
  CVPageLayout,
  CVReferenceEntry,
} from "../types/CVTypes";
import { timelineEvents } from "@/data/timelineData";
import { sharedProfile } from "@/data/shared-profile";
import { cvAboutMe } from "@/data/interestsData";

// Page layouts - define which sections appear on each page
// Add more pages as needed - no cap on number of pages
// For experience, use sliced sections: { type: 'experience', start: 0, end: 3 }
export const cvPageLayouts: CVPageLayout[] = [
  // Page 1
  {
    sidebar: ["qualifications", "successes", "skills", "languages"],
    main: ["header", "slogan", "profile", "usp"],
  },
  // Page 2
  {
    sidebar: ["education", "courses", "portfolio", "volunteer", "aboutMe"],
    main: ["functions", "sideProjects", "references"],
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
      { title: "10+ Teams Built" },
      { title: "100+ People Hired" },
      { title: "New Perspectives Introduced" },
      { title: "ISO 9001 Implemented twice" },
      { title: "Restructured teams to value-stream alignment" },
      { title: "Simplified 30 CLI tools into 1 unified app" },
      {
        title: "Brining legacy systems to the cloud",
        subtitle: "VirtaMed IoT platform",
      },
    ],

    qualifications: [
      { title: "15+ Years Experience" },
      { title: "20+ Engineers Led" },
      { title: "4 Industries" },
      { title: "40+ Projects Delivered" },
    ],

    skills: [
      "React/TypeScript",
      "C#/.NET",
      "Python",
      "C++",
      "Cloud Architecture",
      "AWS",
      "DevOps",
      "3D Graphics",
      "Team Leadership",
      "Agile/Scrum",
    ],

    languages: [
      { name: "German", level: "Native" },
      { name: "English", level: "Fluent" },
      { name: "French", level: "Basic" },
    ],

    education: getEducationFromTimeline(),

    courses: getCoursesFromTimeline(),

    portfolio: [
      // TODO: Add portfolio items
      {
        name: "TODO: Add portfolio items",
        link: "https://benjamingrauer.ch/portfolio",
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

    hobbies: ["Triathlon", "Reading", "Crafting"],

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

    functions: getFunctionsFromTimeline(),

    experience: getExperienceFromTimeline(),

    sideProjects: [
      // TODO: Add side projects you're proud of
      {
        name: "TODO: Add side project",
        description: "Description of the project",
        link: "https://example.com",
        technologies: ["React", "TypeScript"],
      },
    ],

    references: getReferences(),
  },
};
