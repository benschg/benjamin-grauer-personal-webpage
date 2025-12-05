'use client';

import { useState } from 'react';
import type { CVUSPEntry } from '../types/CVTypes';
import { useCVVersion } from '../contexts';
import { regenerateCVItem } from '@/services/ai/gemini.service';
import EditableText from '../components/EditableText';
import { CV_CHARACTER_LIMITS } from '@/config/cv.config';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RestoreIcon from '@mui/icons-material/Restore';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Box, CircularProgress, Popover, TextField, Button, Typography, Tooltip } from '@mui/material';
import { cvData } from '../data/cvConfig';

interface CVUSPProps {
  data: CVUSPEntry[];
}

const CVUSP = ({ data }: CVUSPProps) => {
  // Default data from static config
  const defaultData = cvData.main.usp;
  const { isEditing, updateEditedContent, activeVersion, activeContent, regeneratingItems, setRegeneratingItem } =
    useCVVersion();

  const [popoverAnchor, setPopoverAnchor] = useState<{ element: HTMLElement; index: number } | null>(null);
  const [customInstructions, setCustomInstructions] = useState('');

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setPopoverAnchor({ element: event.currentTarget, index });
    setCustomInstructions('');
  };

  const handleClosePopover = () => {
    setPopoverAnchor(null);
    setCustomInstructions('');
  };

  const handleTitleChange = (index: number, newValue: string) => {
    const keyCompetences = [...(activeContent.keyCompetences || data)];
    keyCompetences[index] = { ...keyCompetences[index], title: newValue };
    updateEditedContent({ keyCompetences });
  };

  const handleDescriptionChange = (index: number, newValue: string) => {
    const keyCompetences = [...(activeContent.keyCompetences || data)];
    keyCompetences[index] = { ...keyCompetences[index], description: newValue };
    updateEditedContent({ keyCompetences });
  };

  const handleDelete = (index: number) => {
    const keyCompetences = [...(activeContent.keyCompetences || data)];
    keyCompetences.splice(index, 1);
    updateEditedContent({ keyCompetences });
  };

  const handleAdd = () => {
    const keyCompetences = [...(activeContent.keyCompetences || data)];
    keyCompetences.push({ title: 'New Competence', description: 'Description of this competence...' });
    updateEditedContent({ keyCompetences });
  };

  const handleReset = (index: number) => {
    if (index < defaultData.length) {
      const keyCompetences = [...(activeContent.keyCompetences || data)];
      keyCompetences[index] = { ...defaultData[index] };
      updateEditedContent({ keyCompetences });
    }
  };

  // Check if item differs from default
  const isModified = (index: number): boolean => {
    if (index >= defaultData.length) return true; // New items are always "modified"
    const current = data[index];
    const original = defaultData[index];
    return current.title !== original.title || current.description !== original.description;
  };

  const handleRegenerate = async (index: number, customInstructions?: string) => {
    const itemId = `keyCompetence-${index}`;
    if (!activeVersion?.job_context) return;

    const competence = data[index];
    setRegeneratingItem(itemId, true);
    try {
      const result = await regenerateCVItem({
        itemType: 'keyCompetence',
        currentValue: competence.title,
        context: {
          companyName: activeVersion.job_context.company,
          jobTitle: activeVersion.job_context.position,
          jobPosting: activeVersion.job_context.jobPosting,
          companyResearch: activeVersion.job_context.companyResearch,
          competenceTitle: competence.title,
          competenceDescription: competence.description,
        },
        customInstructions,
      });
      // Parse JSON response
      try {
        const parsed = JSON.parse(result.newValue);
        const keyCompetences = [...(activeContent.keyCompetences || data)];
        keyCompetences[index] = {
          title: parsed.title || competence.title,
          description: parsed.description || competence.description,
        };
        updateEditedContent({ keyCompetences });
      } catch {
        console.error('Failed to parse key competence response:', result.newValue);
      }
    } catch (error) {
      console.error('Failed to regenerate key competence:', error);
    } finally {
      setRegeneratingItem(itemId, false);
    }
  };

  const canRegenerate = isEditing && activeVersion?.job_context?.companyResearch;

  return (
    <div className="cv-section cv-usp">
      <h2>Key Competences</h2>
      <div className="cv-usp-list">
        {data.map((usp, index) => {
          const isRegenerating = regeneratingItems.has(`keyCompetence-${index}`);
          return (
            <div key={index} className="cv-usp-item" style={{ position: 'relative' }}>
              {isEditing && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    display: 'flex',
                    gap: 0.5,
                    zIndex: 10,
                  }}
                  className="cv-no-print"
                >
                  {canRegenerate && (
                    <Tooltip title="Regenerate with AI" arrow>
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenPopover(e, index)}
                        disabled={isRegenerating}
                        sx={{
                          bgcolor: 'rgba(100, 150, 255, 0.9)',
                          color: 'white',
                          width: 20,
                          height: 20,
                          '&:hover': {
                            bgcolor: 'rgba(50, 100, 255, 1)',
                          },
                          '&.Mui-disabled': {
                            bgcolor: 'rgba(100, 150, 255, 0.5)',
                            color: 'white',
                          },
                        }}
                      >
                        {isRegenerating ? (
                          <CircularProgress size={12} sx={{ color: 'white' }} />
                        ) : (
                          <AutoAwesomeIcon sx={{ fontSize: 12 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                  {isModified(index) && index < defaultData.length && (
                    <Tooltip title="Reset to default" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleReset(index)}
                        sx={{
                          bgcolor: 'rgba(255, 180, 100, 0.9)',
                          color: 'white',
                          width: 20,
                          height: 20,
                          '&:hover': {
                            bgcolor: 'rgba(255, 150, 50, 1)',
                          },
                        }}
                      >
                        <RestoreIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(index)}
                      sx={{
                        bgcolor: 'rgba(255, 100, 100, 0.9)',
                        color: 'white',
                        width: 20,
                        height: 20,
                        '&:hover': {
                          bgcolor: 'rgba(255, 50, 50, 1)',
                        },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              <EditableText
                value={usp.title}
                onChange={(newValue) => handleTitleChange(index, newValue)}
                isEditing={isEditing}
                variant="h3"
                maxLength={CV_CHARACTER_LIMITS.keyCompetenceTitle}
                placeholder="Competence title..."
              />
              <EditableText
                value={usp.description}
                onChange={(newValue) => handleDescriptionChange(index, newValue)}
                isEditing={isEditing}
                multiline
                variant="p"
                maxLength={CV_CHARACTER_LIMITS.keyCompetenceDescription}
                placeholder="Competence description..."
              />
            </div>
          );
        })}
        {/* Add button in edit mode */}
        {isEditing && (
          <Box className="cv-no-print" sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Tooltip title="Add new competence" arrow>
              <IconButton
                size="small"
                onClick={handleAdd}
                sx={{
                  bgcolor: 'rgba(100, 200, 100, 0.9)',
                  color: 'white',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    bgcolor: 'rgba(50, 180, 50, 1)',
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </div>
      <Popover
        open={!!popoverAnchor}
        anchorEl={popoverAnchor?.element}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        className="cv-no-print"
      >
        <Box sx={{ p: 2, width: 280 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Regenerate Key Competence
          </Typography>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={2}
            placeholder="Optional: Add custom instructions..."
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            sx={{ mb: 1.5 }}
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button size="small" onClick={handleClosePopover}>
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                if (popoverAnchor) {
                  handleRegenerate(popoverAnchor.index, customInstructions || undefined);
                  handleClosePopover();
                }
              }}
              startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
            >
              Regenerate
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default CVUSP;
