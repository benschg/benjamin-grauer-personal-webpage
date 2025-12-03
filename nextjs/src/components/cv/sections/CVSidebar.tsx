import type { CVSidebarData, CVHeaderData, CVSidebarSectionType } from '../types/CVTypes';

interface CVSidebarProps {
  data: CVSidebarData;
  header: CVHeaderData;
  sections: CVSidebarSectionType[];
  showPhoto?: boolean;
  showContact?: boolean;
  showPrivateInfo?: boolean;
}

const CVSidebar = ({
  data,
  header,
  sections,
  showPhoto = false,
  showContact = false,
  showPrivateInfo = false,
}: CVSidebarProps) => {
  const renderSection = (type: CVSidebarSectionType) => {
    switch (type) {
      case 'successes':
        return data.successes.length > 0 ? (
          <div key="successes" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Successes</h3>
            <div className="cv-sidebar-list">
              {data.successes.map((success, index) => (
                <div key={index} className="cv-sidebar-list-item">
                  <span className="cv-sidebar-list-title">{success.title}</span>
                  {success.subtitle && (
                    <span className="cv-sidebar-list-subtitle">{success.subtitle}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'qualifications':
        return data.qualifications.length > 0 ? (
          <div key="qualifications" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Qualifications</h3>
            <div className="cv-sidebar-list">
              {data.qualifications.map((qual, index) => (
                <div key={index} className="cv-sidebar-list-item">
                  <span className="cv-sidebar-list-title">{qual.title}</span>
                  {qual.institution && (
                    <span className="cv-sidebar-list-subtitle">{qual.institution}</span>
                  )}
                  {qual.year && <span className="cv-sidebar-list-year">{qual.year}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'skills':
        return data.skills.length > 0 ? (
          <div key="skills" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Skills</h3>
            <div className="cv-sidebar-skills">
              {data.skills.map((skill, index) => (
                <span key={index} className="cv-sidebar-skill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return data.languages.length > 0 ? (
          <div key="languages" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Languages</h3>
            <div className="cv-sidebar-languages">
              {data.languages.map((lang, index) => (
                <div key={index} className="cv-sidebar-language">
                  <span className="cv-sidebar-language-name">{lang.name}</span>
                  <span className="cv-sidebar-language-level">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'education':
        return data.education.length > 0 ? (
          <div key="education" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Education</h3>
            <div className="cv-sidebar-list">
              {data.education.map((edu, index) => (
                <div key={index} className="cv-sidebar-list-item">
                  <span className="cv-sidebar-list-title">{edu.degree}</span>
                  <span className="cv-sidebar-list-subtitle">{edu.institution}</span>
                  <span className="cv-sidebar-list-year">{edu.period}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'courses':
        return data.courses.length > 0 ? (
          <div key="courses" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Courses</h3>
            <div className="cv-sidebar-courses">
              {data.courses.map((course, index) => (
                <div key={index} className="cv-sidebar-course">
                  <span className="cv-sidebar-course-name">{course.name}</span>
                  {course.year && <span className="cv-sidebar-course-year">{course.year}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'portfolio':
        return data.portfolio.length > 0 ? (
          <div key="portfolio" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Portfolio</h3>
            <div className="cv-sidebar-list">
              {data.portfolio.map((item, index) => (
                <div key={index} className="cv-sidebar-list-item">
                  <span className="cv-sidebar-list-title">{item.name}</span>
                  {item.link && <span className="cv-sidebar-list-link">{item.link}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'volunteer':
        return data.volunteer.length > 0 ? (
          <div key="volunteer" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Volunteer Work</h3>
            <div className="cv-sidebar-list">
              {data.volunteer.map((vol, index) => (
                <div key={index} className="cv-sidebar-list-item">
                  <div className="cv-sidebar-list-header">
                    <span className="cv-sidebar-list-title">{vol.role}</span>
                    {vol.period && <span className="cv-sidebar-list-year">{vol.period}</span>}
                  </div>
                  <span className="cv-sidebar-list-subtitle">{vol.organization}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'hobbies':
        return data.hobbies.length > 0 ? (
          <div key="hobbies" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Hobbies</h3>
            <div className="cv-sidebar-hobbies">
              {data.hobbies.map((hobby, index) => (
                <span key={index} className="cv-sidebar-hobby">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case 'aboutMe':
        return data.aboutMe && data.aboutMe.length > 0 ? (
          <div key="aboutMe" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Beyond Work</h3>
            <div className="cv-sidebar-about-me">
              {data.aboutMe.map((item, index) => (
                <div key={index} className="cv-sidebar-about-me-item">
                  <span className="cv-sidebar-about-me-title">{item.title}</span>
                  <span className="cv-sidebar-about-me-desc">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="cv-sidebar">
      {/* Photo - only on first page */}
      {showPhoto && header.photo && (
        <div className="cv-sidebar-photo">
          <img src={header.photo} alt={header.name} />
        </div>
      )}

      {/* Render requested sections */}
      {sections.map((sectionType) => renderSection(sectionType))}

      {/* Contact - only on first page */}
      {showContact && (
        <div className="cv-sidebar-section">
          <h3 className="cv-sidebar-title">Contact</h3>
          <div className="cv-sidebar-contact">
            {showPrivateInfo ? (
              <>
                {header.website && (
                  <div className="cv-sidebar-contact-item">{header.website}</div>
                )}
                <div className="cv-sidebar-contact-item">{header.email}</div>
                {header.phone && <div className="cv-sidebar-contact-item">{header.phone}</div>}
                {header.location && (
                  <div className="cv-sidebar-contact-item cv-sidebar-contact-address">
                    {/* Split address: street on first line, postal code + city on second */}
                    {header.location.includes(',') ? (
                      <>
                        <span>{header.location.split(',')[0].trim()}</span>
                        <span>{header.location.split(',').slice(1).join(',').trim()}</span>
                      </>
                    ) : (
                      <span>{header.location}</span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="cv-sidebar-contact-private">Contact details available on request</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVSidebar;
