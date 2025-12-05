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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
  Fab,
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
import SecurityIcon from '@mui/icons-material/Security';
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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useCVTheme, useCVVersion } from './contexts';
import { CERTIFICATES_PDF_PATH, REFERENCES_PDF_PATH } from '@/components/working-life/content';
import { useAuth } from '@/contexts';
import { CVVersionSelector, CVCustomizationDialog, LLMInputDataDialog } from './components/admin';
import type { DocumentTab } from '@/app/working-life/cv/page';

interface CVToolbarProps {
  onPrint: () => void;
  onDownloadPdf?: () => void;
  isDownloading?: boolean;
  activeTab?: DocumentTab;
  onTabChange?: (tab: DocumentTab) => void;
  hasMotivationLetter?: boolean;
}

const CVToolbar = ({
  onPrint,
  onDownloadPdf,
  isDownloading,
  activeTab = 'cv',
  onTabChange,
  hasMotivationLetter = false,
}: CVToolbarProps) => {
  const router = useRouter();
  const {
    theme,
    toggleTheme,
    setTheme,
    showPhoto,
    togglePhoto,
    setShowPhoto,
    privacyLevel,
    cyclePrivacyLevel,
    setPrivacyLevel,
    canShowPrivateInfo,
    showExperience,
    toggleExperience,
    setShowExperience,
    showAttachments,
    toggleAttachments,
    setShowAttachments,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
  } = useCVTheme();

  // Helper to get privacy icon and tooltip
  const getPrivacyIcon = () => {
    if (privacyLevel === 'none') return <LockIcon />;
    if (privacyLevel === 'personal') return <LockOpenIcon />;
    return <SecurityIcon />;
  };

  const getPrivacyTooltip = () => {
    if (privacyLevel === 'none') return 'Show Personal Contact Info';
    if (privacyLevel === 'personal') return 'Show All (incl. Reference Contacts)';
    return 'Hide Private Info';
  };

  const getPrivacyColor = () => {
    if (privacyLevel === 'none') return 'rgba(255,255,255,0.4)';
    if (privacyLevel === 'personal') return 'white';
    return '#89665d'; // accent color for full
  };
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
  const [printWarningOpen, setPrintWarningOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [llmInputDataOpen, setLlmInputDataOpen] = useState(false);

  const handlePrintClick = () => {
    if (showAttachments) {
      setPrintWarningOpen(true);
    } else {
      onPrint();
    }
  };

  const handleConfirmPrint = () => {
    setPrintWarningOpen(false);
    onPrint();
  };

  const handleBack = () => {
    router.push('/working-life');
  };

  const handleSpeedDialClose = () => {
    setSpeedDialOpen(false);
  };

  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
  };

  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  const handleConfirmExport = () => {
    setExportDialogOpen(false);
    if (onDownloadPdf) {
      onDownloadPdf();
    }
  };

  // Helper to get privacy level description
  const getPrivacyDescription = () => {
    if (privacyLevel === 'none') return 'Hidden (contact on request)';
    if (privacyLevel === 'personal') return 'Personal contact info visible';
    return 'All contact info visible (including references)';
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
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Document tabs - show when motivation letter is available */}
          {hasMotivationLetter && onTabChange ? (
            <ToggleButtonGroup
              value={activeTab}
              exclusive
              onChange={(_, newTab) => newTab && onTabChange(newTab)}
              size="small"
              sx={{
                mb: 0.5,
                '& .MuiToggleButton-root': {
                  color: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  py: 0.5,
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  '&.Mui-selected': {
                    color: 'white',
                    bgcolor: 'rgba(137, 102, 93, 0.4)',
                    borderColor: '#89665d',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(137, 102, 93, 0.2)',
                  },
                },
              }}
            >
              <ToggleButton value="cv" aria-label="CV">
                <DescriptionIcon sx={{ fontSize: '1rem', mr: { xs: 0, sm: 0.5 } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>CV</Box>
              </ToggleButton>
              <ToggleButton value="motivation-letter" aria-label="Motivation Letter">
                <EmailIcon sx={{ fontSize: '1rem', mr: { xs: 0, sm: 0.5 } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Letter</Box>
              </ToggleButton>
            </ToggleButtonGroup>
          ) : (
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
          )}
        </Box>
        <Box className="cv-toolbar-actions">
          {/* Admin controls - only show when admin is logged in */}
          {isAdmin && (
            <>
              <CVVersionSelector />
              {/* Show LLM input data button when a custom version is selected */}
              {activeVersion && activeVersion.job_context && (
                <Tooltip title="View LLM Input Data">
                  <IconButton onClick={() => setLlmInputDataOpen(true)} sx={{ color: 'rgba(255,255,255,0.7)', ml: 0.5 }}>
                    <InfoOutlinedIcon />
                  </IconButton>
                </Tooltip>
              )}
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

        </Box>

        {/* AI Customization Dialog */}
        <CVCustomizationDialog open={customizationOpen} onClose={() => setCustomizationOpen(false)} />

        {/* LLM Input Data Dialog */}
        <LLMInputDataDialog
          open={llmInputDataOpen}
          onClose={() => setLlmInputDataOpen(false)}
          version={activeVersion}
        />

        {/* Print warning when attachments are enabled */}
        <Snackbar
          open={printWarningOpen}
          onClose={() => setPrintWarningOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity="warning"
            onClose={() => setPrintWarningOpen(false)}
            sx={{ width: '100%', maxWidth: '500px' }}
          >
            <Box sx={{ mb: 1.5 }}>
              <strong>Attachments cannot be included when printing.</strong>
            </Box>
            <Box sx={{ mb: 1, fontSize: '0.875rem' }}>
              View documents separately or download the complete PDF with all attachments.
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
              <Button
                color="inherit"
                size="small"
                href={CERTIFICATES_PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
              >
                Certificates
              </Button>
              <Button
                color="inherit"
                size="small"
                href={REFERENCES_PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
              >
                References
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
              <Button
                color="inherit"
                size="small"
                onClick={() => setPrintWarningOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color="inherit"
                size="small"
                variant="outlined"
                onClick={handleConfirmPrint}
                startIcon={<PrintIcon />}
              >
                Print Anyway
              </Button>
              {onDownloadPdf && (
                <Button
                  color="inherit"
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setPrintWarningOpen(false);
                    onDownloadPdf();
                  }}
                  startIcon={<DownloadIcon />}
                >
                  Download All
                </Button>
              )}
            </Box>
          </Alert>
        </Snackbar>

        {/* Export Options Dialog */}
        <Dialog
          open={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            zIndex: 10000, // Above the FABs (9999) and SpeedDial
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
            <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
              Configure your PDF export settings:
            </Typography>
            <List>
              {/* Theme Toggle */}
              <ListItem sx={{ py: 1.5, pr: { xs: 10, sm: 2 } }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {theme === 'dark' ? (
                    <DarkModeIcon sx={{ color: 'white' }} />
                  ) : (
                    <LightModeIcon sx={{ color: 'white' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Theme"
                  secondary={theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                />
                <ListItemSecondaryAction>
                  <ToggleButtonGroup
                    value={theme}
                    exclusive
                    onChange={(_, newTheme) => newTheme && setTheme(newTheme)}
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        color: 'rgba(255,255,255,0.5)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        '&.Mui-selected': {
                          color: 'white',
                          bgcolor: 'rgba(137, 102, 93, 0.3)',
                        },
                      },
                    }}
                  >
                    <ToggleButton value="light" aria-label="light mode">
                      <LightModeIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="dark" aria-label="dark mode">
                      <DarkModeIcon fontSize="small" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* Photo Toggle */}
              <ListItem sx={{ py: 1.5, pr: { xs: 8, sm: 2 } }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {showPhoto ? (
                    <PersonIcon sx={{ color: 'white' }} />
                  ) : (
                    <PersonOffIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Photo"
                  secondary={showPhoto ? 'Included in CV' : 'Hidden from CV'}
                  secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={showPhoto}
                    onChange={(_, checked) => setShowPhoto(checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#89665d',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#89665d',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* Contact Details - only show if logged in */}
              {canShowPrivateInfo ? (
                <>
                  <ListItem sx={{ py: 1.5, pr: { xs: 13, sm: 2 } }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {privacyLevel === 'none' ? (
                        <LockIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                      ) : privacyLevel === 'personal' ? (
                        <LockOpenIcon sx={{ color: 'white' }} />
                      ) : (
                        <SecurityIcon sx={{ color: '#89665d' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Contact Details"
                      secondary={getPrivacyDescription()}
                      secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                    <ListItemSecondaryAction>
                      <ToggleButtonGroup
                        value={privacyLevel}
                        exclusive
                        onChange={(_, newLevel) => newLevel && setPrivacyLevel(newLevel)}
                        size="small"
                        sx={{
                          '& .MuiToggleButton-root': {
                            color: 'rgba(255,255,255,0.5)',
                            borderColor: 'rgba(255,255,255,0.2)',
                            px: 1,
                            '&.Mui-selected': {
                              color: 'white',
                              bgcolor: 'rgba(137, 102, 93, 0.3)',
                            },
                          },
                        }}
                      >
                        <ToggleButton value="none" aria-label="hidden">
                          <LockIcon fontSize="small" />
                        </ToggleButton>
                        <ToggleButton value="personal" aria-label="personal">
                          <LockOpenIcon fontSize="small" />
                        </ToggleButton>
                        <ToggleButton value="full" aria-label="full">
                          <SecurityIcon fontSize="small" />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                </>
              ) : (
                <>
                  <ListItem sx={{ py: 1.5, opacity: 0.5, pr: { xs: 2, sm: 2 } }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <LockIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Contact Details"
                      secondary="Login required to include contact info"
                      secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                    />
                  </ListItem>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                </>
              )}

              {/* Experience Toggle */}
              <ListItem sx={{ py: 1.5, pr: { xs: 8, sm: 2 } }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {showExperience ? (
                    <WorkHistoryIcon sx={{ color: 'white' }} />
                  ) : (
                    <WorkOffIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Detailed Experience"
                  secondary={showExperience ? 'Extended job descriptions included' : 'Summary only (shorter CV)'}
                  secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={showExperience}
                    onChange={(_, checked) => setShowExperience(checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#89665d',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#89665d',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* Attachments Toggle */}
              <ListItem sx={{ py: 1.5, pr: { xs: 8, sm: 2 } }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {showAttachments ? (
                    <AttachFileIcon sx={{ color: 'white' }} />
                  ) : (
                    <AttachFileOffIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Attachments"
                  secondary={showAttachments ? 'Certificates & References PDFs appended' : 'CV only (no attachments)'}
                  secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={showAttachments}
                    onChange={(_, checked) => setShowAttachments(checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#89665d',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#89665d',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              {/* Direct download links for attachments */}
              <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  href={CERTIFICATES_PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<DownloadIcon />}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    fontSize: '0.75rem',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.4)',
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  Certificates
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  href={REFERENCES_PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<DownloadIcon />}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    fontSize: '0.75rem',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.4)',
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  References
                </Button>
              </Box>
            </List>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setExportDialogOpen(false)}
              sx={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmExport}
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
      </Box>

      {/* Floating Sidebar for Display Toggles - Desktop Only */}
      <Box className="cv-floating-sidebar cv-no-print" sx={{ display: { xs: 'none', md: 'flex' } }}>
        {/* Privacy toggle - only show when logged in */}
        {canShowPrivateInfo && (
          <Tooltip title={getPrivacyTooltip()} placement="left">
            <IconButton onClick={cyclePrivacyLevel} sx={{ color: getPrivacyColor() }}>
              {getPrivacyIcon()}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={showPhoto ? 'Hide Photo' : 'Show Photo'} placement="left">
          <IconButton
            onClick={togglePhoto}
            sx={{ color: showPhoto ? 'white' : 'rgba(255,255,255,0.4)' }}
          >
            {showPhoto ? <PersonIcon /> : <PersonOffIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={showExperience ? 'Hide Detailed Experience' : 'Show Detailed Experience'} placement="left">
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

      {/* Floating Export Button - Desktop (bottom right) */}
      {onDownloadPdf && (
        <Box
          className="cv-no-print"
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
          }}
        >
          <Fab
            variant="extended"
            color="primary"
            onClick={handleExportClick}
            disabled={isDownloading}
            sx={{
              bgcolor: '#89665d',
              '&:hover': { bgcolor: '#6d524a' },
              '&.Mui-disabled': { bgcolor: 'rgba(137, 102, 93, 0.5)' },
              gap: 1,
            }}
          >
            {isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
            {isDownloading ? 'Generating...' : 'Export PDF'}
          </Fab>
        </Box>
      )}

      {/* Mobile: Export FAB + SpeedDial for other controls */}
      <Box
        className="cv-no-print"
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          gap: 1.5,
          alignItems: 'flex-end',
        }}
      >
        {/* Export FAB - Always visible on mobile */}
        {onDownloadPdf && (
          <Fab
            variant="extended"
            size="medium"
            onClick={handleExportClick}
            disabled={isDownloading}
            sx={{
              bgcolor: '#89665d',
              color: 'white',
              '&:hover': { bgcolor: '#6d524a' },
              '&.Mui-disabled': { bgcolor: 'rgba(137, 102, 93, 0.5)' },
              gap: 0.5,
              fontSize: '0.8rem',
            }}
          >
            {isDownloading ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon fontSize="small" />}
            {isDownloading ? 'Generating...' : 'Export PDF'}
          </Fab>
        )}
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
          onClick={handlePrintClick}
        />

        {/* Private Info Toggle - only show when logged in */}
        {canShowPrivateInfo && (
          <SpeedDialAction
            icon={getPrivacyIcon()}
            tooltipTitle={getPrivacyTooltip()}
            onClick={cyclePrivacyLevel}
          />
        )}

        {/* Photo Toggle */}
        <SpeedDialAction
          icon={showPhoto ? <PersonIcon /> : <PersonOffIcon />}
          tooltipTitle={showPhoto ? 'Hide Photo' : 'Show Photo'}
          onClick={togglePhoto}
        />

        {/* Experience Toggle */}
        <SpeedDialAction
          icon={showExperience ? <WorkHistoryIcon /> : <WorkOffIcon />}
          tooltipTitle={showExperience ? 'Hide Detailed Experience' : 'Show Detailed Experience'}
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
