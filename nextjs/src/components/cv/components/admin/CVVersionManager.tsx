'use client';

import {
  Box,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useCVVersion } from '../../contexts';
import type { CVVersion, CVVersionContent } from '@/types/database.types';
import GeneratedContentPreview from './GeneratedContentPreview';
import { modernScrollbarSx } from './CVCustomizationDialog';

const CVVersionManager = () => {
  const { versions, activeVersion, selectVersion, deleteVersion, updateVersion } =
    useCVVersion();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<CVVersion | null>(null);
  const [previewVersion, setPreviewVersion] = useState<CVVersion | null>(null);
  const [editVersion, setEditVersion] = useState<CVVersion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; version: CVVersion } | null>(null);

  // Filter versions based on search query
  const filteredVersions = versions.filter((version) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = version.name.toLowerCase().includes(query);
    const companyMatch = version.job_context?.company?.toLowerCase().includes(query);
    const positionMatch = version.job_context?.position?.toLowerCase().includes(query);
    return nameMatch || companyMatch || positionMatch;
  });

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

  const handleEditSave = async (name: string, content: CVVersionContent) => {
    if (editVersion) {
      await updateVersion(editVersion.id, { name, content });
      setEditVersion(null);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexShrink: 0 }}>
        <Typography variant="h6" sx={{ flexShrink: 0 }}>
          Saved Versions
        </Typography>
        <TextField
          size="small"
          placeholder="Search versions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer sx={{ flex: 1, overflow: 'auto', minHeight: 0, ...modernScrollbarSx }}>
        {filteredVersions.length === 0 && searchQuery ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No versions match &quot;{searchQuery}&quot;
            </Typography>
          </Box>
        ) : (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper', width: 48 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVersions.map((version) => (
                <TableRow
                  key={version.id}
                  hover
                  sx={{
                    bgcolor: activeVersion?.id === version.id ? 'action.selected' : 'transparent',
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {version.job_context?.company || version.name}
                      {activeVersion?.id === version.id && (
                        <Chip label="Active" size="small" color="success" variant="outlined" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{version.job_context?.position || '—'}</TableCell>
                  <TableCell>{formatDate(version.created_at)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => setMenuAnchor({ el: e.currentTarget, version })}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor?.el}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            if (menuAnchor) {
              setPreviewVersion(menuAnchor.version);
              setMenuAnchor(null);
            }
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          Preview
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor) {
              setEditVersion(menuAnchor.version);
              setMenuAnchor(null);
            }
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor) {
              selectVersion(menuAnchor.version.id);
              setMenuAnchor(null);
            }
          }}
          disabled={menuAnchor?.version.id === activeVersion?.id}
        >
          <ListItemIcon>
            <StarBorderIcon fontSize="small" />
          </ListItemIcon>
          Select
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            if (menuAnchor) {
              handleDeleteClick(menuAnchor.version);
              setMenuAnchor(null);
            }
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Version?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{versionToDelete?.name}&quot;? This action cannot be undone.
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
              {/* Job Context Section */}
              {previewVersion.job_context && (
                <>
                  <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Job Application Context
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {previewVersion.job_context.company && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                            Company:
                          </Typography>
                          <Typography variant="body2">{previewVersion.job_context.company}</Typography>
                        </Box>
                      )}
                      {previewVersion.job_context.position && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                            Job Title:
                          </Typography>
                          <Typography variant="body2">{previewVersion.job_context.position}</Typography>
                        </Box>
                      )}
                      {previewVersion.job_context.jobPostingUrl && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                            URL:
                          </Typography>
                          <Link
                            href={previewVersion.job_context.jobPostingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            sx={{ wordBreak: 'break-all' }}
                          >
                            {previewVersion.job_context.jobPostingUrl}
                          </Link>
                        </Box>
                      )}
                      {previewVersion.job_context.companyWebsite && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                            Website:
                          </Typography>
                          <Link
                            href={previewVersion.job_context.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                          >
                            {previewVersion.job_context.companyWebsite}
                          </Link>
                        </Box>
                      )}
                    </Box>

                    {/* Job Posting Text in Accordion */}
                    {previewVersion.job_context.jobPosting && (
                      <Accordion sx={{ mt: 2, bgcolor: 'background.paper' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body2">View Job Posting Text</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography
                            variant="body2"
                            component="pre"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              fontFamily: 'inherit',
                              m: 0,
                              maxHeight: 300,
                              overflow: 'auto',
                            }}
                          >
                            {previewVersion.job_context.jobPosting}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Box>
                  <Divider />
                </>
              )}

              {/* Generated Content */}
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

      {/* Edit Dialog with GeneratedContentPreview */}
      <Dialog
        open={!!editVersion}
        onClose={() => setEditVersion(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Version: {editVersion?.name}
          <IconButton
            onClick={() => setEditVersion(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <DeleteIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editVersion && editVersion.job_context?.companyResearch && (
            <GeneratedContentPreview
              originalContent={{
                tagline: '',
                profile: '',
                slogan: '',
              }}
              generatedContent={editVersion.content}
              companyResearch={editVersion.job_context.companyResearch}
              jobInputData={{
                company: editVersion.job_context.company,
                jobTitle: editVersion.job_context.position,
                jobPosting: editVersion.job_context.jobPosting || '',
                jobPostingUrl: editVersion.job_context.jobPostingUrl,
                companyWebsite: editVersion.job_context.companyWebsite,
                dataSourceSelection: editVersion.job_context.dataSourceSelection,
              }}
              onSave={handleEditSave}
              isSaving={false}
            />
          )}
          {editVersion && !editVersion.job_context?.companyResearch && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                This version doesn&apos;t have stored job context data.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI regeneration is not available for versions created before the context storage
                feature. You can still edit text manually using the inline editor on the CV page.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CVVersionManager;
