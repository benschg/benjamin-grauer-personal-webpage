'use client';

import { Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useCVVersion } from '../../contexts';

const CVVersionSelector = () => {
  const { versions, activeVersion, selectVersion, loading } = useCVVersion();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    selectVersion(value === 'default' ? null : value);
  };

  if (loading) {
    return null;
  }

  return (
    <Select
      value={activeVersion?.id || 'default'}
      onChange={handleChange}
      variant="standard"
      disableUnderline
      sx={{
        color: '#89665d',
        fontWeight: 500,
        fontSize: '0.9rem',
        minWidth: 0,
        maxWidth: '100%',
        '.MuiSelect-select': {
          py: 0,
          pr: 3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        '.MuiSvgIcon-root': { color: '#89665d' },
      }}
    >
      <MenuItem value="default">Default CV</MenuItem>
      {versions.map((version) => (
        <MenuItem key={version.id} value={version.id}>
          {version.name}
          {version.is_default && ' ★'}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CVVersionSelector;
