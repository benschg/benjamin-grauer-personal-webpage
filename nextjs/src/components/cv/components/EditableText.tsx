'use client';

import { useState, useRef } from 'react';
import { TextField, ClickAwayListener, Box, IconButton, CircularProgress, Popover, Button } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RestoreIcon from '@mui/icons-material/Restore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Tooltip } from '@mui/material';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  multiline?: boolean;
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  placeholder?: string;
  maxLength?: number;
  onRegenerate?: (customInstructions?: string) => void;
  isRegenerating?: boolean;
  showCharacterCount?: boolean;
  onReset?: () => void;
  isModified?: boolean;
}

const EditableText = ({
  value,
  onChange,
  isEditing,
  multiline = false,
  variant = 'p',
  className,
  placeholder = 'Click to edit...',
  maxLength,
  onRegenerate,
  isRegenerating = false,
  showCharacterCount = false,
  onReset,
  isModified = false,
}: EditableTextProps) => {
  // Use fully controlled component - value comes from props, onChange updates parent
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [customInstructions, setCustomInstructions] = useState('');

  // Hard limit is 2.5x the soft limit (maxLength)
  const hardLimit = maxLength ? Math.floor(maxLength * 2.5) : undefined;
  const isOverSoftLimit = maxLength && value.length > maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // Only block at the hard limit (2.5x soft limit)
    // Allow any edits below that, even if over the soft limit
    if (hardLimit && newValue.length > hardLimit && newValue.length > value.length) return;
    onChange(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleClickAway = () => {
    if (isFocused) {
      handleBlur();
    }
  };

  const handleRegenerateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRegenerateClose = () => {
    setAnchorEl(null);
    setCustomInstructions('');
  };

  const handleRegenerateSubmit = () => {
    if (onRegenerate) {
      onRegenerate(customInstructions || undefined);
    }
    handleRegenerateClose();
  };

  const popoverOpen = Boolean(anchorEl);

  if (!isEditing) {
    // Render as normal text based on variant
    switch (variant) {
      case 'h1':
        return <h1 className={className}>{value || placeholder}</h1>;
      case 'h2':
        return <h2 className={className}>{value || placeholder}</h2>;
      case 'h3':
        return <h3 className={className}>{value || placeholder}</h3>;
      case 'span':
        return <span className={className}>{value || placeholder}</span>;
      case 'p':
      default:
        return <p className={className}>{value || placeholder}</p>;
    }
  }

  // Render as editable field
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        sx={{
          position: 'relative',
          '& .MuiInputBase-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 1,
          },
          '& .MuiInputBase-input': {
            padding: multiline ? '8px 12px' : '4px 8px',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
            color: '#333',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isFocused ? 'primary.main' : 'rgba(0, 0, 0, 0.23)',
            borderWidth: isFocused ? 2 : 1,
          },
        }}
      >
        {(onRegenerate || (onReset && isModified)) && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: -32,
                right: 0,
                zIndex: 1,
                display: 'flex',
                gap: 0.5,
              }}
            >
              {onRegenerate && (
                <Tooltip title="Regenerate with AI" arrow>
                  <IconButton
                    size="small"
                    onClick={handleRegenerateClick}
                    disabled={isRegenerating}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '&:disabled': {
                        bgcolor: 'grey.400',
                      },
                    }}
                  >
                    {isRegenerating ? (
                      <CircularProgress size={16} sx={{ color: 'white' }} />
                    ) : (
                      <AutorenewIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              )}
              {onReset && isModified && (
                <Tooltip title="Reset to default" arrow>
                  <IconButton
                    size="small"
                    onClick={onReset}
                    sx={{
                      bgcolor: 'rgba(255, 180, 100, 0.9)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 150, 50, 1)',
                      },
                    }}
                  >
                    <RestoreIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Popover
              open={popoverOpen}
              anchorEl={anchorEl}
              onClose={handleRegenerateClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ p: 2, width: 400 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Custom Instructions (optional)"
                  placeholder="e.g., Make it more technical, focus on leadership, use shorter sentences..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
                  <Button onClick={handleRegenerateClose} size="small">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRegenerateSubmit}
                    variant="contained"
                    size="small"
                    startIcon={<AutorenewIcon />}
                  >
                    Regenerate
                  </Button>
                </Box>
              </Box>
            </Popover>
          </>
        )}
        <TextField
          inputRef={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          multiline={multiline}
          minRows={multiline ? 3 : 1}
          maxRows={multiline ? 10 : 1}
          fullWidth
          size="small"
          placeholder={placeholder}
          helperText={
            showCharacterCount
              ? `${value.length} characters`
              : maxLength
                ? (
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      {isOverSoftLimit && (
                        <Tooltip title={`Recommended max: ${maxLength} characters. Hard limit: ${hardLimit}`} arrow>
                          <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                        </Tooltip>
                      )}
                      <span style={{ color: isOverSoftLimit ? '#ed6c02' : undefined }}>
                        {value.length}/{maxLength}
                      </span>
                    </Box>
                  )
                : undefined
          }
          FormHelperTextProps={{
            sx: { textAlign: 'right', mr: 0 },
            component: 'div',
          }}
          sx={isOverSoftLimit ? {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'warning.main !important',
            },
          } : undefined}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default EditableText;
