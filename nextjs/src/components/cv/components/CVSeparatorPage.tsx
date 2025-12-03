'use client';

import { Box, Typography } from '@mui/material';
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
  const textColor = isDark ? '#ffffff' : '#1a1a1a';
  const mutedColor = isDark ? '#b0b0b0' : '#666666';

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
    <Box
      className={`cv-page cv-separator-page ${zoom > 0 ? 'cv-page-manual-zoom' : ''}`}
      style={getZoomStyles()}
      sx={{
        bgcolor: isDark ? '#343a40' : '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Top accent bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '20px',
          bgcolor: '#89665d',
        }}
      />

      {/* Bottom accent bar */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '20px',
          bgcolor: '#89665d',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 4,
          py: 6,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '2rem',
            fontWeight: 700,
            color: '#89665d',
            textAlign: 'center',
            mb: 1,
          }}
        >
          References & Certificates
        </Typography>

        <Typography
          sx={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '0.8rem',
            color: textColor,
            textAlign: 'center',
            mb: 3,
          }}
        >
          The following pages contain professional references and certifications
        </Typography>

        {/* Decorative line */}
        <Box sx={{ width: '200px', height: '3px', bgcolor: '#89665d', mb: 4 }} />

        {/* Two columns */}
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {/* References column */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#89665d',
                mb: 1.5,
                borderBottom: '2px solid #89665d',
                pb: 0.5,
              }}
            >
              References ({references.length})
            </Typography>
            {references.map((ref, idx) => (
              <Box key={idx} sx={{ mb: 1.5 }}>
                <Typography
                  sx={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: textColor,
                    lineHeight: 1.3,
                  }}
                >
                  {ref.company}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.6rem',
                    color: mutedColor,
                    lineHeight: 1.3,
                  }}
                >
                  {ref.authors} ({ref.year})
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.6rem',
                    fontStyle: 'italic',
                    color: mutedColor,
                    lineHeight: 1.3,
                  }}
                >
                  {ref.role}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Certificates column */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#89665d',
                mb: 1.5,
                borderBottom: '2px solid #89665d',
                pb: 0.5,
              }}
            >
              Certificates ({certificates.length})
            </Typography>
            {certificates.map((cert, idx) => (
              <Box key={idx} sx={{ mb: 1.5 }}>
                <Typography
                  sx={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: textColor,
                    lineHeight: 1.3,
                  }}
                >
                  {cert.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.6rem',
                    color: mutedColor,
                    lineHeight: 1.3,
                  }}
                >
                  {cert.issuer} ({cert.year})
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CVSeparatorPage;
