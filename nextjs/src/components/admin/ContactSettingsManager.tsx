'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

interface Settings {
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  public_email: string;
  public_address: string;
}

interface WhitelistedEmail {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

const ContactSettingsManager = () => {
  const [settings, setSettings] = useState<Settings>({
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    public_email: '',
    public_address: '',
  });
  const [whitelistedEmails, setWhitelistedEmails] = useState<WhitelistedEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newEmailName, setNewEmailName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<Settings | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const [settingsRes, emailsRes] = await Promise.all([
        fetch('/api/site-settings'),
        fetch('/api/whitelisted-emails'),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        const loadedSettings = {
          contact_email: data.settings.contact_email || '',
          contact_phone: data.settings.contact_phone || '',
          contact_address: data.settings.contact_address || '',
          public_email: data.settings.public_email || '',
          public_address: data.settings.public_address || '',
        };
        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);
      }

      if (emailsRes.ok) {
        const data = await emailsRes.json();
        setWhitelistedEmails(data.emails || []);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (originalSettings) {
      const changed = Object.keys(settings).some(
        (key) => settings[key as keyof Settings] !== originalSettings[key as keyof Settings]
      );
      setHasChanges(changed);
    }
  }, [settings, originalSettings]);

  const handleChange = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, [key]: e.target.value }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setOriginalSettings(settings);
      setHasChanges(false);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail.trim()) return;

    setIsAddingEmail(true);
    setError(null);

    try {
      const response = await fetch('/api/whitelisted-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail.trim(),
          name: newEmailName.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add email');
      }

      const data = await response.json();
      setWhitelistedEmails((prev) => [data.email, ...prev]);
      setNewEmail('');
      setNewEmailName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add email');
    } finally {
      setIsAddingEmail(false);
    }
  };

  const handleDeleteEmail = async (id: string) => {
    try {
      const response = await fetch(`/api/whitelisted-emails?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete email');
      }

      setWhitelistedEmails((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete email');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#89665d' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Contact Information
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Manage your public contact details and access controls
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={isSaving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          sx={{
            bgcolor: '#89665d',
            '&:hover': { bgcolor: '#6d524a' },
            '&:disabled': { bgcolor: 'rgba(137,102,93,0.3)' },
          }}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          Settings saved successfully!
        </Alert>
      )}

      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
            Private Contact Details
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
            <InfoIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', mt: 0.3 }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Only visible to whitelisted users when they unlock privacy settings on the CV.
            </Typography>
          </Box>
          <Stack spacing={2}>
            <TextField
              label="Email Address"
              value={settings.contact_email}
              onChange={handleChange('contact_email')}
              fullWidth
              size="small"
              placeholder="your@email.com"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#89665d' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
              }}
            />
            <TextField
              label="Phone Number"
              value={settings.contact_phone}
              onChange={handleChange('contact_phone')}
              fullWidth
              size="small"
              placeholder="+41 79 123 45 67"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#89665d' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
              }}
            />
            <TextField
              label="Address"
              value={settings.contact_address}
              onChange={handleChange('contact_address')}
              fullWidth
              size="small"
              placeholder="Street, City, Country"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#89665d' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
              }}
            />
          </Stack>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
            Public Contact Details
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
            <InfoIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', mt: 0.3 }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Shown on the CV when privacy is locked. Leave empty to show &quot;Contact on request&quot;.
            </Typography>
          </Box>
          <Stack spacing={2}>
            <TextField
              label="Public Email (optional)"
              value={settings.public_email}
              onChange={handleChange('public_email')}
              fullWidth
              size="small"
              placeholder="public@email.com"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#89665d' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
              }}
            />
            <TextField
              label="Public Address (optional)"
              value={settings.public_address}
              onChange={handleChange('public_address')}
              fullWidth
              size="small"
              placeholder="City, Country"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#89665d' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
              }}
            />
          </Stack>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
            Privacy Whitelist
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
            <InfoIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', mt: 0.3 }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Users with these email addresses can view private contact information on your CV when logged in.
            </Typography>
          </Box>

          {/* Add new email form */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              size="small"
              placeholder="email@example.com"
              sx={{
                flex: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#89665d' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
              }}
            />
            <TextField
              label="Name (optional)"
              value={newEmailName}
              onChange={(e) => setNewEmailName(e.target.value)}
              size="small"
              placeholder="John Doe"
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#89665d' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
              }}
            />
            <Button
              variant="contained"
              startIcon={isAddingEmail ? <CircularProgress size={16} /> : <AddIcon />}
              onClick={handleAddEmail}
              disabled={isAddingEmail || !newEmail.trim()}
              sx={{
                bgcolor: '#89665d',
                '&:hover': { bgcolor: '#6d524a' },
                '&:disabled': { bgcolor: 'rgba(137,102,93,0.3)' },
              }}
            >
              Add
            </Button>
          </Box>

          {/* Email list */}
          {whitelistedEmails.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 2, color: 'rgba(255,255,255,0.5)' }}>
              <Typography variant="body2">No whitelisted emails yet.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {whitelistedEmails.map((entry) => (
                    <TableRow key={entry.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                      <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <Chip
                          label={entry.email}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(137,102,93,0.2)',
                            color: '#89665d',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
                        {entry.name || '-'}
                      </TableCell>
                      <TableCell sx={{ borderColor: 'rgba(255,255,255,0.1)' }} align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteEmail(entry.id)}
                          sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#f44336' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Stack>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          <strong>Note:</strong> Contact settings are stored in the database and override environment variables.
          Changes take effect immediately after saving.
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactSettingsManager;
