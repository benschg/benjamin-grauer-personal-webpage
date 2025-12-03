'use client';

import { Card, CardContent, Button, Typography } from '@mui/material';
import { Download } from '@mui/icons-material';
import type { Document } from './content';

interface DocumentCardProps {
  document: Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  const IconComponent = document.icon;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-20%',
          left: '-150%',
          width: '200%',
          height: '140%',
          background:
            'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
          transition: 'left 0.8s ease',
          zIndex: 1,
          pointerEvents: 'none',
        },
        '&:hover::before': {
          left: '100%',
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <IconComponent
          sx={{
            fontSize: '3rem',
            color: 'primary.main',
            mb: 2,
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontSize: '1.2rem',
            fontWeight: 600,
            mb: 1,
            color: 'text.primary',
          }}
        >
          {document.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          {document.description}
        </Typography>
      </CardContent>
      <Button
        variant="contained"
        startIcon={<Download />}
        href={document.downloadUrl}
        download={document.downloadAs}
        sx={{
          mt: 'auto',
          mx: 2,
          mb: 1,
        }}
      >
        Download {document.fileType}
      </Button>
    </Card>
  );
};

export default DocumentCard;
