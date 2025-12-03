'use client';

interface CVBadge {
  label: string;
  value: string;
}

interface CVBadgesProps {
  badges: CVBadge[];
}

const CVBadges = ({ badges }: CVBadgesProps) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="cv-section cv-badges">
      <div className="cv-badges-container">
        {badges.map((badge, index) => (
          <div key={index} className="cv-badge">
            <span className="cv-badge-value">{badge.value}</span>
            <span className="cv-badge-label">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVBadges;
