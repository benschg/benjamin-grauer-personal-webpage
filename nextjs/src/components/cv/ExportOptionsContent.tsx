'use client';

import {
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SecurityIcon from '@mui/icons-material/Security';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AttachFileOffIcon from '@mui/icons-material/LinkOff';
import { useCVTheme } from './contexts';
import { CERTIFICATES_PDF_PATH, REFERENCES_PDF_PATH } from '@/components/working-life/content';

interface ExportOptionsContentProps {
  showDescription?: boolean;
}

const ExportOptionsContent = ({ showDescription = true }: ExportOptionsContentProps) => {
  const {
    theme,
    setTheme,
    showPhoto,
    setShowPhoto,
    privacyLevel,
    setPrivacyLevel,
    canShowPrivateInfo,
    canShowReferenceInfo,
    showExperience,
    setShowExperience,
    showAttachments,
    setShowAttachments,
  } = useCVTheme();

  // Helper to get privacy level description
  const getPrivacyDescription = () => {
    if (privacyLevel === 'none') return 'Hidden (contact on request)';
    if (privacyLevel === 'personal') return 'Personal contact info visible';
    return 'All contact info visible (including references)';
  };

  return (
    <>
      {showDescription && (
        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
          Configure your PDF export settings:
        </Typography>
      )}
      <List disablePadding>
        {/* Theme Toggle */}
        <ListItem sx={{ py: 1.5, px: 0 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            {theme === 'dark' ? (
              <DarkModeIcon sx={{ color: 'white' }} />
            ) : (
              <LightModeIcon sx={{ color: 'white' }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Theme"
            secondary={theme === 'dark' ? 'Dark mode' : 'Light mode (print)'}
            secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
          />
          <ListItemSecondaryAction sx={{ right: 0 }}>
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
        <ListItem sx={{ py: 1.5, px: 0 }}>
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
          <ListItemSecondaryAction sx={{ right: 0 }}>
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
            <Box sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <Box sx={{ minWidth: 40, display: 'flex', justifyContent: 'center', pt: 0.5 }}>
                  {privacyLevel === 'none' ? (
                    <LockIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                  ) : privacyLevel === 'personal' ? (
                    <LockOpenIcon sx={{ color: 'white' }} />
                  ) : (
                    <SecurityIcon sx={{ color: '#89665d' }} />
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1">Contact Details</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {getPrivacyDescription()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                  <Tooltip
                    title={canShowReferenceInfo ? 'Show reference contacts' : 'You are not allowed to view reference contacts'}
                    placement="top"
                  >
                    <span>
                      <ToggleButton
                        value="full"
                        aria-label="full"
                        disabled={!canShowReferenceInfo}
                        sx={{
                          '&.Mui-disabled': {
                            color: 'rgba(255,255,255,0.2)',
                            borderColor: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        <SecurityIcon fontSize="small" />
                      </ToggleButton>
                    </span>
                  </Tooltip>
                </ToggleButtonGroup>
              </Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          </>
        ) : (
          <>
            <ListItem sx={{ py: 1.5, opacity: 0.5, px: 0 }}>
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
        <ListItem sx={{ py: 1.5, px: 0 }}>
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
          <ListItemSecondaryAction sx={{ right: 0 }}>
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
        <ListItem sx={{ py: 1.5, px: 0 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            {showAttachments ? (
              <AttachFileIcon sx={{ color: 'white' }} />
            ) : (
              <AttachFileOffIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Attachments"
            secondary={showAttachments ? 'References & Certificates\nPDFs appended' : 'CV only (no attachments)'}
            secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-line' } }}
          />
          <ListItemSecondaryAction sx={{ right: 0 }}>
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

        {/* Attached Documents section */}
        <Box sx={{ py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              Attached Documents
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1.5 }}>
              These documents will be appended to the PDF when downloading.
            </Typography>
          </Box>
          {/* References */}
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>
              References
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                href={REFERENCES_PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
                sx={{
                  flex: 1,
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  fontSize: '0.75rem',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.4)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                View
              </Button>
              <Button
                size="small"
                variant="outlined"
                href={REFERENCES_PDF_PATH}
                download="Benjamin_Grauer_References.pdf"
                startIcon={<DownloadIcon />}
                sx={{
                  flex: 1,
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  fontSize: '0.75rem',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.4)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                Download
              </Button>
            </Box>
          </Box>
          {/* Certificates */}
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>
              Certificates
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                href={CERTIFICATES_PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
                sx={{
                  flex: 1,
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  fontSize: '0.75rem',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.4)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                View
              </Button>
              <Button
                size="small"
                variant="outlined"
                href={CERTIFICATES_PDF_PATH}
                download="Benjamin_Grauer_Certificates.pdf"
                startIcon={<DownloadIcon />}
                sx={{
                  flex: 1,
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  fontSize: '0.75rem',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.4)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                Download
              </Button>
            </Box>
          </Box>
        </Box>
      </List>
    </>
  );
};

export default ExportOptionsContent;
