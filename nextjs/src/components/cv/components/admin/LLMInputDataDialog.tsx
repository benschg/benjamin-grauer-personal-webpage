'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import TuneIcon from '@mui/icons-material/Tune';
import DataObjectIcon from '@mui/icons-material/DataObject';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InsightsIcon from '@mui/icons-material/Insights';
import type { CVVersion } from '@/types/database.types';
import { getDataSourceLabels } from '@/services/ai/cvDataAggregator';

// Helper component for accordion section headers with copy button
interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  copyText?: string;
  copyId?: string;
  copiedSection: string | null;
  onCopy: (text: string, section: string) => void;
}

const SectionHeader = ({
  icon,
  title,
  copyText,
  copyId,
  copiedSection,
  onCopy,
}: SectionHeaderProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
    {icon}
    <Typography sx={{ fontWeight: 500, flex: 1 }}>{title}</Typography>
    {copyText && copyId && (
      <Tooltip title={copiedSection === copyId ? 'Copied!' : 'Copy'}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(copyText, copyId);
          }}
          sx={{ color: copiedSection === copyId ? 'success.main' : 'inherit' }}
        >
          {copiedSection === copyId ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    )}
  </Box>
);

// Helper component for text blocks
interface TextBlockProps {
  content: string;
  maxHeight?: number;
}

