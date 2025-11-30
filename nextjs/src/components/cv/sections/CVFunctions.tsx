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
            <span className="cv-functions-title">{func.title}</span>
            {func.description && <span className="cv-functions-desc">{func.description}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVFunctions;
