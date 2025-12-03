import type { CVSideProjectEntry } from '../types/CVTypes';

interface CVSideProjectsProps {
  data: CVSideProjectEntry[];
}

const CVSideProjects = ({ data }: CVSideProjectsProps) => {
  return (
    <div className="cv-section cv-side-projects">
      <h2>Side Projects</h2>
      <div className="cv-side-projects-list">
        {data.map((project, index) => (
          <div key={index} className="cv-side-projects-item">
            <span className="cv-side-projects-text">
              <span className="cv-side-projects-name">{project.name}</span>
              <span className="cv-side-projects-desc"> - {project.description}</span>
            </span>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cv-side-projects-link"
              >
                {project.link.replace('https://', '')}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVSideProjects;
