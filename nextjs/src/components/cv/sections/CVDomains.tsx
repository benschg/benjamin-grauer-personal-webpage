import type { CVDomainEntry } from '../types/CVTypes';

interface CVDomainsProps {
  data: CVDomainEntry[];
}

const CVDomains = ({ data }: CVDomainsProps) => {
  return (
    <div className="cv-section cv-domains">
      <h2>Industries</h2>
      <div className="cv-domains-list">
        {data.map((domain, index) => (
          <div key={index} className="cv-domains-item">
            <span className="cv-domains-name">{domain.name}</span>
            <span className="cv-domains-desc"> - {domain.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVDomains;
