'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Box, Typography, IconButton, Tooltip, CircularProgress } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import { useCVTheme, useCVVersion } from './contexts';
import { useAuth } from '@/contexts';
import { CVVersionSelector, CVCustomizationDialog } from './components/admin';

interface CVToolbarProps {
  onPrint: () => void;
  onDownloadPdf?: () => void;
  isDownloading?: boolean;
}

const CVToolbar = ({ onPrint, onDownloadPdf, isDownloading }: CVToolbarProps) => {
  const router = useRouter();
  const {
    theme,
    toggleTheme,
    showPhoto,
    togglePhoto,
    showPrivateInfo,
    togglePrivateInfo,
    showExperience,
    toggleExperience,
  } = useCVTheme();
  const { user, isAdmin, signIn, signOut } = useAuth();
  const {
    activeVersion,
    isEditing,
    startEditing,
    cancelEditing,
    saveEdits,
    isSaving,
  } = useCVVersion();
  const [customizationOpen, setCustomizationOpen] = useState(false);

  const handleBack = () => {
    router.push('/working-life');
  };

  return (
    <>
      {/* Top Toolbar */}
      <Box className="cv-toolbar cv-no-print">
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ color: 'white' }}>
          Back to Working Life
        </Button>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Orbitron',
            letterSpacing: '0.1em',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Curriculum Vitae
        </Typography>
        <Box className="cv-toolbar-actions">
          {/* Admin controls - only show when admin is logged in */}
          {isAdmin && (
            <>
              <CVVersionSelector />
              <Tooltip title="AI Customization">
                <IconButton onClick={() => setCustomizationOpen(true)} sx={{ color: 'white', ml: 1 }}>
                  <AutoAwesomeIcon />
                </IconButton>
              </Tooltip>
              {/* Inline editing controls */}
              {activeVersion && !isEditing && (
                <Tooltip title="Edit CV inline">
                  <IconButton onClick={startEditing} sx={{ color: 'white', ml: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              {isEditing && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                    onClick={saveEdits}
                    disabled={isSaving}
                    sx={{ ml: 1 }}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={cancelEditing}
                    disabled={isSaving}
                    sx={{ ml: 1, borderColor: 'error.main', color: 'error.main' }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </>
          )}

          {/* Auth button */}
          {user ? (
            <Tooltip title={`Sign out (${user.email})`}>
              <IconButton onClick={signOut} sx={{ color: 'white', mr: 1 }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Admin Sign In">
              <IconButton onClick={signIn} sx={{ color: '#666', mr: 1 }}>
                <LoginIcon />
              </IconButton>
            </Tooltip>
          )}

          {onDownloadPdf && (
            <Tooltip title={isDownloading ? 'Generating PDF...' : 'Download PDF'}>
              <span>
                <IconButton
                  onClick={onDownloadPdf}
                  disabled={isDownloading}
                  sx={{ color: 'white' }}
                >
                  {isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Tooltip title="Print">
            <IconButton onClick={onPrint} sx={{ color: 'white' }}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* AI Customization Dialog */}
        <CVCustomizationDialog open={customizationOpen} onClose={() => setCustomizationOpen(false)} />
      </Box>

      {/* Floating Sidebar for Display Toggles */}
      <Box className="cv-floating-sidebar cv-no-print">
        <Tooltip title={showPrivateInfo ? 'Hide Private Info' : 'Show Private Info'} placement="left">
          <IconButton
            onClick={togglePrivateInfo}
            sx={{ color: showPrivateInfo ? 'white' : 'rgba(255,255,255,0.4)' }}
          >
            {showPrivateInfo ? <LockOpenIcon /> : <LockIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={showPhoto ? 'Hide Photo' : 'Show Photo'} placement="left">
          <IconButton
            onClick={togglePhoto}
            sx={{ color: showPhoto ? 'white' : 'rgba(255,255,255,0.4)' }}
          >
            {showPhoto ? <PersonIcon /> : <PersonOffIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={showExperience ? 'Hide Experience Details' : 'Show Experience Details'} placement="left">
          <IconButton
            onClick={toggleExperience}
            sx={{ color: showExperience ? 'white' : 'rgba(255,255,255,0.4)' }}
          >
            {showExperience ? <WorkHistoryIcon /> : <WorkOffIcon />}
          </IconButton>
        </Tooltip>
        <Box
          sx={{
            width: '24px',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            my: 0.5,
          }}
        />
        <Tooltip title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement="left">
          <IconButton onClick={toggleTheme} sx={{ color: 'white' }}>
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default CVToolbar;
