import type { CVEducationEntry } from '../types/CVTypes';

interface CVEducationProps {
  entries: CVEducationEntry[];
}

const CVEducation = ({ entries }: CVEducationProps) => {
  return (
    <div className="cv-section cv-education">
      <h2>Education</h2>
      {entries.map((entry, index) => (
        <div key={index} className="cv-education-entry">
          <div className="cv-education-header">
            <h3>{entry.degree}</h3>
            <span className="cv-education-period">{entry.period}</span>
          </div>
          <div className="cv-education-institution">{entry.institution}</div>
          {entry.description && <p>{entry.description}</p>}
          {entry.grade && <div className="cv-education-grade">Grade: {entry.grade}</div>}
        </div>
      ))}
    </div>
  );
};

export default CVEducation;
