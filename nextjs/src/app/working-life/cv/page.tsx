'use client';

import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Box, Snackbar, Alert, CircularProgress, IconButton, Tooltip, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { CVVersionSelector, CVCustomizationDialog, LLMInputDataDialog } from '@/components/cv/components/admin';
import { useAuth } from '@/contexts';
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
  const { activeContent, activeVersion, error: versionError, isEditing, startEditing, cancelEditing, saveEdits, isSaving } = useCVVersion();
  const { user } = useAuth();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = user && adminEmail && user.email === adminEmail;
  const [isDownloading, setIsDownloading] = useState(false);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [llmInputDataOpen, setLlmInputDataOpen] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [cvStyles, setCvStyles] = useState<string>('');
  const [activeTab, setActiveTab] = useState<DocumentTab>('cv');
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const toolbarBarRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(85);
  const [toolbarBarHeight, setToolbarBarHeight] = useState(57);

  // Check if motivation letter is available
  const hasMotivationLetter = !!activeContent.motivationLetter;

  // Load CSS styles
  useEffect(() => {
    fetch('/api/cv-styles')
      .then((res) => res.text())
      .then((css) => setCvStyles(css))
      .catch((err) => console.error('Failed to load CV styles:', err));
  }, []);

  // Measure header and toolbar bar heights on mount and resize
  useEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      if (toolbarBarRef.current) {
        setToolbarBarHeight(toolbarBarRef.current.offsetHeight);
      }
    };
    requestAnimationFrame(updateHeights);
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, [isAdmin, hasMotivationLetter, isEditing]);

  // Handle scroll to show/hide toolbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Only change state if scrolled more than 10px to avoid flickering
      if (Math.abs(scrollDelta) > 10) {
        if (scrollDelta > 0 && currentScrollY > 60) {
          // Scrolling down - hide toolbar
          setToolbarVisible(false);
        } else if (scrollDelta < 0) {
          // Scrolling up - show toolbar
          setToolbarVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
        overflowX: 'hidden',
      }}
    >
      {/* CVToolbar renders floating elements (fixed position, not affected by transform) */}
      <CVToolbar
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        isDownloading={isDownloading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasMotivationLetter={hasMotivationLetter}
        toolbarVisible={toolbarVisible}
        renderToolbarBar={false}
      />
      {/* Fixed header container - slides up when scrolling */}
      <Box
        ref={headerRef}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transform: toolbarVisible ? 'translateY(0)' : `translateY(-${toolbarBarHeight}px)`,
          transition: 'transform 0.3s ease-in-out',
        }}
        className="cv-no-print"
      >
        {/* Toolbar bar - inside the translated container */}
        <Box ref={toolbarBarRef}>
          <CVToolbar
            onPrint={handlePrint}
            onDownloadPdf={handleDownloadPdf}
            isDownloading={isDownloading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasMotivationLetter={hasMotivationLetter}
            toolbarVisible={toolbarVisible}
            renderFloatingElements={false}
          />
        </Box>
        {/* Version selector bar - always visible for admin */}
        {isAdmin && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              py: 0.25,
              bgcolor: isEditing ? 'rgba(46, 125, 50, 0.95)' : 'rgba(26, 29, 32, 0.95)',
            }}
          >
            {isEditing ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                  justifyContent: 'space-between',
                  px: 2,
                  minWidth: 0,
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CancelIcon sx={{ fontSize: 14 }} />}
                  onClick={cancelEditing}
                  disabled={isSaving}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                    flexShrink: 0,
                    py: 0,
                    px: 0.5,
                    minHeight: 24,
                    fontSize: '0.75rem',
                  }}
                >
                  Cancel
                </Button>
                <Box
                  sx={{
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    flex: '1 1 auto',
                    textAlign: 'center',
                    px: 1,
                  }}
                >
                  Editing: {activeVersion?.name || 'Default CV'}
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={isSaving ? <CircularProgress size={12} color="inherit" /> : <SaveIcon sx={{ fontSize: 14 }} />}
                  onClick={saveEdits}
                  disabled={isSaving}
                  sx={{
                    bgcolor: 'white',
                    color: '#2e7d32',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                    '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.5)' },
                    flexShrink: 0,
                    py: 0,
                    px: 0.5,
                    minHeight: 24,
                    fontSize: '0.75rem',
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                  justifyContent: 'center',
                  px: 2,
                  minWidth: 0,
                }}
              >
                <Box sx={{ minWidth: 0, flex: '0 1 auto', overflow: 'hidden' }}>
                  <CVVersionSelector />
                </Box>
                {/* Show LLM input data button when a custom version is selected */}
                {activeVersion?.job_context && (
                  <Tooltip title="View LLM Input Data">
                    <IconButton
                      size="small"
                      onClick={() => setLlmInputDataOpen(true)}
                      sx={{ color: 'rgba(137, 102, 93, 0.7)', p: 0.5, flexShrink: 0 }}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="AI Customization">
                  <IconButton
                    size="small"
                    onClick={() => setCustomizationOpen(true)}
                    sx={{ color: '#89665d', p: 0.5, flexShrink: 0 }}
                  >
                    <AutoAwesomeIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {activeVersion && (
                  <Tooltip title="Edit CV inline">
                    <IconButton
                      size="small"
                      onClick={startEditing}
                      sx={{ color: '#89665d', p: 0.5, flexShrink: 0 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
      {/* Spacer for fixed header */}
      <Box
        sx={{ height: headerHeight || 85 }}
        className="cv-no-print"
      />
      {/* Dialogs */}
      <CVCustomizationDialog open={customizationOpen} onClose={() => setCustomizationOpen(false)} />
      <LLMInputDataDialog open={llmInputDataOpen} onClose={() => setLlmInputDataOpen(false)} version={activeVersion} />
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
