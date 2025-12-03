'use client';

interface CVLookingForProps {
  intro: string;
  items: string[];
}

const CVLookingFor = ({ intro, items }: CVLookingForProps) => {
  if (!intro && (!items || items.length === 0)) return null;

  return (
    <div className="cv-section cv-looking-for">
      <h3>What I&apos;m Looking For</h3>
      {intro && <p className="cv-looking-for-intro">{intro}</p>}
      {items && items.length > 0 && (
        <div className="cv-looking-for-items">
          {items.map((item, index) => (
            <span key={index} className="cv-looking-for-item">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CVLookingFor;
