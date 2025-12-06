'use client';

import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Snackbar, Alert, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { CVAdminBar, CVCustomizationDialog, LLMInputDataDialog } from '@/components/cv/components/admin';
import { useAuth } from '@/contexts';
import { useReactToPrint } from 'react-to-print';
import CVDocument from '@/components/cv/CVDocument';
import MotivationLetterDocument from '@/components/cv/MotivationLetterDocument';
import CVToolbar from '@/components/cv/CVToolbar';
import { EXPORT_PANEL_WIDTH } from '@/components/cv/ExportOptionsDialog';
import { CVThemeProvider, CVVersionProvider, useCVTheme, useCVVersion } from '@/components/cv/contexts';
import { CERTIFICATES_PDF_PATH, REFERENCES_PDF_PATH } from '@/components/working-life/content';

export type DocumentTab = 'cv' | 'motivation-letter';

// Component that uses the context
const CVPageContent = () => {
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up('md'));
  const searchParams = useSearchParams();
  const router = useRouter();
  const cvRef = useRef<HTMLDivElement>(null);
  const motivationLetterRef = useRef<HTMLDivElement>(null);
  const { theme, showPhoto, showExperience, showAttachments, privacyLevel, canShowPrivateInfo } = useCVTheme();
  const { activeContent, activeVersion, error: versionError, isEditing } = useCVVersion();
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

  // Sync export panel state with URL parameter
  const exportPanelOpen = searchParams.get('export') === 'true';
  const setExportPanelOpen = useCallback((open: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (open) {
      params.set('export', 'true');
    } else {
      params.delete('export');
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, router]);

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

      // Determine filename based on active tab and options
      // Format: Benjamin_Grauer_CV[_detailed][_no_photo][_private][_attachments]_light.pdf
      const buildCVFilename = () => {
        const parts = ['Benjamin_Grauer_CV'];
        if (showExperience) parts.push('detailed');
        if (!showPhoto) parts.push('no_photo');
        if (effectivePrivacyLevel !== 'none') parts.push('private');
        if (showAttachments) parts.push('attachments');
        parts.push(theme);
        return parts.join('_');
      };

      const baseFilename = activeTab === 'cv'
        ? buildCVFilename()
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
  }, [activeTab, theme, cvStyles, showPhoto, showExperience, showAttachments, privacyLevel, canShowPrivateInfo]);

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
        renderToolbarBar={false}
        exportPanelOpen={exportPanelOpen}
        onExportPanelChange={setExportPanelOpen}
        headerHeight={headerHeight}
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
            renderFloatingElements={false}
          />
        </Box>
        {/* Admin bar - always visible for admin */}
        {isAdmin && (
          <CVAdminBar
            onCustomizationOpen={() => setCustomizationOpen(true)}
            onLlmInputDataOpen={() => setLlmInputDataOpen(true)}
          />
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
      {/* Content container - shifts when export panel is open on desktop */}
      <Box
        sx={{
          marginRight: isDesktop && exportPanelOpen ? `${EXPORT_PANEL_WIDTH}px` : 0,
          transition: 'margin-right 0.3s ease-in-out',
        }}
      >
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
      </Box>
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
