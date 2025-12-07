'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import LockIcon from '@mui/icons-material/Lock';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import ComputerIcon from '@mui/icons-material/Computer';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';
import type { DisplaySettings } from '@/components/cv/contexts/types';

interface Visit {
  id: string;
  visitedAt: string;
  ipHash: string;
  browser: string;
  device: string;
  referrer: string | null;
}

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
  settings: DisplaySettings;
}

const ShareLinksManager = () => {
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Visits popover state
  const [visitsAnchorEl, setVisitsAnchorEl] = useState<HTMLElement | null>(null);
  const [visitsLinkId, setVisitsLinkId] = useState<string | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<ShareLink | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/share-link');
      if (response.ok) {
        const data = await response.json();
        setLinks(data.links || []);
      } else {
        setError('Failed to load share links');
      }
    } catch (err) {
      console.error('Error fetching links:', err);
      setError('Failed to load share links');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDeleteClick = (link: ShareLink) => {
    setLinkToDelete(link);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/share-link?id=${linkToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLinks((prev) => prev.filter((link) => link.id !== linkToDelete.id));
        setDeleteDialogOpen(false);
        setLinkToDelete(null);
      } else {
        setError('Failed to delete link');
      }
    } catch (err) {
      console.error('Error deleting link:', err);
      setError('Failed to delete link');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setLinkToDelete(null);
  };

  // Fetch visits for a link on hover
  const fetchVisits = async (linkId: string) => {
    setVisitsLoading(true);
    try {
      const response = await fetch(`/api/share-link/${linkId}/visits`);
      if (response.ok) {
        const data = await response.json();
        setVisits(data.visits || []);
      }
    } catch (err) {
      console.error('Error fetching visits:', err);
    } finally {
      setVisitsLoading(false);
    }
  };

  const handleVisitsHover = (event: React.MouseEvent<HTMLElement>, linkId: string) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Delay showing popover to avoid flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setVisitsAnchorEl(event.currentTarget);
      setVisitsLinkId(linkId);
      fetchVisits(linkId);
    }, 300);
  };

  const handleVisitsLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setVisitsAnchorEl(null);
    setVisitsLinkId(null);
    setVisits([]);
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile':
        return <PhoneAndroidIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />;
      case 'Tablet':
        return <TabletIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />;
      default:
        return <ComputerIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#89665d' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Share Links
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Track visits to your shared CV links
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchLinks} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {links.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'rgba(255,255,255,0.5)' }}>
          <Typography>No share links yet.</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Create one by clicking the share button on the CV page.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Short Code
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Version
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Settings
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }} align="center">
                  Visits
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Last Visit
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: 'monospace',
                        color: '#89665d',
                        bgcolor: 'rgba(137,102,93,0.1)',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      /s/{link.shortCode}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <Chip
                      label={link.versionName || 'Default'}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Tooltip title={link.settings?.theme === 'light' ? 'Light mode' : 'Dark mode'}>
                        {link.settings?.theme === 'light' ? (
                          <LightModeIcon sx={{ fontSize: 16, color: '#ffd54f' }} />
                        ) : (
                          <DarkModeIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                        )}
                      </Tooltip>
                      <Tooltip title={link.settings?.showPhoto ? 'Photo shown' : 'Photo hidden'}>
                        {link.settings?.showPhoto ? (
                          <PersonIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                        ) : (
                          <PersonOffIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }} />
                        )}
                      </Tooltip>
                      {link.settings?.privacyLevel !== 'none' && (
                        <Tooltip title={`Privacy: ${link.settings?.privacyLevel}`}>
                          <LockIcon sx={{ fontSize: 16, color: link.settings?.privacyLevel === 'full' ? '#4caf50' : '#ff9800' }} />
                        </Tooltip>
                      )}
                      {link.settings?.showExperience && (
                        <Tooltip title="Experience pages included">
                          <WorkHistoryIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                        </Tooltip>
                      )}
                      {link.settings?.showAttachments && (
                        <Tooltip title="Attachments included">
                          <AttachFileIcon sx={{ fontSize: 16, color: '#89665d' }} />
                        </Tooltip>
                      )}
                      {link.settings?.showExport && (
                        <Tooltip title="Export panel visible">
                          <DownloadIcon sx={{ fontSize: 16, color: '#89665d' }} />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderColor: 'rgba(255,255,255,0.1)' }} align="center">
                    <Box
                      onMouseEnter={(e) => link.totalVisits > 0 && handleVisitsHover(e, link.id)}
                      onMouseLeave={handleVisitsLeave}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        cursor: link.totalVisits > 0 ? 'pointer' : 'default',
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        '&:hover': link.totalVisits > 0 ? { bgcolor: 'rgba(255,255,255,0.05)' } : {},
                      }}
                    >
                      <VisibilityIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography sx={{ color: 'white' }}>{link.uniqueVisits} / {link.totalVisits}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    {formatRelativeTime(link.lastVisitedAt)}
                  </TableCell>
                  <TableCell sx={{ borderColor: 'rgba(255,255,255,0.1)' }} align="right">
                    <Tooltip title="Open link">
                      <IconButton
                        size="small"
                        onClick={() => window.open(link.shortUrl, '_blank')}
                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={copySuccess === link.id ? 'Copied!' : 'Copy link'}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(link.shortUrl, link.id)}
                        sx={{ color: copySuccess === link.id ? '#4caf50' : 'rgba(255,255,255,0.5)' }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete link">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(link)}
                        sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#f44336' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          <strong>Total Links:</strong> {links.length} &nbsp;|&nbsp;
          <strong>Total Visits:</strong> {links.reduce((sum, l) => sum + l.totalVisits, 0)} &nbsp;|&nbsp;
          <strong>Unique Visitors:</strong> {links.reduce((sum, l) => sum + l.uniqueVisits, 0)}
        </Typography>
      </Box>

      {/* Visits Popover */}
      <Popover
        open={Boolean(visitsAnchorEl)}
        anchorEl={visitsAnchorEl}
        onClose={handleVisitsLeave}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        disableRestoreFocus
        sx={{
          pointerEvents: 'none',
          '& .MuiPopover-paper': {
            pointerEvents: 'auto',
            bgcolor: '#2a2e32',
            color: 'white',
            maxHeight: 300,
            minWidth: 350,
          },
        }}
      >
        <Box sx={{ p: 2 }} onMouseLeave={handleVisitsLeave}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'rgba(255,255,255,0.7)' }}>
            Recent Visits
          </Typography>
          {visitsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={20} sx={{ color: '#89665d' }} />
            </Box>
          ) : visits.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              No visits yet
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {visits.map((visit) => (
                <Box
                  key={visit.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 0.75,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  {getDeviceIcon(visit.device)}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {visit.browser} · {visit.device}
                    </Typography>
                    {visit.referrer && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255,255,255,0.4)',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        from {new URL(visit.referrer).hostname}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                    {formatRelativeTime(visit.visitedAt)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Popover>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            bgcolor: '#343a40',
            color: 'white',
            minWidth: 350,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Orbitron', fontSize: '1.1rem' }}>
          Delete Share Link
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Are you sure you want to delete this share link?
          </Typography>
          {linkToDelete && (
            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  color: '#89665d',
                  fontSize: '0.9rem',
                }}
              >
                /s/{linkToDelete.shortCode}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                {linkToDelete.totalVisits} visits · {linkToDelete.versionName}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,0.5)' }}>
            This action cannot be undone. All visit statistics will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShareLinksManager;