const TextBlock = ({ content, maxHeight = 200 }: TextBlockProps) => (
  <Box
    sx={{
      bgcolor: 'rgba(0,0,0,0.2)',
      p: 1.5,
      borderRadius: 1,
      maxHeight,
      overflow: 'auto',
      fontFamily: 'monospace',
      fontSize: '0.8rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }}
  >
    {content}
  </Box>
);

interface LLMInputDataDialogProps {
  open: boolean;
  onClose: () => void;
  version: CVVersion | null;
}

const LLMInputDataDialog = ({ open, onClose, version }: LLMInputDataDialogProps) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedPanels, setExpandedPanels] = useState<string[]>(['job-context', 'data-sources']);

  const handleCopy = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const handlePanelChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanels((prev) =>
      isExpanded ? [...prev, panel] : prev.filter((p) => p !== panel)
    );
  };

  const copyAll = async () => {
    if (!version) return;
    const fullData = JSON.stringify(
      {
        job_context: version.job_context,
        llm_metadata: version.llm_metadata,
      },
      null,
      2
    );
    await handleCopy(fullData, 'all');
  };

  if (!version) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>LLM Input Data</DialogTitle>
        <DialogContent>
          <Alert severity="info">No version selected or version has no LLM data.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const { job_context, llm_metadata } = version;
  const dataSourceLabels = getDataSourceLabels();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#343a40',
          color: 'white',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontFamily: 'Orbitron',
          letterSpacing: '0.05em',
        }}
      >
        <DataObjectIcon />
        LLM Input Data
        <Typography
          variant="caption"
          sx={{
            ml: 'auto',
            bgcolor: 'rgba(137, 102, 93, 0.3)',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          {version.name}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {!job_context && !llm_metadata ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            This version was created without LLM generation data.
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* LLM Metadata */}
            {llm_metadata && (
              <Accordion
                expanded={expandedPanels.includes('llm-metadata')}
                onChange={handlePanelChange('llm-metadata')}
                sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <SectionHeader
                    icon={<SmartToyIcon sx={{ color: '#89665d' }} />}
                    title="LLM Metadata"
                    copiedSection={copiedSection}
                    onCopy={handleCopy}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        Model
                      </Typography>
                      <Typography>{llm_metadata.model}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        Prompt Version
                      </Typography>
                      <Typography>{llm_metadata.promptVersion}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        Generated At
                      </Typography>
                      <Typography>
                        {new Date(llm_metadata.generatedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Job Context */}
            {job_context && (
              <>
                <Accordion
                  expanded={expandedPanels.includes('job-context')}
                  onChange={handlePanelChange('job-context')}
                  sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                    <SectionHeader
                      icon={<BusinessIcon sx={{ color: '#89665d' }} />}
                      title="Job Context"
                      copiedSection={copiedSection}
                      onCopy={handleCopy}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Company & Position */}
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="caption" color="rgba(255,255,255,0.6)">
                            <BusinessIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            Company
                          </Typography>
                          <Typography sx={{ fontWeight: 500 }}>
                            {job_context.company || 'Not specified'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="rgba(255,255,255,0.6)">
                            <WorkIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            Position
                          </Typography>
                          <Typography sx={{ fontWeight: 500 }}>
                            {job_context.position || 'Not specified'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Job Posting URL */}
                      {job_context.jobPostingUrl && (
                        <Box>
                          <Typography variant="caption" color="rgba(255,255,255,0.6)">
                            <LinkIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            Job Posting URL
                          </Typography>
                          <Typography
                            component="a"
                            href={job_context.jobPostingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'block',
                              color: '#89665d',
                              textDecoration: 'none',
                              wordBreak: 'break-all',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            {job_context.jobPostingUrl}
                          </Typography>
                        </Box>
                      )}

                      {/* Company Website */}
                      {job_context.companyWebsite && (
                        <Box>
                          <Typography variant="caption" color="rgba(255,255,255,0.6)">
                            <LinkIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            Company Website
                          </Typography>
                          <Typography
                            component="a"
                            href={job_context.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'block',
                              color: '#89665d',
                              textDecoration: 'none',
                              wordBreak: 'break-all',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            {job_context.companyWebsite}
                          </Typography>
                        </Box>
                      )}

                      {/* Uploaded File */}
                      {job_context.uploadedFileName && (
                        <Box>
                          <Typography variant="caption" color="rgba(255,255,255,0.6)">
                            <DescriptionIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            Uploaded File
                          </Typography>
                          <Typography>{job_context.uploadedFileName}</Typography>
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* Job Posting */}
                {job_context.jobPosting && (
                  <Accordion
                    expanded={expandedPanels.includes('job-posting')}
                    onChange={handlePanelChange('job-posting')}
                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                      <SectionHeader
                        icon={<DescriptionIcon sx={{ color: '#89665d' }} />}
                        title="Job Posting Text"
                        copyText={job_context.jobPosting}
                        copyId="job-posting"
                        copiedSection={copiedSection}
                        onCopy={handleCopy}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextBlock content={job_context.jobPosting} maxHeight={300} />
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Custom Instructions */}
                {job_context.customInstructions && (
                  <Accordion
                    expanded={expandedPanels.includes('custom-instructions')}
                    onChange={handlePanelChange('custom-instructions')}
                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                      <SectionHeader
                        icon={<TuneIcon sx={{ color: '#89665d' }} />}
                        title="Custom Instructions"
                        copyText={job_context.customInstructions}
                        copyId="custom-instructions"
                        copiedSection={copiedSection}
                        onCopy={handleCopy}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextBlock content={job_context.customInstructions} />
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Data Sources */}
                {job_context.dataSourceSelection && (
                  <Accordion
                    expanded={expandedPanels.includes('data-sources')}
                    onChange={handlePanelChange('data-sources')}
                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                      <SectionHeader
                        icon={<DataObjectIcon sx={{ color: '#89665d' }} />}
                        title="Data Sources Included"
                        copiedSection={copiedSection}
                        onCopy={handleCopy}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(job_context.dataSourceSelection).map(([key, enabled]) => {
                          const label = dataSourceLabels[key as keyof typeof dataSourceLabels];
                          return (
                            <Chip
                              key={key}
                              label={label?.label || key}
                              size="small"
                              color={enabled ? 'primary' : 'default'}
                              variant={enabled ? 'filled' : 'outlined'}
                              sx={{
                                bgcolor: enabled ? 'rgba(137, 102, 93, 0.6)' : 'transparent',
                                color: enabled ? 'white' : 'rgba(255,255,255,0.4)',
                                borderColor: 'rgba(255,255,255,0.2)',
                                textDecoration: enabled ? 'none' : 'line-through',
                              }}
                            />
                          );
                        })}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Company Research (if stored) */}
                {job_context.companyResearch && (
                  <Accordion
                    expanded={expandedPanels.includes('company-research')}
                    onChange={handlePanelChange('company-research')}
                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                      <SectionHeader
                        icon={<InsightsIcon sx={{ color: '#89665d' }} />}
                        title="AI Company Research"
                        copyText={JSON.stringify(job_context.companyResearch, null, 2)}
                        copyId="company-research"
                        copiedSection={copiedSection}
                        onCopy={handleCopy}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Company Info */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#89665d', mb: 1 }}>
                            Company Analysis
                          </Typography>
                          <Box sx={{ pl: 2 }}>
                            <Typography variant="body2">
                              <strong>Industry:</strong> {job_context.companyResearch.company.industry}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Culture:</strong> {job_context.companyResearch.company.culture.join(', ')}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Values:</strong> {job_context.companyResearch.company.values.join(', ')}
                            </Typography>
                            {job_context.companyResearch.company.techStack.length > 0 && (
                              <Typography variant="body2">
                                <strong>Tech Stack:</strong> {job_context.companyResearch.company.techStack.join(', ')}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                        {/* Role Analysis */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#89665d', mb: 1 }}>
                            Role Analysis
                          </Typography>
                          <Box sx={{ pl: 2 }}>
                            <Typography variant="body2">
                              <strong>Level:</strong> {job_context.companyResearch.role.level}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Required Skills:</strong> {job_context.companyResearch.role.requiredSkills.join(', ')}
                            </Typography>
                            {job_context.companyResearch.role.preferredSkills.length > 0 && (
                              <Typography variant="body2">
                                <strong>Preferred Skills:</strong> {job_context.companyResearch.role.preferredSkills.join(', ')}
                              </Typography>
                            )}
                            <Typography variant="body2">
                              <strong>Keywords:</strong> {job_context.companyResearch.role.keywords.join(', ')}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                        {/* Insights */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#89665d', mb: 1 }}>
                            AI Insights
                          </Typography>
                          <Box sx={{ pl: 2 }}>
                            <Typography variant="body2">
                              <strong>What They Value:</strong> {job_context.companyResearch.insights.whatTheyValue}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Tone Guidance:</strong> {job_context.companyResearch.insights.toneGuidance}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={copyAll}
          startIcon={copiedSection === 'all' ? <CheckIcon /> : <ContentCopyIcon />}
          sx={{ color: copiedSection === 'all' ? 'success.main' : 'rgba(255,255,255,0.7)' }}
        >
          {copiedSection === 'all' ? 'Copied!' : 'Copy All as JSON'}
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#89665d',
            '&:hover': { bgcolor: '#6d524a' },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LLMInputDataDialog;
