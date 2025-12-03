import { forwardRef, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  CVHeader,
  CVSlogan,
  CVProfile,
  CVUSP,
  CVFunctions,
  CVExperience,
  CVSideProjects,
  CVReferences,
  CVSidebar,
} from './sections';
import { cvPageLayouts, cvData } from './data/cvConfig';
import type { CVMainSectionType, CVSlicedSection, CVExperienceEntry } from './types/CVTypes';
import CVPage from './components/CVPage';
import { useCVTheme, useCVVersion } from './contexts';
import './styles/cv.css';

// Type guard for sliced sections
const isSlicedSection = (section: CVMainSectionType): section is CVSlicedSection => {
  return typeof section === 'object' && 'type' in section && 'start' in section;
};

const CVDocument = forwardRef<HTMLDivElement>((_, ref) => {
  const { theme, showPhoto, showPrivateInfo, showExperience, zoom } = useCVTheme();
  const { activeContent, isEditing, activeVersion } = useCVVersion();

  // Convert AI-generated work experience to CV format if available
  const experienceEntries: CVExperienceEntry[] = useMemo(() => {
    if (activeContent.workExperience && activeContent.workExperience.length > 0) {
      return activeContent.workExperience.map((exp) => ({
        company: exp.company,
        role: exp.title,
        period: exp.period,
        description: '', // AI generates bullets instead of description
        achievements: exp.bullets,
      }));
    }
    return cvData.main.experience;
  }, [activeContent.workExperience]);

  const renderMainSection = (section: CVMainSectionType): ReactNode => {
    // Handle sliced sections
    if (isSlicedSection(section)) {
      if (section.type === 'experience') {
        return (
          <CVExperience
            key={`experience-${section.start}-${section.end ?? 'end'}`}
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
      case 'header':
        // Pass header with dynamic tagline from version, without photo (photo is in sidebar)
        return (
          <CVHeader
            key="header"
            data={{ ...cvData.main.header, title: activeContent.tagline, photo: undefined }}
          />
        );
      case 'slogan':
        // Use dynamic slogan from version
        return (
          <CVSlogan
            key="slogan"
            slogan={activeContent.slogan || cvData.main.slogan}
            website={cvData.main.header.website}
          />
        );
      case 'profile':
        // Use dynamic profile from version
        return <CVProfile key="profile" profile={activeContent.profile} />;
      case 'usp':
        // If AI generated key achievements, show those instead of static USP
        if (activeContent.keyAchievements && activeContent.keyAchievements.length > 0) {
          const uspFromAchievements = activeContent.keyAchievements.map((achievement, idx) => ({
            title: `Achievement ${idx + 1}`,
            description: achievement,
          }));
          return <CVUSP key="usp" data={uspFromAchievements} />;
        }
        return <CVUSP key="usp" data={cvData.main.usp} />;
      case 'functions':
        return <CVFunctions key="functions" data={cvData.main.functions} />;
      case 'experience':
        return <CVExperience key="experience" entries={experienceEntries} />;
      case 'sideProjects':
        return <CVSideProjects key="sideProjects" data={cvData.main.sideProjects} />;
      case 'references':
        return (
          <CVReferences
            key="references"
            data={cvData.main.references}
            showPrivateInfo={showPrivateInfo}
          />
        );
      default:
        return null;
    }
  };

  // Check if a page contains only experience sections
  const isExperienceOnlyPage = (page: (typeof cvPageLayouts)[number]): boolean => {
    if (page.sidebar.length > 0) return false;
    return page.main.every((section) => {
      if (isSlicedSection(section)) return section.type === 'experience';
      return section === 'experience';
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
      className={`cv-document-wrapper ${isEditing ? 'cv-editing-mode' : ''}`}
      ref={ref}
      data-theme={theme}
    >
      {/* Editing mode indicator */}
      {isEditing && (
        <div className="cv-editing-banner cv-no-print">
          <span>Editing: {activeVersion?.name || 'CV Version'}</span>
          <span>Click on text to edit. Changes are saved when you click &quot;Save&quot;.</span>
        </div>
      )}
      {activePages.map((pageLayout, pageIndex) => {
        const hasSidebar = pageLayout.sidebar.length > 0;

        return (
          <CVPage
            key={pageIndex}
            pageNumber={pageIndex + 1}
            totalPages={totalPages}
            email={showPrivateInfo ? cvData.main.header.email : undefined}
            phone={showPrivateInfo ? cvData.main.header.phone : undefined}
            linkedin={cvData.main.header.linkedin}
            zoom={zoom}
          >
            {hasSidebar ? (
              <div className="cv-two-column">
                <CVSidebar
                  data={cvData.sidebar}
                  header={cvData.main.header}
                  sections={pageLayout.sidebar}
                  showPhoto={pageIndex === 0 && showPhoto}
                  showContact={pageIndex === 0}
                  showPrivateInfo={showPrivateInfo}
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
    </div>
  );
});

CVDocument.displayName = 'CVDocument';

export default CVDocument;
