'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  IconButton,
  Snackbar,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import type { MotivationLetter } from '@/types/database.types';

interface MotivationLetterPreviewProps {
  letter: MotivationLetter;
  candidateName: string;
  onUpdate: (letter: MotivationLetter) => void;
}

const MotivationLetterPreview = ({
  letter,
  candidateName,
  onUpdate,
}: MotivationLetterPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState<MotivationLetter>(letter);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const handleFieldChange = (field: keyof MotivationLetter, value: string) => {
    const updated = { ...editedLetter, [field]: value };
    setEditedLetter(updated);
    onUpdate(updated);
  };

  const getFullLetterText = () => {
    return `${editedLetter.greeting}

${editedLetter.opening}

${editedLetter.body}

${editedLetter.closing}

${editedLetter.signoff}
${candidateName}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: `${label} copied to clipboard!` });
    } catch {
      setSnackbar({ open: true, message: 'Failed to copy to clipboard' });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/generate-motivation-letter-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letter: editedLetter,
          candidateName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `motivation-letter-${editedLetter.subject.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSnackbar({ open: true, message: 'PDF downloaded!' });
    } catch (error) {
      console.error('Failed to download PDF:', error);
      setSnackbar({ open: true, message: 'Failed to generate PDF' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Motivation Letter</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Done Editing' : 'Edit'}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
        </Box>
      </Box>

      {/* Subject Line - for email */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">
              Email Subject
            </Typography>
          </Box>
          <Tooltip title="Copy subject">
            <IconButton
              size="small"
              onClick={() => copyToClipboard(editedLetter.subject, 'Subject')}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        {isEditing ? (
          <TextField
            fullWidth
            size="small"
            value={editedLetter.subject}
            onChange={(e) => handleFieldChange('subject', e.target.value)}
          />
        ) : (
          <Typography variant="body1" fontWeight="medium">
            {editedLetter.subject}
          </Typography>
        )}
      </Paper>

      {/* Letter Body */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title="Copy full letter">
            <Button
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={() => copyToClipboard(getFullLetterText(), 'Letter')}
            >
              Copy All
            </Button>
          </Tooltip>
        </Box>

        {/* Greeting */}
        <Box sx={{ mb: 2 }}>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              label="Greeting"
              value={editedLetter.greeting}
              onChange={(e) => handleFieldChange('greeting', e.target.value)}
            />
          ) : (
            <Typography variant="body1">{editedLetter.greeting}</Typography>
          )}
        </Box>

        {/* Opening */}
        <Box sx={{ mb: 2 }}>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              label="Opening Paragraph"
              value={editedLetter.opening}
              onChange={(e) => handleFieldChange('opening', e.target.value)}
            />
          ) : (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {editedLetter.opening}
            </Typography>
          )}
        </Box>

        {/* Body */}
        <Box sx={{ mb: 2 }}>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              minRows={6}
              size="small"
              label="Main Body"
              value={editedLetter.body}
              onChange={(e) => handleFieldChange('body', e.target.value)}
              helperText="Use double line breaks for paragraph separation"
            />
          ) : (
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap', mb: 2 }}
            >
              {editedLetter.body}
            </Typography>
          )}
        </Box>

        {/* Closing */}
        <Box sx={{ mb: 2 }}>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              label="Closing Paragraph"
              value={editedLetter.closing}
              onChange={(e) => handleFieldChange('closing', e.target.value)}
            />
          ) : (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {editedLetter.closing}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sign-off */}
        <Box>
          {isEditing ? (
            <TextField
              size="small"
              label="Sign-off"
              value={editedLetter.signoff}
              onChange={(e) => handleFieldChange('signoff', e.target.value)}
            />
          ) : (
            <>
              <Typography variant="body1">{editedLetter.signoff}</Typography>
              <Typography variant="body1" fontWeight="medium" sx={{ mt: 1 }}>
                {candidateName}
              </Typography>
            </>
          )}
        </Box>
      </Paper>

      {/* Quick Copy Section */}
      <Alert severity="info" icon={false}>
        <Typography variant="subtitle2" gutterBottom>
          Quick Copy Options
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={() => copyToClipboard(editedLetter.subject, 'Subject')}
          >
            Subject Only
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={() => copyToClipboard(getFullLetterText(), 'Letter body')}
          >
            Letter Body
          </Button>
        </Box>
      </Alert>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default MotivationLetterPreview;
