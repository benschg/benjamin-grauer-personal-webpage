import type { CVSidebarData, CVHeaderData, CVSidebarSectionType } from '../types/CVTypes';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

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

      case 'hardSkills':
        return data.hardSkills.length > 0 ? (
          <div key="hardSkills" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Hard Skills</h3>
            <div className="cv-sidebar-skills">
              {data.hardSkills.map((skill, index) => (
                <span key={index} className="cv-sidebar-skill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case 'softSkills':
        return data.softSkills.length > 0 ? (
          <div key="softSkills" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Soft Skills</h3>
            <div className="cv-sidebar-skills">
              {data.softSkills.map((skill, index) => (
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
                  {item.link ? (
                    <a href={item.link.startsWith('http') ? item.link : `https://${item.link}`} className="cv-sidebar-list-link">{item.name}</a>
                  ) : (
                    <span className="cv-sidebar-list-title">{item.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'volunteer':
        return data.volunteer.length > 0 ? (
          <div key="volunteer" className="cv-sidebar-section">
            <h3 className="cv-sidebar-title">Volunteering</h3>
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
                <div className="cv-sidebar-contact-item">
                  <EmailIcon sx={{ fontSize: 12, mr: 0.5 }} />
                  {header.email}
                </div>
                {header.phone && (
                  <div className="cv-sidebar-contact-item">
                    <PhoneIcon sx={{ fontSize: 12, mr: 0.5 }} />
                    {header.phone}
                  </div>
                )}
                {header.location && (
                  <div className="cv-sidebar-contact-item cv-sidebar-contact-address">
                    <LocationOnIcon sx={{ fontSize: 12, mr: 0.5, flexShrink: 0 }} />
                    {/* Split address: street on first line, postal code + city on second */}
                    {header.location.includes(',') ? (
                      <span>
                        <span>{header.location.split(',')[0].trim()}</span>
                        <br />
                        <span>{header.location.split(',').slice(1).join(',').trim()}</span>
                      </span>
                    ) : (
                      <span>{header.location}</span>
                    )}
                  </div>
                )}
                {header.website && (
                  <div className="cv-sidebar-contact-item">
                    <LanguageIcon sx={{ fontSize: 12, mr: 0.5 }} />
                    {header.website}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Always show website even when private details are hidden */}
                {header.website && (
                  <div className="cv-sidebar-contact-item">
                    <LanguageIcon sx={{ fontSize: 12, mr: 0.5 }} />
                    {header.website}
                  </div>
                )}
                <div className="cv-sidebar-contact-private">Full contact details available on request</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVSidebar;
