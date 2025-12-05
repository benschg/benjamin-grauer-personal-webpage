'use client';

import { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  FormControlLabel,
  Checkbox,
  Paper,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LinkIcon from '@mui/icons-material/Link';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LanguageIcon from '@mui/icons-material/Language';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import PreviewIcon from '@mui/icons-material/Preview';
import DataObjectIcon from '@mui/icons-material/DataObject';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import {
  GEMINI_MODELS,
  DEFAULT_GEMINI_MODEL,
  estimateCost,
} from '@/config/gemini.config';
import type { GeminiModelId } from '@/config/gemini.config';
import { useCVVersion } from '../../contexts';
import type { CVVersion } from '@/types/database.types';
import {
  type CVDataSourceSelection,
  DEFAULT_DATA_SELECTION,
  getDataSourceLabels,
  aggregateCVData,
  formatDataForPrompt,
} from '@/services/ai/cvDataAggregator';

// Get preview text for a single data source
const getDataSourcePreview = (key: keyof CVDataSourceSelection): string => {
  // Create a selection with only this key enabled
  const singleSelection: CVDataSourceSelection = {
    successes: false,
    whatLookingFor: false,
    workExperience: false,
    technicalSkills: false,
    frameworksAndTech: false,
    toolsAndPlatforms: false,
    softSkills: false,
    cliftonStrengths: false,
    domainExpertise: false,
    recommendations: false,
    [key]: true,
  };

  const data = aggregateCVData(singleSelection);
  const preview = formatDataForPrompt(data);

  // Truncate if too long
  const maxLength = 500;
  if (preview.length > maxLength) {
    return preview.substring(0, maxLength) + '\n... (truncated)';
  }

  return preview || '(No data available)';
};

export interface JobInputData {
  company?: string;
  jobTitle: string;
  jobPosting: string;
  jobPostingUrl?: string;
  companyWebsite?: string;
  dataSourceSelection?: CVDataSourceSelection;
  uploadedFile?: {
    name: string;
    content: string;
    type: string;
  };
}

interface JobPostingInputProps {
  onGenerate: (
    inputData: JobInputData,
    customInstructions?: string,
    modelId?: GeminiModelId
  ) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
}

type JobInputMode = 'text' | 'url';

const JobPostingInput = ({ onGenerate, isGenerating, error }: JobPostingInputProps) => {
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobInputMode, setJobInputMode] = useState<JobInputMode>('url');
  const [jobPosting, setJobPosting] = useState('');
  const [jobPostingUrl, setJobPostingUrl] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [uploadedFile, setUploadedFile] = useState<JobInputData['uploadedFile']>();
  const [customInstructions, setCustomInstructions] = useState('');
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>(DEFAULT_GEMINI_MODEL);
  const [showPreviousVersions, setShowPreviousVersions] = useState(false);
  const [dataSourceSelection, setDataSourceSelection] = useState<CVDataSourceSelection>(DEFAULT_DATA_SELECTION);
  const [showInputPreview, setShowInputPreview] = useState(false);
  const [isFetchingJobInfo, setIsFetchingJobInfo] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { versions } = useCVVersion();
  const dataSourceLabels = getDataSourceLabels();

  // Filter versions that have job context
  const versionsWithContext = versions.filter(
    (v) => v.job_context && (v.job_context.jobPosting || v.job_context.jobPostingUrl)
  );

  const handleLoadPrevious = (version: CVVersion) => {
    if (!version.job_context) return;

    const ctx = version.job_context;

    // Set company and job title
    setCompany(ctx.company || '');
    setJobTitle(ctx.position || '');

    // Set job posting mode and content
    if (ctx.jobPostingUrl) {
      setJobInputMode('url');
      setJobPostingUrl(ctx.jobPostingUrl);
      setJobPosting('');
    } else if (ctx.jobPosting) {
      setJobInputMode('text');
      setJobPosting(ctx.jobPosting);
      setJobPostingUrl('');
    }

    // Set optional fields
    setCompanyWebsite(ctx.companyWebsite || '');
    setCustomInstructions(ctx.customInstructions || '');

    // Set data source selection if saved
    if (ctx.dataSourceSelection) {
      setDataSourceSelection(ctx.dataSourceSelection);
    }

    // Clear uploaded file (can't restore it)
    setUploadedFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setShowPreviousVersions(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setUploadedFile({
        name: file.name,
        content: content.split(',')[1] || content, // Remove data URL prefix if present
        type: file.type,
      });
    };

    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const clearFile = () => {
    setUploadedFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDataSourceChange = (key: keyof CVDataSourceSelection) => {
    setDataSourceSelection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getInputPreviewText = (): string => {
    // Use the aggregated profile data (which now includes whatLookingFor from careerAspirationsData)
    const aggregatedData = aggregateCVData(dataSourceSelection);
    const profileData = formatDataForPrompt(aggregatedData);

    return profileData || '(No data selected)';
  };

  const handleFetchJobInfo = async () => {
    if (!jobPostingUrl.trim()) return;

    setIsFetchingJobInfo(true);
    setFetchError(null);

    try {
      const response = await fetch('/api/fetch-job-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobPostingUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch job information');
      }

      const data = await response.json();

      // Auto-fill the fields
      if (data.company && !company) setCompany(data.company);
      if (data.jobTitle && !jobTitle) setJobTitle(data.jobTitle);
      if (data.companyWebsite && !companyWebsite) setCompanyWebsite(data.companyWebsite);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch job information';
      setFetchError(message);
    } finally {
      setIsFetchingJobInfo(false);
    }
  };

  const handleSubmit = async () => {
    if (!jobTitle.trim()) return;

    const inputData: JobInputData = {
      company: company.trim() || undefined,
      jobTitle: jobTitle.trim(),
      jobPosting: jobInputMode === 'text' ? jobPosting : '',
      jobPostingUrl: jobInputMode === 'url' ? jobPostingUrl : undefined,
      companyWebsite: companyWebsite || undefined,
      dataSourceSelection,
      uploadedFile,
    };

    await onGenerate(inputData, customInstructions || undefined, selectedModel);
  };

  const selectedModelInfo = GEMINI_MODELS.find((m) => m.id === selectedModel);
  const hasValidInput = jobTitle.trim();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Load Previous Section */}
      {versionsWithContext.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<HistoryIcon />}
            endIcon={showPreviousVersions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowPreviousVersions(!showPreviousVersions)}
            disabled={isGenerating}
          >
            Load from Previous ({versionsWithContext.length})
          </Button>
          <Collapse in={showPreviousVersions}>
            <List
              dense
              sx={{
                mt: 1,
                bgcolor: 'action.hover',
                borderRadius: 1,
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              {versionsWithContext.map((version) => (
                <ListItemButton
                  key={version.id}
                  onClick={() => handleLoadPrevious(version)}
                  disabled={isGenerating}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <BusinessIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={version.name}
                    secondary={
                      version.job_context?.company
                        ? `${version.job_context.company}${version.job_context.position ? ` - ${version.job_context.position}` : ''}`
                        : version.job_context?.jobPostingUrl || 'Job posting text'
                    }
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </Box>
      )}

      <Divider sx={{ display: versionsWithContext.length > 0 ? 'block' : 'none' }} />

      <Typography variant="h6">Job Posting (Optional)</Typography>
      <Typography variant="body2" color="text.secondary">
        Provide the job posting via URL or paste the text for more accurate customization.
      </Typography>

      <ToggleButtonGroup
        value={jobInputMode}
        exclusive
        onChange={(_, value) => value && setJobInputMode(value)}
        size="small"
        disabled={isGenerating}
      >
        <ToggleButton value="text">
          <TextFieldsIcon sx={{ mr: 1 }} />
          Paste Text
        </ToggleButton>
        <ToggleButton value="url">
          <LinkIcon sx={{ mr: 1 }} />
          URL
        </ToggleButton>
      </ToggleButtonGroup>

      {jobInputMode === 'text' ? (
        <TextField
          multiline
          rows={8}
          value={jobPosting}
          onChange={(e) => setJobPosting(e.target.value)}
          placeholder="Paste the job posting here..."
          variant="outlined"
          fullWidth
          disabled={isGenerating}
        />
      ) : (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'stretch' }}>
          <TextField
            value={jobPostingUrl}
            onChange={(e) => setJobPostingUrl(e.target.value)}
            placeholder="https://example.com/jobs/..."
            variant="outlined"
            fullWidth
            disabled={isGenerating || isFetchingJobInfo}
            InputProps={{
              startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <Tooltip title="Extract company and job title from URL">
            <span style={{ display: 'flex' }}>
              <Button
                variant="outlined"
                onClick={handleFetchJobInfo}
                disabled={!jobPostingUrl.trim() || isGenerating || isFetchingJobInfo}
                sx={{ minWidth: 56, height: '100%' }}
              >
                {isFetchingJobInfo ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
              </Button>
            </span>
          </Tooltip>
        </Box>
      )}

      {fetchError && (
        <Alert severity="warning" onClose={() => setFetchError(null)}>
          {fetchError}
        </Alert>
      )}

      <Divider />

      {/* Company and Job Title */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          label="Company"
          placeholder="e.g., Google, Microsoft"
          variant="outlined"
          sx={{ flex: 1 }}
          disabled={isGenerating}
          InputProps={{
            startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <TextField
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          label="Job Title"
          placeholder="e.g., Senior Software Engineer"
          variant="outlined"
          required
          sx={{ flex: 1 }}
          disabled={isGenerating}
          error={!jobTitle.trim() && jobTitle !== ''}
          helperText={!jobTitle.trim() && jobTitle !== '' ? 'Job title is required' : ''}
          InputProps={{
            startAdornment: <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      {/* Data Sources Selection */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DataObjectIcon />
            <Typography>Profile Data to Include</Typography>
            <Chip
              size="small"
              label={`${Object.values(dataSourceSelection).filter(Boolean).length} selected`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select which data from your profile to include in the AI generation:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {(Object.keys(dataSourceSelection) as Array<keyof CVDataSourceSelection>).map((key) => (
              <Tooltip
                key={key}
                title={
                  <Box sx={{ maxWidth: 400, maxHeight: 300, overflow: 'auto' }}>
                    <Typography
                      variant="caption"
                      component="pre"
                      sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', m: 0 }}
                    >
                      {getDataSourcePreview(key)}
                    </Typography>
                  </Box>
                }
                placement="right"
                arrow
                enterDelay={300}
                leaveDelay={100}
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      border: 1,
                      borderColor: 'divider',
                      boxShadow: 3,
                      '& .MuiTooltip-arrow': {
                        color: 'background.paper',
                        '&::before': {
                          border: 1,
                          borderColor: 'divider',
                        },
                      },
                    },
                  },
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dataSourceSelection[key]}
                      onChange={() => handleDataSourceChange(key)}
                      disabled={isGenerating}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">{dataSourceLabels[key].label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dataSourceLabels[key].description}
                      </Typography>
                    </Box>
                  }
                />
              </Tooltip>
            ))}
          </Box>

          {/* Preview Button */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<PreviewIcon />}
            onClick={() => setShowInputPreview(!showInputPreview)}
            sx={{ mt: 2 }}
            disabled={isGenerating}
          >
            {showInputPreview ? 'Hide' : 'Show'} Data Preview
          </Button>

          <Collapse in={showInputPreview}>
            <Paper
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'background.default',
                maxHeight: 300,
                overflow: 'auto',
              }}
            >
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {getInputPreviewText() || '(No data selected)'}
              </Typography>
            </Paper>
          </Collapse>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Additional Context (Optional)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              placeholder="https://company.com"
              label="Company Website"
              variant="outlined"
              fullWidth
              disabled={isGenerating}
              InputProps={{
                startAdornment: <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              helperText="The AI will use this to gather more context about the company"
            />

            <Box>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,image/*"
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadFileIcon />}
                  disabled={isGenerating}
                >
                  Upload File
                </Button>
              </label>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                PDF, Word, or image files
              </Typography>

              {uploadedFile && (
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body2">{uploadedFile.name}</Typography>
                  <IconButton size="small" onClick={clearFile}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <FormControl fullWidth>
        <InputLabel id="model-select-label">AI Model</InputLabel>
        <Select
          labelId="model-select-label"
          value={selectedModel}
          label="AI Model"
          onChange={(e) => setSelectedModel(e.target.value as GeminiModelId)}
          disabled={isGenerating}
        >
          {GEMINI_MODELS.map((model) => (
            <MenuItem key={model.id} value={model.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1">{model.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {model.description}
                  </Typography>
                </Box>
                {model.thinking && (
                  <Chip
                    icon={<PsychologyIcon />}
                    label="Thinking"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {!model.freeTier && (
                  <Chip label="Paid" size="small" color="warning" variant="outlined" />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {selectedModelInfo?.thinking && (
              <Typography variant="caption" color="primary">
                Uses extended thinking for better reasoning
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              Estimated cost: {estimateCost(selectedModel)}
            </Typography>
          </Box>
          {selectedModelInfo && !selectedModelInfo.freeTier && (
            <Typography variant="caption" color="warning.main">
              This model requires a paid API plan
            </Typography>
          )}
        </Box>
      </FormControl>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Custom Instructions (Optional)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            multiline
            rows={3}
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Add any specific instructions for the AI, e.g., 'Emphasize my leadership experience' or 'Use a more formal tone'"
            variant="outlined"
            fullWidth
            disabled={isGenerating}
          />
        </AccordionDetails>
      </Accordion>

      {error && <Alert severity="error">{error}</Alert>}

      {isGenerating && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            AI is analyzing your data and generating customized content...
          </Typography>
        </Box>
      )}

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!hasValidInput || isGenerating}
        startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
        sx={{ alignSelf: 'flex-start' }}
      >
        {isGenerating ? 'Generating...' : 'Generate Customized CV'}
      </Button>
    </Box>
  );
};

export default JobPostingInput;
