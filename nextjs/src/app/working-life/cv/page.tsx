'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import CVDocument from '@/components/cv/CVDocument';
import CVToolbar from '@/components/cv/CVToolbar';
import { CVThemeProvider, CVVersionProvider, useCVTheme } from '@/components/cv/contexts';
import { CERTIFICATES_PDF_PATH, REFERENCES_PDF_PATH } from '@/components/working-life/content';

// Component that uses the context
const CVPageContent = () => {
  const cvRef = useRef<HTMLDivElement>(null);
  const { theme, showAttachments } = useCVTheme();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvStyles, setCvStyles] = useState<string>('');

  // Load CSS styles
  useEffect(() => {
    fetch('/api/cv-styles')
      .then((res) => res.text())
      .then((css) => setCvStyles(css))
      .catch((err) => console.error('Failed to load CV styles:', err));
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: 'Benjamin_Grauer_CV',
  });

  const handleDownloadPdf = useCallback(async () => {
    if (!cvRef.current || !cvStyles) return;

    setIsDownloading(true);
    setError(null);

    try {
      // Get the CV HTML content
      const html = cvRef.current.outerHTML;

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
          filename: showAttachments
            ? `Benjamin_Grauer_CV_with_attachments_${theme}.pdf`
            : `Benjamin_Grauer_CV_${theme}.pdf`,
          baseUrl: window.location.origin,
          attachments: showAttachments ? [REFERENCES_PDF_PATH, CERTIFICATES_PDF_PATH] : undefined,
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
      link.download = showAttachments
        ? `Benjamin_Grauer_CV_with_attachments_${theme}.pdf`
        : `Benjamin_Grauer_CV_${theme}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  }, [theme, cvStyles, showAttachments]);

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
      />
      <CVDocument ref={cvRef} />
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Main page component with providers
const CVPage = () => {
  return (
    <CVThemeProvider>
      <CVVersionProvider>
        <CVPageContent />
      </CVVersionProvider>
    </CVThemeProvider>
  );
};

export default CVPage;
