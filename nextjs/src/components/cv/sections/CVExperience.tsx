import type { CVExperienceEntry } from '../types/CVTypes';

interface CVExperienceProps {
  entries: CVExperienceEntry[];
  start?: number;
  end?: number;
  showTitle?: boolean;
}

const CVExperience = ({ entries, start = 0, end, showTitle = true }: CVExperienceProps) => {
  const slicedEntries = entries.slice(start, end);

  return (
    <div className="cv-section cv-experience">
      {showTitle && (
        <>
          <h2>Professional Experience — Detailed</h2>
          <p className="cv-section-intro">
            This section expands on the career overview with in-depth descriptions of responsibilities,
            achievements, and impact at each position.
          </p>
        </>
      )}
      {slicedEntries.map((entry, index) => (
        <div key={index} className="cv-experience-entry">
          <div className="cv-experience-header">
            <h3>{entry.role}</h3>
            <span className="cv-experience-period">{entry.period}</span>
          </div>
          <div className="cv-experience-company">{entry.company}</div>
          <p>{entry.description}</p>
          {entry.achievements.length > 0 && (
            <ul className="cv-experience-achievements">
              {entry.achievements.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default CVExperience;
