'use client';

import { useState, useRef, useEffect } from 'react';
import { TextField, ClickAwayListener, Box } from '@mui/material';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  multiline?: boolean;
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  placeholder?: string;
  maxLength?: number;
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
}: EditableTextProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync local value with prop
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    setLocalValue(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleClickAway = () => {
    if (isFocused) {
      handleBlur();
    }
  };

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
        <TextField
          inputRef={inputRef}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          multiline={multiline}
          minRows={multiline ? 3 : 1}
          maxRows={multiline ? 10 : 1}
          fullWidth
          size="small"
          placeholder={placeholder}
          helperText={maxLength ? `${localValue.length}/${maxLength}` : undefined}
          FormHelperTextProps={{
            sx: { textAlign: 'right', mr: 0 },
          }}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default EditableText;
