'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '@/contexts';
import type { DisplaySettings } from './contexts/types';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  currentUrl: string;
  cvVersionId?: string;
  settings?: DisplaySettings;
}

const ShareDialog = ({ open, onClose, currentUrl, cvVersionId, settings }: ShareDialogProps) => {
  const { isAdmin } = useAuth();

  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Create or get short link when dialog opens
  const createShortLink = useCallback(async () => {
    if (!isAdmin) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/share-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullUrl: currentUrl,
          cvVersionId,
          settings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create share link');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      console.error('Error creating share link:', err);
      setError('Failed to create share link');
    } finally {
      setIsLoading(false);
    }
  }, [currentUrl, cvVersionId, settings, isAdmin]);

  useEffect(() => {
    if (open && isAdmin) {
      createShortLink();
    }
  }, [open, isAdmin, createShortLink]);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareLinkedIn = () => {
    const url = shortUrl || currentUrl;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const url = shortUrl || currentUrl;
    const text = "Check out my CV!";
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareEmail = () => {
    const url = shortUrl || currentUrl;
    const subject = "Benjamin Grauer - CV";
    const body = `Hi,\n\nPlease find my CV at the following link:\n${url}\n\nBest regards,\nBenjamin`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  // Non-admin view - just show the current URL to copy
  if (!isAdmin) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#343a40',
            color: 'white',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: 'Orbitron', letterSpacing: '0.05em' }}>
            Share CV
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={currentUrl}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleCopy(currentUrl)} sx={{ color: 'white' }}>
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<LinkedInIcon />}
              onClick={handleShareLinkedIn}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { borderColor: '#0A66C2', bgcolor: 'rgba(10,102,194,0.1)' },
              }}
            >
              LinkedIn
            </Button>
            <Button
              variant="outlined"
              startIcon={<Box component="span" sx={{ fontSize: '1.2rem' }}>𝕏</Box>}
              onClick={handleShareTwitter}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Twitter
            </Button>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={handleShareEmail}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { borderColor: '#89665d', bgcolor: 'rgba(137,102,93,0.1)' },
              }}
            >
              Email
            </Button>
          </Box>
        </DialogContent>

        <Snackbar
          open={copySuccess}
          autoHideDuration={2000}
          onClose={() => setCopySuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setCopySuccess(false)}>
            Link copied to clipboard!
          </Alert>
        </Snackbar>
      </Dialog>
    );
  }

  // Admin view with short URL
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#343a40',
          color: 'white',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontFamily: 'Orbitron', letterSpacing: '0.05em' }}>
          Share CV
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        {/* Short URL Section */}
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
          Shareable Short Link
        </Typography>
        <TextField
          fullWidth
          value={isLoading ? 'Creating link...' : (shortUrl || currentUrl)}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                {isLoading ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <IconButton
                    onClick={() => handleCopy(shortUrl || currentUrl)}
                    sx={{ color: 'white' }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            sx: {
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              fontFamily: 'monospace',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
            },
          }}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        {/* Share Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<LinkedInIcon />}
            onClick={handleShareLinkedIn}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': { borderColor: '#0A66C2', bgcolor: 'rgba(10,102,194,0.1)' },
            }}
          >
            LinkedIn
          </Button>
          <Button
            variant="outlined"
            startIcon={<Box component="span" sx={{ fontSize: '1.2rem' }}>𝕏</Box>}
            onClick={handleShareTwitter}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Twitter
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={handleShareEmail}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': { borderColor: '#89665d', bgcolor: 'rgba(137,102,93,0.1)' },
            }}
          >
            Email
          </Button>
        </Box>
      </DialogContent>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setCopySuccess(false)}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ShareDialog;
