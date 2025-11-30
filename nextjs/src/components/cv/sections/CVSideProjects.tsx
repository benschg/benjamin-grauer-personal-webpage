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
            <div className="cv-side-projects-header">
              <h3>{project.name}</h3>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-side-projects-link"
                >
                  {project.link}
                </a>
              )}
            </div>
            <p>{project.description}</p>
            {project.technologies && project.technologies.length > 0 && (
              <div className="cv-side-projects-tech">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="cv-side-projects-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVSideProjects;
