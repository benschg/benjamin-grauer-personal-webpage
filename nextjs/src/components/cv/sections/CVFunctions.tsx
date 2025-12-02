import type { CVFunctionEntry } from '../types/CVTypes';

interface CVFunctionsProps {
  data: CVFunctionEntry[];
}

const CVFunctions = ({ data }: CVFunctionsProps) => {
  return (
    <div className="cv-section cv-functions">
      <h2>Functions</h2>
      <div className="cv-functions-list">
        {data.map((func, index) => (
          <div key={index} className="cv-functions-item">
            <div className="cv-functions-header">
              <span className="cv-functions-title">{func.title}</span>
              {func.subtitle && <span className="cv-functions-subtitle">{func.subtitle}</span>}
            </div>
            {func.description && <p className="cv-functions-desc">{func.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVFunctions;
