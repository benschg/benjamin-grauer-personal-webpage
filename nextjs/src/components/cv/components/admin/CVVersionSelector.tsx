'use client';

import { useState, useRef, useEffect } from 'react';
import { Select, MenuItem, Box, Typography, Divider, TextField, InputAdornment, Tooltip } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SettingsIcon from '@mui/icons-material/Settings';
import { useCVVersion } from '../../contexts';

interface CVVersionSelectorProps {
  onManageVersions?: () => void;
}

const CVVersionSelector = ({ onManageVersions }: CVVersionSelectorProps) => {
  const { versions, activeVersion, selectVersion, loading } = useCVVersion();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter versions based on search query
  const filteredVersions = versions.filter((version) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = version.name.toLowerCase().includes(query);
    const companyMatch = version.job_context?.company?.toLowerCase().includes(query);
    const positionMatch = version.job_context?.position?.toLowerCase().includes(query);
    return nameMatch || companyMatch || positionMatch;
  });

  // Focus search input when menu opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the menu is rendered
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    selectVersion(value === 'default' ? null : value);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatFullDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get display text for the selected version
  const getSelectedLabel = () => {
    if (!activeVersion) return 'Default CV';
    const company = activeVersion.job_context?.company;
    const position = activeVersion.job_context?.position;
    if (company && position) {
      return `${company} - ${position}`;
    }
    return activeVersion.name;
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
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={handleClose}
      renderValue={() => getSelectedLabel()}
      MenuProps={{
        PaperProps: {
          sx: {
            minWidth: 400,
            maxWidth: 500,
          },
        },
      }}
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
      {/* Search bar - not a selectable item */}
      <Box
        sx={{ px: 2, py: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <TextField
          inputRef={searchInputRef}
          size="small"
          placeholder="Search versions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            // Prevent select from closing on Enter/Space
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
            }
          }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <Box
                  component="span"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  sx={{ cursor: 'pointer', display: 'flex' }}
                >
                  <ClearIcon fontSize="small" color="action" />
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />

      <MenuItem value="default">
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          Default CV
        </Typography>
      </MenuItem>

      {filteredVersions.length > 0 && <Divider />}

      {/* Header row */}
      {filteredVersions.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 80px',
            gap: 2,
            px: 2,
            py: 1,
            bgcolor: 'action.hover',
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            Company
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            Position
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            Date
          </Typography>
        </Box>
      )}

      {/* No results message */}
      {filteredVersions.length === 0 && searchQuery && (
        <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No versions match &quot;{searchQuery}&quot;
          </Typography>
        </Box>
      )}

      {/* Include active version if not in filtered list (e.g., loaded from URL before versions sync) */}
      {activeVersion && !filteredVersions.some(v => v.id === activeVersion.id) && (
        <MenuItem
          key={activeVersion.id}
          value={activeVersion.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 80px',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" noWrap>
            {activeVersion.job_context?.company || activeVersion.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {activeVersion.job_context?.position || '—'}
          </Typography>
          <Tooltip title={formatFullDateTime(activeVersion.created_at)} placement="top">
            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'default' }}>
              {formatDate(activeVersion.created_at)}
            </Typography>
          </Tooltip>
        </MenuItem>
      )}
      {filteredVersions.map((version) => (
        <MenuItem
          key={version.id}
          value={version.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 80px',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" noWrap>
            {version.job_context?.company || version.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {version.job_context?.position || '—'}
          </Typography>
          <Tooltip title={formatFullDateTime(version.created_at)} placement="top">
            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'default' }}>
              {formatDate(version.created_at)}
            </Typography>
          </Tooltip>
        </MenuItem>
      ))}

      {/* Manage Versions link */}
      {onManageVersions && [
        <Divider key="manage-divider" />,
        <MenuItem
          key="manage-versions"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            onManageVersions();
          }}
          sx={{
            justifyContent: 'center',
            gap: 1,
            py: 1.5,
            bgcolor: 'action.hover',
            '&:hover': {
              bgcolor: 'action.selected',
            },
          }}
        >
          <SettingsIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>
            Manage Versions
          </Typography>
        </MenuItem>,
      ]}
    </Select>
  );
};

export default CVVersionSelector;
