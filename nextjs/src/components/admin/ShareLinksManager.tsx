'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
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

  // Visits cache - load on demand when tooltip opens
  const [visitsCache, setVisitsCache] = useState<Record<string, Visit[]>>({});
  const [loadingVisits, setLoadingVisits] = useState<string | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<ShareLink | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<ShareLink | null>(null);
  const [editSettings, setEditSettings] = useState<DisplaySettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleEditClick = (link: ShareLink) => {
    setLinkToEdit(link);
    setEditSettings({ ...link.settings });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!linkToEdit || !editSettings) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/share-link', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: linkToEdit.id,
          settings: editSettings,
        }),
      });

      if (response.ok) {
        // Update local state
        setLinks((prev) =>
          prev.map((link) =>
            link.id === linkToEdit.id
              ? { ...link, settings: editSettings }
              : link
          )
        );
        setEditDialogOpen(false);
        setLinkToEdit(null);
        setEditSettings(null);
      } else {
        setError('Failed to update settings');
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setLinkToEdit(null);
    setEditSettings(null);
  };

  // Fetch visits for a link when tooltip opens
  const fetchVisitsForLink = async (linkId: string) => {
    if (visitsCache[linkId] || loadingVisits === linkId) return;

    setLoadingVisits(linkId);
    try {
      const response = await fetch(`/api/share-link/${linkId}/visits`);
      if (response.ok) {
        const data = await response.json();
        setVisitsCache(prev => ({ ...prev, [linkId]: data.visits || [] }));
      }
    } catch (err) {
      console.error('Error fetching visits:', err);
    } finally {
      setLoadingVisits(null);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile':
        return <PhoneAndroidIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', mr: 0.5 }} />;
      case 'Tablet':
        return <TabletIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', mr: 0.5 }} />;
      default:
        return <ComputerIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', mr: 0.5 }} />;
    }
  };

  const renderVisitsTooltip = (link: ShareLink) => {
    const visits = visitsCache[link.id];
    const isLoading = loadingVisits === link.id;

    if (link.totalVisits === 0) {
      return 'No visits yet';
    }

    if (isLoading || !visits) {
      return (
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" sx={{ fontFamily: 'Quicksand, sans-serif' }}>Loading visits...</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 1, maxWidth: 300, fontFamily: 'Quicksand, sans-serif' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontFamily: 'Quicksand, sans-serif' }}>
          Recent Visits ({link.uniqueVisits} unique / {link.totalVisits} total)
        </Typography>
        {visits.slice(0, 10).map((visit, idx) => (
          <Box key={visit.id} sx={{ display: 'flex', alignItems: 'center', py: 0.5, borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            {getDeviceIcon(visit.device)}
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ display: 'block', fontFamily: 'Quicksand, sans-serif' }}>
                {visit.browser} · {visit.device}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Quicksand, sans-serif' }}>
                {formatRelativeTime(visit.visitedAt)}
              </Typography>
            </Box>
          </Box>
        ))}
        {visits.length > 10 && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 1, fontFamily: 'Quicksand, sans-serif' }}>
            +{visits.length - 10} more visits
          </Typography>
        )}
      </Box>
    );
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
                    <Tooltip
                      title={renderVisitsTooltip(link)}
                      onOpen={() => fetchVisitsForLink(link.id)}
                      placement="bottom"
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            bgcolor: '#2a2e32',
                            '& .MuiTooltip-arrow': { color: '#2a2e32' },
                            maxWidth: 350,
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          cursor: 'pointer',
                          py: 0.5,
                          px: 1,
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                        <Typography sx={{ color: 'white' }}>{link.uniqueVisits} / {link.totalVisits}</Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    {formatRelativeTime(link.lastVisitedAt)}
                  </TableCell>
                  <TableCell sx={{ borderColor: 'rgba(255,255,255,0.1)' }} align="right">
                    <Tooltip title="Edit settings">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(link)}
                        sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#89665d' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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

      {/* Edit Settings Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#343a40',
            color: 'white',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Orbitron', fontSize: '1.1rem' }}>
          Edit Share Link Settings
        </DialogTitle>
        <DialogContent>
          {linkToEdit && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  color: '#89665d',
                  fontSize: '0.9rem',
                }}
              >
                /s/{linkToEdit.shortCode}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                {linkToEdit.versionName}
              </Typography>
            </Box>
          )}

          {editSettings && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Theme */}
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  Theme
                </Typography>
                <ToggleButtonGroup
                  value={editSettings.theme}
                  exclusive
                  onChange={(_, value) => value && setEditSettings({ ...editSettings, theme: value })}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      color: 'rgba(255,255,255,0.5)',
                      borderColor: 'rgba(255,255,255,0.2)',
                      '&.Mui-selected': {
                        color: '#89665d',
                        bgcolor: 'rgba(137,102,93,0.2)',
                      },
                    },
                  }}
                >
                  <ToggleButton value="dark">
                    <DarkModeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                    Dark
                  </ToggleButton>
                  <ToggleButton value="light">
                    <LightModeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                    Light
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* Privacy Level */}
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  Privacy Level
                </Typography>
                <ToggleButtonGroup
                  value={editSettings.privacyLevel}
                  exclusive
                  onChange={(_, value) => value && setEditSettings({ ...editSettings, privacyLevel: value })}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      color: 'rgba(255,255,255,0.5)',
                      borderColor: 'rgba(255,255,255,0.2)',
                      '&.Mui-selected': {
                        color: '#89665d',
                        bgcolor: 'rgba(137,102,93,0.2)',
                      },
                    },
                  }}
                >
                  <ToggleButton value="none">None</ToggleButton>
                  <ToggleButton value="partial">Partial</ToggleButton>
                  <ToggleButton value="full">Full</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* Toggle switches */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editSettings.showPhoto}
                      onChange={(e) => setEditSettings({ ...editSettings, showPhoto: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#89665d' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#89665d' },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="body2">Show Photo</Typography>
                    </Box>
                  }
                  sx={{ color: 'white' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={editSettings.showExperience}
                      onChange={(e) => setEditSettings({ ...editSettings, showExperience: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#89665d' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#89665d' },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkHistoryIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="body2">Show Experience Pages</Typography>
                    </Box>
                  }
                  sx={{ color: 'white' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={editSettings.showAttachments}
                      onChange={(e) => setEditSettings({ ...editSettings, showAttachments: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#89665d' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#89665d' },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFileIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="body2">Show Attachments</Typography>
                    </Box>
                  }
                  sx={{ color: 'white' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={editSettings.showExport}
                      onChange={(e) => setEditSettings({ ...editSettings, showExport: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#89665d' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#89665d' },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DownloadIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="body2">Open Export Panel</Typography>
                    </Box>
                  }
                  sx={{ color: 'white' }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleEditCancel}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            sx={{
              bgcolor: '#89665d',
              '&:hover': { bgcolor: '#6d5149' },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShareLinksManager;
