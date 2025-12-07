'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { modernScrollbarSx } from './CVCustomizationDialog';

interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string | null;
  phone: string | null;
  sort_order: number;
  is_active: boolean;
}

interface ReferenceFormData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

const emptyFormData: ReferenceFormData = {
  name: '',
  title: '',
  company: '',
  email: '',
  phone: '',
};

const ReferencesManager = () => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<ReferenceFormData>(emptyFormData);
  const [isSaving, setIsSaving] = useState(false);

  const fetchReferences = useCallback(async () => {
    try {
      const res = await fetch('/api/cv-references?all=true');
      const data = await res.json();
      setReferences(data.references || []);
      setError(null);
    } catch (err) {
      setError('Failed to load references');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  const handleEdit = (ref: Reference) => {
    setEditingId(ref.id);
    setFormData({
      name: ref.name,
      title: ref.title,
      company: ref.company,
      email: ref.email || '',
      phone: ref.phone || '',
    });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData(emptyFormData);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(emptyFormData);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.title || !formData.company) {
      setError('Name, title, and company are required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const method = isAdding ? 'POST' : 'PUT';
      const body = isAdding
        ? { ...formData, sort_order: references.length }
        : { id: editingId, ...formData };

      const res = await fetch('/api/cv-references', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save reference');
      }

      await fetchReferences();
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reference?')) return;

    setError(null);
    try {
      const res = await fetch('/api/cv-references', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete reference');
      }

      await fetchReferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleToggleActive = async (ref: Reference) => {
    try {
      const res = await fetch('/api/cv-references', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ref.id, is_active: !ref.is_active }),
      });

      if (!res.ok) {
        throw new Error('Failed to update');
      }

      await fetchReferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderForm = () => (
    <Card sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          {isAdding ? 'Add New Reference' : 'Edit Reference'}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            size="small"
            fullWidth
            required
          />
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            size="small"
            fullWidth
            required
            placeholder="e.g., CEO, CTO, Engineering Manager"
          />
          <TextField
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            size="small"
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            size="small"
            fullWidth
          />
          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            size="small"
            fullWidth
            placeholder="e.g., +41 79 123 45 67"
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={isSaving ? <CircularProgress size={16} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Professional References</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={isAdding || editingId !== null}
          size="small"
        >
          Add Reference
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ flex: 1, overflow: 'auto', ...modernScrollbarSx }}>
        {(isAdding || editingId) && renderForm()}

        {references.length === 0 && !isAdding ? (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <Typography>No references yet. Add your first reference above.</Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            {references.map((ref) => (
              <Card
                key={ref.id}
                sx={{
                  bgcolor: ref.is_active ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                  opacity: ref.is_active ? 1 : 0.6,
                  border: editingId === ref.id ? '1px solid' : '1px solid transparent',
                  borderColor: editingId === ref.id ? 'primary.main' : 'transparent',
                }}
              >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <DragIndicatorIcon sx={{ color: 'text.disabled', mt: 0.5, cursor: 'grab' }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {ref.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ref.title}, {ref.company}
                      </Typography>
                      {(ref.email || ref.phone) && (
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                          {[ref.email, ref.phone].filter(Boolean).join(' • ')}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={ref.is_active ? 'Active (click to hide)' : 'Hidden (click to show)'}>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleToggleActive(ref)}
                          sx={{
                            minWidth: 'auto',
                            px: 1,
                            color: ref.is_active ? 'success.main' : 'text.disabled',
                            fontSize: '0.75rem',
                          }}
                        >
                          {ref.is_active ? 'Active' : 'Hidden'}
                        </Button>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(ref)}
                        disabled={isAdding || (editingId !== null && editingId !== ref.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(ref.id)}
                        disabled={isAdding || editingId !== null}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        References marked as &quot;Active&quot; will appear on your CV. Contact details are only shown when privacy is set to &quot;Full&quot;.
      </Typography>
    </Box>
  );
};

export default ReferencesManager;
