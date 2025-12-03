'use client';

import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { ContactPage, EmojiEvents, Download, OpenInNew } from '@mui/icons-material';
import { useCVTheme } from '../contexts';
import { REFERENCES_PDF_PATH, CERTIFICATES_PDF_PATH } from '@/components/working-life/content';

interface AttachmentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  pdfPath: string;
  downloadName: string;
}

const AttachmentCard = ({ title, description, icon, pdfPath, downloadName }: AttachmentCardProps) => {
  return (
    <Card
      sx={{
        flex: '1 1 300px',
        maxWidth: '400px',
        bgcolor: '#2a2e32',
        color: '#ffffff',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Box sx={{ color: '#89665d', mb: 2 }}>
          {icon}
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Orbitron',
            fontWeight: 600,
            mb: 1,
            color: '#ffffff',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#b0b0b0',
            mb: 2,
          }}
        >
          {description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<OpenInNew />}
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderColor: '#89665d',
              color: '#89665d',
              '&:hover': {
                borderColor: '#89665d',
                bgcolor: 'rgba(137, 102, 93, 0.1)',
              },
            }}
          >
            View
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            href={pdfPath}
            download={downloadName}
            sx={{
              borderColor: '#89665d',
              color: '#89665d',
              '&:hover': {
                borderColor: '#89665d',
                bgcolor: 'rgba(137, 102, 93, 0.1)',
              },
            }}
          >
            Download
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const CVAttachmentCards = () => {
  const { showAttachments } = useCVTheme();

  if (!showAttachments) {
    return null;
  }

  return (
    <Box
      className="cv-no-print cv-attachments-section"
      sx={{
        mt: 4,
        p: 3,
        bgcolor: 'rgba(52, 58, 64, 0.5)',
        borderRadius: 2,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'Orbitron',
          textAlign: 'center',
          mb: 3,
          color: '#ffffff',
          letterSpacing: '0.05em',
        }}
      >
        Attached Documents
      </Typography>
      <Typography
        variant="body2"
        sx={{
          textAlign: 'center',
          mb: 3,
          color: '#b0b0b0',
        }}
      >
        These documents will be appended to the PDF when downloading.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
        }}
      >
        <AttachmentCard
          title="Certificates"
          description="Professional certifications and training certificates"
          icon={<EmojiEvents sx={{ fontSize: 48 }} />}
          pdfPath={CERTIFICATES_PDF_PATH}
          downloadName="Benjamin_Grauer_Certificates.pdf"
        />
        <AttachmentCard
          title="References"
          description="Professional references and recommendations"
          icon={<ContactPage sx={{ fontSize: 48 }} />}
          pdfPath={REFERENCES_PDF_PATH}
          downloadName="Benjamin_Grauer_References.pdf"
        />
      </Box>
    </Box>
  );
};

export default CVAttachmentCards;
