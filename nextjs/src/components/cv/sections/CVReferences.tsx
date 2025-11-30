import type { CVReferenceEntry } from '../types/CVTypes';

interface CVReferencesProps {
  data: CVReferenceEntry[];
  showPrivateInfo?: boolean;
}

const CVReferences = ({ data, showPrivateInfo = false }: CVReferencesProps) => {
  if (data.length === 0) return null;

  return (
    <div className="cv-section cv-references">
      <h2>References</h2>
      <div className="cv-references-list">
        {data.map((reference, index) => (
          <div key={index} className="cv-references-item">
            <div className="cv-references-name">{reference.name}</div>
            <div className="cv-references-role">
              {reference.title}, {reference.company}
            </div>
            {showPrivateInfo && (reference.email || reference.phone) && (
              <div className="cv-references-contact">
                {reference.phone && <div>{reference.phone}</div>}
                {reference.email && <div>{reference.email}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
      {!showPrivateInfo && (
        <p className="cv-references-note">Contact details available on request</p>
      )}
    </div>
  );
};

export default CVReferences;
