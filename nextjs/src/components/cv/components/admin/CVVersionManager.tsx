'use client';

import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';
import { useCVVersion } from '../../contexts';
import type { CVVersion } from '@/types/database.types';

const CVVersionManager = () => {
  const { versions, activeVersion, selectVersion, deleteVersion, setDefaultVersion } =
    useCVVersion();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<CVVersion | null>(null);
  const [previewVersion, setPreviewVersion] = useState<CVVersion | null>(null);

  const handleDeleteClick = (version: CVVersion) => {
    setVersionToDelete(version);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (versionToDelete) {
      await deleteVersion(versionToDelete.id);
      setDeleteDialogOpen(false);
      setVersionToDelete(null);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (versions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          No custom versions yet. Generate one using the AI customization feature!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Saved Versions
      </Typography>

      <List>
        {versions.map((version) => (
          <ListItem
            key={version.id}
            sx={{
              bgcolor: activeVersion?.id === version.id ? 'action.selected' : 'transparent',
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {version.name}
                  {version.is_default && (
                    <Chip label="Default" size="small" color="primary" variant="outlined" />
                  )}
                </Box>
              }
              secondary={
                <>
                  {version.job_context && (
                    <Typography variant="caption" display="block">
                      {version.job_context.company} - {version.job_context.position}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(version.created_at)}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="Preview">
                <IconButton
                  onClick={() => {
                    selectVersion(version.id);
                    setPreviewVersion(version);
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={version.is_default ? 'Default version' : 'Set as default'}>
                <IconButton
                  onClick={() => setDefaultVersion(version.id)}
                  disabled={version.is_default}
                >
                  {version.is_default ? <StarIcon color="primary" /> : <StarBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDeleteClick(version)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Version?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{versionToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewVersion}
        onClose={() => setPreviewVersion(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{previewVersion?.name}</DialogTitle>
        <DialogContent>
          {previewVersion && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Tagline
                </Typography>
                <Typography>{previewVersion.content.tagline}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Profile
                </Typography>
                <Typography>{previewVersion.content.profile}</Typography>
              </Box>
              {previewVersion.content.slogan && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Slogan
                  </Typography>
                  <Typography>{previewVersion.content.slogan}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewVersion(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CVVersionManager;
