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
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '@/contexts';

interface ShareLink {
  id: string;
  shortCode: string;
  shortUrl: string;
  fullUrl: string;
  versionName: string;
  createdAt: string;
  totalVisits: number;
  uniqueVisits: number;
  lastVisitedAt: string | null;
}

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  currentUrl: string;
  cvVersionId?: string;
}

const ShareDialog = ({ open, onClose, currentUrl, cvVersionId }: ShareDialogProps) => {
  const { user } = useAuth();
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [allLinks, setAllLinks] = useState<ShareLink[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);

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
  }, [currentUrl, cvVersionId, isAdmin]);

  // Fetch all links for dashboard
  const fetchAllLinks = useCallback(async () => {
    if (!isAdmin) return;

    setIsLoadingLinks(true);
    try {
      const response = await fetch('/api/share-link');
      if (response.ok) {
        const data = await response.json();
        setAllLinks(data.links || []);
      }
    } catch (err) {
      console.error('Error fetching links:', err);
    } finally {
      setIsLoadingLinks(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (open && isAdmin) {
      createShortLink();
      fetchAllLinks();
    }
  }, [open, isAdmin, createShortLink, fetchAllLinks]);

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

  const handleDeleteLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/share-link?id=${linkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAllLinks((prev) => prev.filter((link) => link.id !== linkId));
      }
    } catch (err) {
      console.error('Error deleting link:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
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

  // Admin view with short URL and dashboard
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
          maxHeight: '80vh',
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

        {/* Dashboard Section */}
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Typography
          variant="subtitle2"
          sx={{
            fontFamily: 'Orbitron',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.7)',
            mb: 2,
          }}
        >
          Shared Links Dashboard
        </Typography>

        {isLoadingLinks ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} sx={{ color: '#89665d' }} />
          </Box>
        ) : allLinks.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 2 }}
          >
            No shared links yet
          </Typography>
        ) : (
          <List sx={{ py: 0 }}>
            {allLinks.map((link) => (
              <ListItem
                key={link.id}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderRadius: 1,
                  mb: 1,
                  pr: 12,
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace', color: '#89665d' }}
                      >
                        /s/{link.shortCode}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        → {link.versionName}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                      <Tooltip title={`${link.uniqueVisits} unique / ${link.totalVisits} total visits`}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <VisibilityIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {link.totalVisits}
                          </Typography>
                        </Box>
                      </Tooltip>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Last: {formatRelativeTime(link.lastVisitedAt)}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Open link">
                    <IconButton
                      size="small"
                      onClick={() => window.open(link.shortUrl, '_blank')}
                      sx={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy link">
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(link.shortUrl)}
                      sx={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete link">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteLink(link.id)}
                      sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#f44336' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
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
