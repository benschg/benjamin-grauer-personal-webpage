'use client';

import { Box, Typography, IconButton, Tooltip, type SxProps, type Theme } from '@mui/material';
import { Link as LinkIcon, Check as CheckIcon } from '@mui/icons-material';
import { useState } from 'react';

interface SectionTitleProps {
  id: string;
  title: string;
  variant?: 'h2' | 'h3';
  sx?: SxProps<Theme>;
  centered?: boolean;
}

const SectionTitle = ({ id, title, variant = 'h2', sx, centered = false }: SectionTitleProps) => {
  const [showLink, setShowLink] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    window.history.replaceState(null, '', `#${id}`);
  };

  const defaultSx: SxProps<Theme> =
    variant === 'h2'
      ? {
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          color: 'text.primary',
        }
      : {
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontWeight: 700,
        };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: centered ? 'center' : 'flex-start',
        gap: 1,
      }}
      onMouseEnter={() => setShowLink(true)}
      onMouseLeave={() => setShowLink(false)}
    >
      <Typography variant={variant} component="h2" sx={{ ...defaultSx, ...sx }}>
        {title}
      </Typography>
      <Tooltip title={copied ? 'Copied!' : 'Copy link'} arrow>
        <IconButton
          onClick={handleCopyLink}
          sx={{
            opacity: showLink || copied ? 0.7 : 0,
            transition: 'opacity 0.2s ease',
            color: copied ? 'success.main' : 'inherit',
            '&:hover': {
              opacity: 1,
              color: copied ? 'success.main' : 'primary.main',
            },
          }}
          aria-label={`Copy link to ${title} section`}
        >
          {copied ? (
            <CheckIcon sx={{ fontSize: variant === 'h2' ? '1.5rem' : '2rem' }} />
          ) : (
            <LinkIcon sx={{ fontSize: variant === 'h2' ? '1.5rem' : '2rem' }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SectionTitle;
