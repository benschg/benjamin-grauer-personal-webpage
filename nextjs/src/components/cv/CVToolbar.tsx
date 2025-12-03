'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
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
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AttachFileOffIcon from '@mui/icons-material/LinkOff';
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
    showAttachments,
    toggleAttachments,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
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
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const handleBack = () => {
    router.push('/working-life');
  };

  const handleSpeedDialClose = () => {
    setSpeedDialOpen(false);
  };

  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
  };

  return (
    <>
      {/* Top Toolbar */}
      <Box className="cv-toolbar cv-no-print">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            color: 'white',
            minWidth: 'auto',
            '& .MuiButton-startIcon': {
              margin: { xs: 0, sm: '0 8px 0 -4px' },
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Back to Working Life
          </Box>
        </Button>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Orbitron',
            letterSpacing: '0.1em',
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
            Curriculum Vitae
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
            CV
          </Box>
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
              <IconButton onClick={signOut} sx={{ color: 'white' }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Admin Sign In">
              <IconButton onClick={signIn} sx={{ color: '#666' }}>
                <LoginIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Separator */}
          <Box
            sx={{
              width: '1px',
              height: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              mx: 1,
              display: { xs: 'none', md: 'block' },
            }}
          />

          {onDownloadPdf && (
            <Tooltip title={isDownloading ? 'Generating PDF...' : 'Download PDF'}>
              <span>
                <IconButton
                  onClick={onDownloadPdf}
                  disabled={isDownloading}
                  sx={{ color: 'white', display: { xs: 'none', md: 'inline-flex' } }}
                >
                  {isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Tooltip title="Print">
            <IconButton onClick={onPrint} sx={{ color: 'white', display: { xs: 'none', md: 'inline-flex' } }}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* AI Customization Dialog */}
        <CVCustomizationDialog open={customizationOpen} onClose={() => setCustomizationOpen(false)} />
      </Box>

      {/* Floating Sidebar for Display Toggles - Desktop Only */}
      <Box className="cv-floating-sidebar cv-no-print" sx={{ display: { xs: 'none', md: 'flex' } }}>
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
        <Tooltip title={showAttachments ? 'Hide Attachments (Certificates & References)' : 'Show Attachments (Certificates & References)'} placement="left">
          <IconButton
            onClick={toggleAttachments}
            sx={{ color: showAttachments ? 'white' : 'rgba(255,255,255,0.4)' }}
          >
            {showAttachments ? <AttachFileIcon /> : <AttachFileOffIcon />}
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

      {/* Bottom Zoom Bar - Always Visible */}
      <Box className="cv-bottom-zoom-bar cv-no-print">
        <IconButton onClick={zoomOut} size="small" sx={{ color: 'white' }}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Tooltip title={zoom === 0 ? 'Auto' : 'Reset to Auto'} placement="top">
          <Button
            onClick={resetZoom}
            size="small"
            sx={{
              color: zoom === 0 ? 'rgba(255,255,255,0.5)' : 'white',
              minWidth: '50px',
              fontSize: '0.75rem',
              padding: '2px 8px',
            }}
          >
            {zoom === 0 ? 'Auto' : `${Math.round(zoom * 100)}%`}
          </Button>
        </Tooltip>
        <IconButton onClick={zoomIn} size="small" sx={{ color: 'white' }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Mobile SpeedDial - All Controls */}
      <Box
        className="cv-no-print"
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
        }}
      >
        <SpeedDial
          ariaLabel="CV Controls"
          direction="up"
          icon={<SpeedDialIcon icon={<MenuIcon />} />}
          onClose={handleSpeedDialClose}
          onOpen={handleSpeedDialOpen}
          open={speedDialOpen}
          sx={{
            '& .MuiSpeedDial-fab': {
              bgcolor: '#343a40',
              '&:hover': {
                bgcolor: '#89665d',
              },
            },
          }}
        >
        {/* Print */}
        <SpeedDialAction
          icon={<PrintIcon />}
          tooltipTitle="Print"
          onClick={onPrint}
        />

        {/* Download PDF */}
        {onDownloadPdf && (
          <SpeedDialAction
            icon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
            tooltipTitle={isDownloading ? 'Generating...' : 'Download PDF'}
            onClick={() => {
              if (!isDownloading) {
                onDownloadPdf();
              }
            }}
          />
        )}

        {/* Private Info Toggle */}
        <SpeedDialAction
          icon={showPrivateInfo ? <LockOpenIcon /> : <LockIcon />}
          tooltipTitle={showPrivateInfo ? 'Hide Private Info' : 'Show Private Info'}
          onClick={togglePrivateInfo}
        />

        {/* Photo Toggle */}
        <SpeedDialAction
          icon={showPhoto ? <PersonIcon /> : <PersonOffIcon />}
          tooltipTitle={showPhoto ? 'Hide Photo' : 'Show Photo'}
          onClick={togglePhoto}
        />

        {/* Experience Toggle */}
        <SpeedDialAction
          icon={showExperience ? <WorkHistoryIcon /> : <WorkOffIcon />}
          tooltipTitle={showExperience ? 'Hide Experience' : 'Show Experience'}
          onClick={toggleExperience}
        />

        {/* Attachments Toggle */}
        <SpeedDialAction
          icon={showAttachments ? <AttachFileIcon /> : <AttachFileOffIcon />}
          tooltipTitle={showAttachments ? 'Hide Attachments' : 'Show Attachments'}
          onClick={toggleAttachments}
        />

        {/* Theme Toggle */}
        <SpeedDialAction
          icon={theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          tooltipTitle={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          onClick={toggleTheme}
        />
      </SpeedDial>
      </Box>
    </>
  );
};

export default CVToolbar;
