import { forwardRef, useMemo, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CVReferenceEntry, CVHeaderData } from "./types/CVTypes";
import {
  CVHeader,
  CVBadges,
  CVSlogan,
  CVProfile,
  CVUSP,
  CVLookingFor,
  CVFunctions,
  CVExperience,
  CVSideProjects,
  CVDomains,
  CVReferences,
  CVSidebar,
} from "./sections";
import CVAttachmentCards from "./components/CVAttachmentCards";
import CVSeparatorPage from "./components/CVSeparatorPage";
import { cvPageLayouts, cvData } from "./data/cvConfig";
import type {
  CVMainSectionType,
  CVSlicedSection,
  CVExperienceEntry,
} from "./types/CVTypes";
import CVPage from "./components/CVPage";
import { useCVTheme, useCVVersion } from "./contexts";
import "./styles/cv.css";

// Type guard for sliced sections
const isSlicedSection = (
  section: CVMainSectionType
): section is CVSlicedSection => {
  return typeof section === "object" && "type" in section && "start" in section;
};

interface ContactSettings {
  contact_email: string;
  contact_phone: string;
  contact_address: string;
}

const CVDocument = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    theme,
    showPhoto,
    privacyLevel,
    canShowPrivateInfo,
    canShowReferenceInfo,
    showExperience,
    zoom,
  } = useCVTheme();
  const { activeContent, isEditing } = useCVVersion();
  const [references, setReferences] = useState<CVReferenceEntry[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);

  // Fetch references and contact settings from database
  useEffect(() => {
    fetch("/api/cv-references")
      .then((res) => res.json())
      .then((data) => setReferences(data.references || []))
      .catch((err) => console.error("Failed to fetch references:", err));

    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setContactSettings({
            contact_email: data.settings.contact_email || "",
            contact_phone: data.settings.contact_phone || "",
            contact_address: data.settings.contact_address || "",
          });
        }
      })
      .catch((err) => console.error("Failed to fetch contact settings:", err));
  }, []);

  // Enforce privacy: only show private info if user is logged in
  const effectivePrivacyLevel = canShowPrivateInfo ? privacyLevel : "none";

  // Merge DB contact settings with static header data
  const headerData: CVHeaderData = useMemo(() => {
    if (contactSettings) {
      return {
        ...cvData.main.header,
        email: contactSettings.contact_email || cvData.main.header.email,
        phone: contactSettings.contact_phone || cvData.main.header.phone,
        location: contactSettings.contact_address || cvData.main.header.location,
      };
    }
    return cvData.main.header;
  }, [contactSettings]);

  // Convert AI-generated work experience to CV format if available
  const experienceEntries: CVExperienceEntry[] = useMemo(() => {
    if (
      activeContent.workExperience &&
      activeContent.workExperience.length > 0
    ) {
      return activeContent.workExperience.map((exp) => ({
        company: exp.company,
        role: exp.title,
        period: exp.period,
        description: "", // AI generates bullets instead of description
        achievements: exp.bullets,
      }));
    }
    return cvData.main.experience;
  }, [activeContent.workExperience]);

  const renderMainSection = (section: CVMainSectionType): ReactNode => {
    // Handle sliced sections
    if (isSlicedSection(section)) {
      if (section.type === "experience") {
        return (
          <CVExperience
            key={`experience-${section.start}-${section.end ?? "end"}`}
            entries={experienceEntries}
            start={section.start}
            end={section.end}
            showTitle={section.showTitle ?? section.start === 0}
          />
        );
      }
      return null;
    }

    // Handle regular section types
    switch (section) {
      case "header":
        // Pass header with dynamic tagline from version, without photo (photo is in sidebar)
        return (
          <CVHeader
            key="header"
            data={{
              ...headerData,
              title: activeContent.tagline,
              photo: undefined,
            }}
          />
        );
      case "badges":
        return <CVBadges key="badges" badges={cvData.main.badges} />;
      case "slogan":
        // Use dynamic slogan from version
        return (
          <CVSlogan
            key="slogan"
            slogan={activeContent.slogan || cvData.main.slogan}
          />
        );
      case "profile":
        // Use dynamic profile from version
        return <CVProfile key="profile" profile={activeContent.profile} />;
      case "usp":
        // If AI generated key competences, show those instead of static USP
        if (
          activeContent.keyCompetences &&
          activeContent.keyCompetences.length > 0
        ) {
          return <CVUSP key="usp" data={activeContent.keyCompetences} />;
        }
        // Legacy fallback: convert old keyAchievements format
        if (
          activeContent.keyAchievements &&
          activeContent.keyAchievements.length > 0
        ) {
          const uspFromAchievements = activeContent.keyAchievements.map(
            (achievement, idx) => ({
              title: `Achievement ${idx + 1}`,
              description: achievement,
            })
          );
          return <CVUSP key="usp" data={uspFromAchievements} />;
        }
        return <CVUSP key="usp" data={cvData.main.usp} />;
      case "lookingFor":
        return (
          <CVLookingFor
            key="lookingFor"
            intro={cvData.main.lookingFor.intro}
            items={cvData.main.lookingFor.items}
          />
        );
      case "functions":
        return <CVFunctions key="functions" data={cvData.main.functions} />;
      case "experience":
        return <CVExperience key="experience" entries={experienceEntries} />;
      case "sideProjects":
        return (
          <CVSideProjects key="sideProjects" data={cvData.main.sideProjects} />
        );
      case "domains":
        return <CVDomains key="domains" data={cvData.main.domains} />;
      case "references":
        // Only show reference contact details if user is whitelisted AND privacy is 'full'
        return (
          <CVReferences
            key="references"
            data={references}
            showPrivateInfo={
              effectivePrivacyLevel === "full" && canShowReferenceInfo
            }
          />
        );
      default:
        return null;
    }
  };

  // Check if a page contains only experience sections
  const isExperienceOnlyPage = (
    page: (typeof cvPageLayouts)[number]
  ): boolean => {
    if (page.sidebar.length > 0) return false;
    return page.main.every((section) => {
      if (isSlicedSection(section)) return section.type === "experience";
      return section === "experience";
    });
  };

  // Filter out empty pages and experience-only pages when showExperience is false
  const activePages = cvPageLayouts.filter((page) => {
    if (page.sidebar.length === 0 && page.main.length === 0) return false;
    if (!showExperience && isExperienceOnlyPage(page)) return false;
    return true;
  });

  const totalPages = activePages.length;

  return (
    <div
      className={`cv-document-wrapper ${isEditing ? "cv-editing-mode" : ""}`}
      ref={ref}
      data-theme={theme}
    >
      {activePages.map((pageLayout, pageIndex) => {
        const hasSidebar = pageLayout.sidebar.length > 0;

        const showPersonalInfo = effectivePrivacyLevel !== "none";
        return (
          <CVPage
            key={pageIndex}
            pageNumber={pageIndex + 1}
            totalPages={totalPages}
            email={showPersonalInfo ? headerData.email : undefined}
            phone={showPersonalInfo ? headerData.phone : undefined}
            linkedin={headerData.linkedin}
            website={headerData.website}
            zoom={zoom}
          >
            {hasSidebar ? (
              <div className="cv-two-column">
                <CVSidebar
                  data={cvData.sidebar}
                  header={headerData}
                  sections={pageLayout.sidebar}
                  showPhoto={pageIndex === 0 && showPhoto}
                  showContact={pageIndex === 0}
                  showPrivateInfo={showPersonalInfo}
                />
                <div className="cv-main-content">
                  {pageLayout.main.map((sectionType, idx) => (
                    <div key={idx}>{renderMainSection(sectionType)}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="cv-main-content cv-full-width">
                {pageLayout.main.map((sectionType, idx) => (
                  <div key={idx}>{renderMainSection(sectionType)}</div>
                ))}
              </div>
            )}
          </CVPage>
        );
      })}
      {/* Separator page - shown when attachments are enabled */}
      <CVSeparatorPage zoom={zoom} />
      {/* Attachment cards preview - shown when attachments are enabled */}
      <CVAttachmentCards />
    </div>
  );
});

CVDocument.displayName = "CVDocument";

export default CVDocument;
