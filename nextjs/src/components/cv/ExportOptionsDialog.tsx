'use client';

import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import ExportOptionsContent from './ExportOptionsContent';

interface ExportOptionsDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDownloading?: boolean;
  headerHeight?: number;
}

export const EXPORT_PANEL_WIDTH = 380;

const ExportOptionsDialog = ({ open, onClose, onConfirm, isDownloading, headerHeight = 0 }: ExportOptionsDialogProps) => {
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up('md'));

  // Desktop: Side panel that slides in from right, positioned below header
  if (isDesktop) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: headerHeight,
          right: 0,
          height: `calc(100vh - ${headerHeight}px)`,
          width: EXPORT_PANEL_WIDTH,
          bgcolor: '#343a40',
          color: 'white',
          zIndex: 99, // Below the header (100)
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
        className="cv-no-print"
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: 'Orbitron', letterSpacing: '0.05em', fontSize: '1rem' }}
          >
            Export PDF
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)' }} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, pr: 3 }}>
          <ExportOptionsContent showDescription={false} />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            onClick={onClose}
            fullWidth
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            fullWidth
            startIcon={isDownloading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
            disabled={isDownloading}
            sx={{
              bgcolor: '#89665d',
              '&:hover': { bgcolor: '#6d524a' },
            }}
          >
            {isDownloading ? 'Generating...' : 'Download'}
          </Button>
        </Box>
      </Box>
    );
  }

  // Mobile: Dialog
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        zIndex: 10000,
      }}
      PaperProps={{
        sx: {
          bgcolor: '#343a40',
          color: 'white',
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: 'Orbitron', letterSpacing: '0.05em' }}>
        Export CV as PDF
      </DialogTitle>
      <DialogContent>
        <ExportOptionsContent />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          startIcon={isDownloading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
          disabled={isDownloading}
          sx={{
            bgcolor: '#89665d',
            '&:hover': { bgcolor: '#6d524a' },
          }}
        >
          {isDownloading ? 'Generating...' : 'Download PDF'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportOptionsDialog;
