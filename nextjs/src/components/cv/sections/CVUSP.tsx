import type { CVUSPEntry } from '../types/CVTypes';

interface CVUSPProps {
  data: CVUSPEntry[];
}

const CVUSP = ({ data }: CVUSPProps) => {
  return (
    <div className="cv-section cv-usp">
      <h2>Key Competences</h2>
      <div className="cv-usp-list">
        {data.map((usp, index) => (
          <div key={index} className="cv-usp-item">
            <h3>{usp.title}</h3>
            <p>{usp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVUSP;
