'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tabs,
  Tab,
  Box,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import JobPostingInput from './JobPostingInput';
import type { JobInputData } from './JobPostingInput';
import GeneratedContentPreview from './GeneratedContentPreview';
import CVVersionManager from './CVVersionManager';
import { useCVVersion } from '../../contexts';
import {
  generateCustomizedCV,
  isGeminiConfigured,
} from '@/services/ai/gemini.service';
import type { CVVersionContent } from '@/services/cv/cvVersion.types';
import type { CompanyResearch } from '@/services/ai/gemini.service';
import type { GeminiModelId } from '@/config/gemini.config';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 2 }}>
    {value === index && children}
  </Box>
);

interface CVCustomizationDialogProps {
  open: boolean;
  onClose: () => void;
}

const CVCustomizationDialog = ({ open, onClose }: CVCustomizationDialogProps) => {
  const [tabValue, setTabValue] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<CVVersionContent | null>(null);
  const [companyResearch, setCompanyResearch] = useState<CompanyResearch | null>(null);
  const [lastInputData, setLastInputData] = useState<JobInputData | null>(null);

  const { activeContent, createVersion } = useCVVersion();

  const handleGenerate = async (
    inputData: JobInputData,
    customInstructions?: string,
    modelId?: GeminiModelId
  ) => {
    setError(null);
    setIsGenerating(true);
    setLastInputData(inputData);

    try {
      const result = await generateCustomizedCV({
        currentTagline: activeContent.tagline,
        currentProfile: activeContent.profile,
        currentSlogan: activeContent.slogan,
        company: inputData.company,
        jobTitle: inputData.jobTitle,
        jobPosting: inputData.jobPosting,
        jobPostingUrl: inputData.jobPostingUrl,
        companyWebsite: inputData.companyWebsite,
        dataSourceSelection: inputData.dataSourceSelection,
        uploadedFile: inputData.uploadedFile,
        customInstructions,
        modelId,
      });

      setGeneratedContent(result.content);
      setCompanyResearch(result.companyResearch);
      setTabValue(1); // Switch to preview tab
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate content';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (name: string, content: CVVersionContent) => {
    setIsSaving(true);
    try {
      await createVersion(name, content, {
        // Prefer user-provided values over AI-extracted values
        company: lastInputData?.company || companyResearch?.company.name || '',
        position: lastInputData?.jobTitle || companyResearch?.role.title || '',
        jobPosting: lastInputData?.jobPosting || '',
        jobPostingUrl: lastInputData?.jobPostingUrl,
        companyWebsite: lastInputData?.companyWebsite,
        uploadedFileName: lastInputData?.uploadedFile?.name,
        dataSourceSelection: lastInputData?.dataSourceSelection,
      });
      setGeneratedContent(null);
      setCompanyResearch(null);
      setLastInputData(null);
      setTabValue(2); // Switch to versions tab
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save version';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setGeneratedContent(null);
    setCompanyResearch(null);
    setLastInputData(null);
    setError(null);
    setTabValue(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        CV Customization
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {!isGeminiConfigured() && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Gemini API is not configured. AI customization features are disabled. You can still
            manage existing versions.
          </Alert>
        )}

        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Generate" disabled={!isGeminiConfigured()} />
          <Tab label="Preview" disabled={!generatedContent} />
          <Tab label="Versions" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <JobPostingInput onGenerate={handleGenerate} isGenerating={isGenerating} error={error} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {generatedContent && companyResearch && (
            <GeneratedContentPreview
              originalContent={activeContent}
              generatedContent={generatedContent}
              companyResearch={companyResearch}
              jobInputData={lastInputData || undefined}
              onSave={handleSave}
              isSaving={isSaving}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <CVVersionManager />
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default CVCustomizationDialog;
