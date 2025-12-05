'use client';

import { FormControl, Select, MenuItem, InputLabel, Box } from '@mui/material';
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
    <Box sx={{ minWidth: 120, maxWidth: 200 }}>
      <FormControl size="small" fullWidth>
        <InputLabel id="cv-version-label" sx={{ color: 'white' }}>
          Version
        </InputLabel>
        <Select
          labelId="cv-version-label"
          value={activeVersion?.id || 'default'}
          label="Version"
          onChange={handleChange}
          sx={{
            color: 'white',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
            '.MuiSvgIcon-root': { color: 'white' },
          }}
        >
          <MenuItem value="default">Default</MenuItem>
          {versions.map((version) => (
            <MenuItem key={version.id} value={version.id}>
              {version.name}
              {version.is_default && ' ★'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CVVersionSelector;
