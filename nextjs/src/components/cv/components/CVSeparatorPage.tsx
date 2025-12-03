'use client';

import { useCVTheme } from '../contexts';

interface CVSeparatorPageProps {
  zoom?: number;
}

// References data
const references = [
  { company: 'Verity AG', authors: 'L. Gherardi & S. Neeskens', role: 'Head of Applications & Framework', year: '2025' },
  { company: '9T Labs AG', authors: 'C. Houwink & S. Skribe-Negre', role: 'Head of Software', year: '2023' },
  { company: 'VirtaMed AG', authors: 'R. Sierra (Co-CEO)', role: 'Cloud Platform Development', year: '2020' },
  { company: 'VirtaMed AG', authors: 'Internal HR', role: 'Full Tenure Reference', year: '2020' },
  { company: 'Harvard Medical School', authors: 'Prof. R. Kikinis, M.D.', role: "Master's Thesis", year: '2020' },
  { company: 'Cymicon', authors: 'J.P. Morrison (CEO)', role: 'R&D Internship', year: '2007' },
];

// Certificates data
const certificates = [
  { name: 'MSc ETH Electrical Engineering', issuer: 'ETH Zürich', year: '2008' },
  { name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', year: '2012' },
  { name: 'Management 3.0', issuer: 'Jurgen Appelo', year: '2016' },
  { name: 'CPRE Foundation Level', issuer: 'IREB', year: '2017' },
  { name: 'Leading Digital Transformation', issuer: 'Ionology', year: '2017' },
  { name: 'ICP-BAF Business Agility', issuer: 'ICAgile', year: '2019' },
];

const CVSeparatorPage = ({ zoom = 0 }: CVSeparatorPageProps) => {
  const { theme, showAttachments } = useCVTheme();

  if (!showAttachments) {
    return null;
  }

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#343a40' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a1a';
  const mutedColor = isDark ? '#b0b0b0' : '#666666';
  const accentColor = '#89665d';

  // Calculate CSS custom properties for manual zoom (matching CVPage)
  const getZoomStyles = (): React.CSSProperties => {
    if (zoom === 0) return {};

    const scaleFactor = 1 - zoom;
    return {
      '--manual-zoom-transform': `scale(${zoom})`,
      '--manual-zoom-margin-bottom': `calc(-297mm * ${scaleFactor})`,
      '--manual-zoom-margin-left': `calc(-210mm * ${scaleFactor / 2})`,
      '--manual-zoom-margin-right': `calc(-210mm * ${scaleFactor / 2})`,
      transformOrigin: 'top center',
    } as React.CSSProperties;
  };

  return (
    <div
      className={`cv-page cv-separator-page ${zoom > 0 ? 'cv-page-manual-zoom' : ''}`}
      style={{
        ...getZoomStyles(),
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '20px',
          backgroundColor: accentColor,
        }}
      />

      {/* Bottom accent bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '20px',
          backgroundColor: accentColor,
        }}
      />

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 32px',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '2rem',
            fontWeight: 700,
            color: accentColor,
            textAlign: 'center',
            margin: '0 0 8px 0',
          }}
        >
          References & Certificates
        </h1>

        <p
          style={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '0.8rem',
            color: textColor,
            textAlign: 'center',
            margin: '0 0 24px 0',
          }}
        >
          The following pages contain professional references and certifications
        </p>

        {/* Decorative line */}
        <div
          style={{
            width: '200px',
            height: '3px',
            backgroundColor: accentColor,
            marginBottom: '32px',
          }}
        />

        {/* Two columns */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {/* References column */}
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: accentColor,
                margin: '0 0 12px 0',
                paddingBottom: '4px',
                borderBottom: `2px solid ${accentColor}`,
              }}
            >
              References ({references.length})
            </h2>
            {references.map((ref, idx) => (
              <div key={idx} style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: textColor,
                    lineHeight: 1.3,
                  }}
                >
                  {ref.company}
                </div>
                <div
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.6rem',
                    color: mutedColor,
                    lineHeight: 1.3,
                  }}
                >
                  {ref.authors} ({ref.year})
                </div>
                <div
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.6rem',
                    fontStyle: 'italic',
                    color: mutedColor,
                    lineHeight: 1.3,
                  }}
                >
                  {ref.role}
                </div>
              </div>
            ))}
          </div>

          {/* Certificates column */}
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: accentColor,
                margin: '0 0 12px 0',
                paddingBottom: '4px',
                borderBottom: `2px solid ${accentColor}`,
              }}
            >
              Certificates ({certificates.length})
            </h2>
            {certificates.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: textColor,
                    lineHeight: 1.3,
                  }}
                >
                  {cert.name}
                </div>
                <div
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.6rem',
                    color: mutedColor,
                    lineHeight: 1.3,
                  }}
                >
                  {cert.issuer} ({cert.year})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVSeparatorPage;
