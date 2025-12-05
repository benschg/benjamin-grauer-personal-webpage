'use client';

import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import CVDocument from '@/components/cv/CVDocument';
import MotivationLetterDocument from '@/components/cv/MotivationLetterDocument';
import CVToolbar from '@/components/cv/CVToolbar';
import { CVThemeProvider, CVVersionProvider, useCVTheme, useCVVersion } from '@/components/cv/contexts';
import { CERTIFICATES_PDF_PATH, REFERENCES_PDF_PATH } from '@/components/working-life/content';

export type DocumentTab = 'cv' | 'motivation-letter';

// Component that uses the context
const CVPageContent = () => {
  const cvRef = useRef<HTMLDivElement>(null);
  const motivationLetterRef = useRef<HTMLDivElement>(null);
  const { theme, showAttachments, privacyLevel, canShowPrivateInfo } = useCVTheme();
  const { activeContent, activeVersion, error: versionError } = useCVVersion();
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [cvStyles, setCvStyles] = useState<string>('');
  const [activeTab, setActiveTab] = useState<DocumentTab>('cv');

  // Check if motivation letter is available
  const hasMotivationLetter = !!activeContent.motivationLetter;

  // Load CSS styles
  useEffect(() => {
    fetch('/api/cv-styles')
      .then((res) => res.text())
      .then((css) => setCvStyles(css))
      .catch((err) => console.error('Failed to load CV styles:', err));
  }, []);

  // Reset to CV tab if motivation letter becomes unavailable
  useEffect(() => {
    if (!hasMotivationLetter && activeTab === 'motivation-letter') {
      setActiveTab('cv');
    }
  }, [hasMotivationLetter, activeTab]);

  const handlePrint = useReactToPrint({
    contentRef: activeTab === 'cv' ? cvRef : motivationLetterRef,
    documentTitle: activeTab === 'cv' ? 'Benjamin_Grauer_CV' : 'Benjamin_Grauer_Motivation_Letter',
  });

  const handleDownloadPdf = useCallback(async () => {
    const currentRef = activeTab === 'cv' ? cvRef.current : motivationLetterRef.current;
    if (!currentRef || !cvStyles) return;

    setIsDownloading(true);
    setPdfError(null);

    try {
      // Get the document HTML content
      const html = currentRef.outerHTML;

      // Effective privacy level: only allow private info if user is logged in
      const effectivePrivacyLevel = canShowPrivateInfo ? privacyLevel : 'none';

      // Determine filename based on active tab
      const baseFilename = activeTab === 'cv'
        ? (showAttachments ? `Benjamin_Grauer_CV_with_attachments_${theme}` : `Benjamin_Grauer_CV_${theme}`)
        : `Benjamin_Grauer_Motivation_Letter_${theme}`;

      // Call the Next.js API route to generate PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html,
          css: cvStyles,
          theme,
          filename: `${baseFilename}.pdf`,
          baseUrl: window.location.origin,
          attachments: activeTab === 'cv' && showAttachments ? [REFERENCES_PDF_PATH, CERTIFICATES_PDF_PATH] : undefined,
          privacyLevel: effectivePrivacyLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // The API returns the PDF directly as a download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${baseFilename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setPdfError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  }, [activeTab, theme, cvStyles, showAttachments, privacyLevel, canShowPrivateInfo]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#1a1d20',
        margin: 0,
        padding: 0,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <CVToolbar
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        isDownloading={isDownloading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasMotivationLetter={hasMotivationLetter}
      />
      {/* Job context indicator - show below toolbar */}
      {activeVersion?.job_context && (activeVersion.job_context.company || activeVersion.job_context.position) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 0.75,
            bgcolor: 'rgba(137, 102, 93, 0.15)',
            borderBottom: '1px solid rgba(137, 102, 93, 0.3)',
          }}
          className="cv-no-print"
        >
          <Box
            component="span"
            sx={{
              color: '#89665d',
              fontSize: '0.85rem',
              fontStyle: 'italic',
            }}
          >
            {activeVersion.job_context.position && activeVersion.job_context.company
              ? `${activeVersion.job_context.position} at ${activeVersion.job_context.company}`
              : activeVersion.job_context.position || activeVersion.job_context.company}
          </Box>
        </Box>
      )}
      {versionError && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
          <Alert severity="warning" sx={{ maxWidth: 600 }}>
            {versionError}
          </Alert>
        </Box>
      )}
      {activeTab === 'cv' ? (
        <CVDocument ref={cvRef} />
      ) : (
        <MotivationLetterDocument ref={motivationLetterRef} />
      )}
      <Snackbar open={!!pdfError} autoHideDuration={6000} onClose={() => setPdfError(null)}>
        <Alert severity="error" onClose={() => setPdfError(null)}>
          {pdfError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Loading fallback for Suspense
const CVLoadingFallback = () => (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: '#1a1d20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress sx={{ color: '#89665d' }} />
  </Box>
);

// Main page component with providers
const CVPage = () => {
  return (
    <Suspense fallback={<CVLoadingFallback />}>
      <CVThemeProvider>
        <CVVersionProvider>
          <CVPageContent />
        </CVVersionProvider>
      </CVThemeProvider>
    </Suspense>
  );
};

export default CVPage;
