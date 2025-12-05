'use client';

import { Box, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useCVVersion } from '../../contexts';
import CVVersionSelector from './CVVersionSelector';

// Shared styles for compact buttons
const compactButtonSx = {
  flexShrink: 0,
  py: 0,
  px: 0.5,
  minHeight: 24,
  fontSize: '0.75rem',
};

// Shared styles for admin icon buttons
const adminIconButtonSx = {
  color: '#89665d',
  p: 0.5,
  flexShrink: 0,
};

// Shared styles for truncating text containers
const truncatingTextSx = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
};

// Shared styles for flex row containers that allow truncation
const truncatingFlexRowSx = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  px: 2,
  minWidth: 0,
};

interface CVAdminBarProps {
  onCustomizationOpen: () => void;
  onLlmInputDataOpen: () => void;
}

const CVAdminBar = ({ onCustomizationOpen, onLlmInputDataOpen }: CVAdminBarProps) => {
  const {
    activeVersion,
    isEditing,
    startEditing,
    cancelEditing,
    saveEdits,
    isSaving,
  } = useCVVersion();

  if (isEditing) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          py: 0.25,
          bgcolor: 'rgba(46, 125, 50, 0.95)',
        }}
      >
        <Box
          sx={{
            ...truncatingFlexRowSx,
            gap: 1,
            justifyContent: 'space-between',
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<CancelIcon sx={{ fontSize: 14 }} />}
            onClick={cancelEditing}
            disabled={isSaving}
            sx={{
              ...compactButtonSx,
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Cancel
          </Button>
          <Box
            sx={{
              ...truncatingTextSx,
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 500,
              flex: '1 1 auto',
              textAlign: 'center',
              px: 1,
            }}
          >
            Editing: {activeVersion?.name || 'Default CV'}
          </Box>
          <Button
            size="small"
            variant="contained"
            startIcon={isSaving ? <CircularProgress size={12} color="inherit" /> : <SaveIcon sx={{ fontSize: 14 }} />}
            onClick={saveEdits}
            disabled={isSaving}
            sx={{
              ...compactButtonSx,
              bgcolor: 'white',
              color: '#2e7d32',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.5)' },
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        py: 0.25,
        bgcolor: 'rgba(26, 29, 32, 0.95)',
      }}
    >
      <Box
        sx={{
          ...truncatingFlexRowSx,
          gap: 1,
          justifyContent: 'center',
        }}
      >
        <Box sx={{ minWidth: 0, flex: '0 1 auto', overflow: 'hidden' }}>
          <CVVersionSelector />
        </Box>
        {/* Show LLM input data button when a custom version is selected */}
        {activeVersion?.job_context && (
          <Tooltip title="View LLM Input Data">
            <IconButton
              size="small"
              onClick={onLlmInputDataOpen}
              sx={{ ...adminIconButtonSx, color: 'rgba(137, 102, 93, 0.7)' }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="AI Customization">
          <IconButton
            size="small"
            onClick={onCustomizationOpen}
            sx={adminIconButtonSx}
          >
            <AutoAwesomeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {activeVersion && (
          <Tooltip title="Edit CV inline">
            <IconButton
              size="small"
              onClick={startEditing}
              sx={adminIconButtonSx}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default CVAdminBar;
