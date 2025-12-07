"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Fab,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SubjectIcon from "@mui/icons-material/Subject";
import ArticleIcon from "@mui/icons-material/Article";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonIcon from "@mui/icons-material/Person";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SecurityIcon from "@mui/icons-material/Security";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ShareIcon from "@mui/icons-material/Share";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import WorkOffIcon from "@mui/icons-material/WorkOff";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AttachFileOffIcon from "@mui/icons-material/LinkOff";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useCVTheme, useCVVersion } from "./contexts";
import {
  CERTIFICATES_PDF_PATH,
  REFERENCES_PDF_PATH,
} from "@/components/working-life/content";
import { useAuth } from "@/contexts";
import ExportOptionsDialog from "./ExportOptionsDialog";
import ShareDialog from "./ShareDialog";
import type { DocumentTab } from "@/app/working-life/cv/page";

interface CVToolbarProps {
  onPrint: () => void;
  onDownloadPdf?: () => void;
  isDownloading?: boolean;
  activeTab?: DocumentTab;
  onTabChange?: (tab: DocumentTab) => void;
  hasMotivationLetter?: boolean;
  renderToolbarBar?: boolean;
  renderFloatingElements?: boolean;
  exportPanelOpen?: boolean;
  onExportPanelChange?: (open: boolean) => void;
  headerHeight?: number;
  showExportButton?: boolean;
}

const CVToolbar = ({
  onPrint,
  onDownloadPdf,
  isDownloading,
  activeTab = "cv",
  onTabChange,
  hasMotivationLetter = false,
  renderToolbarBar = true,
  renderFloatingElements = true,
  exportPanelOpen: externalExportPanelOpen,
  onExportPanelChange,
  headerHeight = 0,
  showExportButton = true,
}: CVToolbarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    theme,
    toggleTheme,
    setTheme,
    showPhoto,
    togglePhoto,
    setShowPhoto,
    privacyLevel,
    cyclePrivacyLevel,
    setPrivacyLevel,
    canShowPrivateInfo,
    canShowReferenceInfo,
    showExperience,
    toggleExperience,
    setShowExperience,
    showAttachments,
    toggleAttachments,
    setShowAttachments,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
  } = useCVTheme();

  // Helper to get privacy icon and tooltip
  const getPrivacyIcon = () => {
    if (privacyLevel === "none") return <LockIcon />;
    if (privacyLevel === "personal") return <LockOpenIcon />;
    return <SecurityIcon />;
  };

  const getPrivacyTooltip = () => {
    if (privacyLevel === "none") return "Show Personal Contact Info";
    if (privacyLevel === "personal") {
      return canShowReferenceInfo
        ? "Show All (incl. Reference Contacts)"
        : "Hide Private Info";
    }
    return "Hide Private Info";
  };

  const getPrivacyColor = () => {
    if (privacyLevel === "none") return "rgba(255,255,255,0.4)";
    if (privacyLevel === "personal") return "white";
    return "#89665d"; // accent color for full
  };
  const { user, signIn, signOut } = useAuth();
  const { isEditing, activeContent } = useCVVersion();
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [printWarningOpen, setPrintWarningOpen] = useState(false);
  const [internalExportDialogOpen, setInternalExportDialogOpen] =
    useState(false);
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);
  const [copySnackbarMessage, setCopySnackbarMessage] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Get current URL for sharing (includes all display settings)
  const getCurrentShareUrl = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();

    // Add version if set
    const versionId = searchParams.get("version");
    if (versionId) params.set("version", versionId);

    // Add display settings
    if (theme !== "dark") params.set("theme", theme);
    if (!showPhoto) params.set("photo", "0");
    if (privacyLevel !== "none") params.set("privacy", privacyLevel);
    if (!showExperience) params.set("experience", "0");
    if (showAttachments) params.set("attachments", "1");
    // showExport follows the export panel state - if panel is open, show the export button
    if (!externalExportPanelOpen) params.set("showExport", "0");
    if (externalExportPanelOpen) params.set("export", "true");

    const baseUrl = `${window.location.origin}/working-life/cv`;
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Use external control if provided, otherwise use internal state
  const exportDialogOpen = externalExportPanelOpen ?? internalExportDialogOpen;
  const setExportDialogOpen =
    onExportPanelChange ?? setInternalExportDialogOpen;

  const handlePrintClick = () => {
    if (showAttachments) {
      setPrintWarningOpen(true);
    } else {
      onPrint();
    }
  };

  const handleConfirmPrint = () => {
    setPrintWarningOpen(false);
    onPrint();
  };

  const handleBack = () => {
    router.push("/working-life");
  };

  const handleSpeedDialClose = () => {
    setSpeedDialOpen(false);
  };

  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
  };

  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  const handleConfirmExport = () => {
    setExportDialogOpen(false);
    if (onDownloadPdf) {
      onDownloadPdf();
    }
  };

  // Helper to get privacy level description
  const getPrivacyDescription = () => {
    if (privacyLevel === "none") return "Hidden (contact on request)";
    if (privacyLevel === "personal") return "Personal contact info visible";
    return "All contact info visible (including references)";
  };

  // Copy motivation letter content to clipboard
  const handleCopySubject = async () => {
    const letter = activeContent.motivationLetter;
    if (!letter) return;

    try {
      await navigator.clipboard.writeText(letter.subject);
      setCopySnackbarMessage("Subject copied to clipboard");
      setCopySnackbarOpen(true);
    } catch (err) {
      console.error("Failed to copy subject:", err);
    }
  };

  const handleCopyBody = async () => {
    const letter = activeContent.motivationLetter;
    if (!letter) return;

    // Combine all letter body parts
    const bodyText = [
      letter.greeting,
      "",
      letter.opening,
      "",
      letter.body,
      "",
      letter.closing,
      "",
      letter.signoff,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(bodyText);
      setCopySnackbarMessage("Letter body copied to clipboard");
      setCopySnackbarOpen(true);
    } catch (err) {
      console.error("Failed to copy body:", err);
    }
  };

  // Toolbar bar content (top navigation bar)
  const toolbarBar = (
    <>
      {/* Top Toolbar */}
      <Box className="cv-toolbar cv-no-print">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            color: "white",
            minWidth: "auto",
            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 8px 0 -4px" },
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Back to Working Life
          </Box>
        </Button>
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Document tabs - show when motivation letter is available */}
          {hasMotivationLetter && onTabChange ? (
            <ToggleButtonGroup
              value={activeTab}
              exclusive
              onChange={(_, newTab) => newTab && onTabChange(newTab)}
              size="small"
              sx={{
                mb: 0.5,
                "& .MuiToggleButton-root": {
                  color: "rgba(255,255,255,0.6)",
                  borderColor: "rgba(255,255,255,0.2)",
                  py: 0.5,
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  "&.Mui-selected": {
                    color: "white",
                    bgcolor: "rgba(137, 102, 93, 0.4)",
                    borderColor: "#89665d",
                  },
                  "&:hover": {
                    bgcolor: "rgba(137, 102, 93, 0.2)",
                  },
                },
              }}
            >
              <ToggleButton value="cv" aria-label="CV">
                <DescriptionIcon
                  sx={{ fontSize: "1rem", mr: { xs: 0, sm: 0.5 } }}
                />
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  CV
                </Box>
              </ToggleButton>
              <ToggleButton
                value="motivation-letter"
                aria-label="Motivation Letter"
              >
                <EmailIcon sx={{ fontSize: "1rem", mr: { xs: 0, sm: 0.5 } }} />
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Letter
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Orbitron",
                letterSpacing: "0.1em",
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", md: "inline" } }}
              >
                Curriculum Vitae
              </Box>
              <Box
                component="span"
                sx={{ display: { xs: "inline", md: "none" } }}
              >
                CV
              </Box>
            </Typography>
          )}
        </Box>
        <Box className="cv-toolbar-actions">
          {/* Share button */}
          <Tooltip title="Share CV">
            <IconButton
              onClick={() => setShareDialogOpen(true)}
              sx={{ color: "white" }}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>

          {/* Admin dashboard link - only for admins */}
          {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
            <Tooltip title="Admin Dashboard">
              <IconButton
                onClick={() => router.push("/admin")}
                sx={{ color: "#89665d" }}
              >
                <AdminPanelSettingsIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Auth button */}
          {user ? (
            <Tooltip title={`Sign out (${user.email})`}>
              <IconButton onClick={signOut} sx={{ color: "white" }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Admin Sign In">
              <IconButton onClick={signIn} sx={{ color: "#666" }}>
                <LoginIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Print warning when attachments are enabled */}
        <Snackbar
          open={printWarningOpen}
          onClose={() => setPrintWarningOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="warning"
            onClose={() => setPrintWarningOpen(false)}
            sx={{ width: "100%", maxWidth: "500px" }}
          >
            <Box sx={{ mb: 1.5 }}>
              <strong>Attachments cannot be included when printing.</strong>
            </Box>
            <Box sx={{ mb: 1, fontSize: "0.875rem" }}>
              View documents separately or download the complete PDF with all
              attachments.
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
              <Button
                color="inherit"
                size="small"
                href={CERTIFICATES_PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
              >
                Certificates
              </Button>
              <Button
                color="inherit"
                size="small"
                href={REFERENCES_PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
              >
                References
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                color="inherit"
                size="small"
                onClick={() => setPrintWarningOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color="inherit"
                size="small"
                variant="outlined"
                onClick={handleConfirmPrint}
                startIcon={<PrintIcon />}
              >
                Print Anyway
              </Button>
              {onDownloadPdf && (
                <Button
                  color="inherit"
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setPrintWarningOpen(false);
                    onDownloadPdf();
                  }}
                  startIcon={<DownloadIcon />}
                >
                  Download All
                </Button>
              )}
            </Box>
          </Alert>
        </Snackbar>
      </Box>
    </>
  );

  // Floating elements content (positioned independently of header transform)
  const floatingElements = (
    <>
      {/* Floating Sidebar for Display Toggles - Desktop Only (hidden when export panel open) */}
      <Box
        className="cv-floating-sidebar cv-no-print"
        sx={{
          display: { xs: "none", md: exportDialogOpen ? "none" : "flex" },
        }}
      >
        {/* Privacy toggle - only show when logged in */}
        {canShowPrivateInfo && (
          <Tooltip title={getPrivacyTooltip()} placement="left">
            <IconButton
              onClick={cyclePrivacyLevel}
              sx={{ color: getPrivacyColor() }}
            >
              {getPrivacyIcon()}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip
          title={showPhoto ? "Hide Photo" : "Show Photo"}
          placement="left"
        >
          <IconButton
            onClick={togglePhoto}
            sx={{ color: showPhoto ? "white" : "rgba(255,255,255,0.4)" }}
          >
            {showPhoto ? <PersonIcon /> : <PersonOffIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            showExperience
              ? "Hide Detailed Experience"
              : "Show Detailed Experience"
          }
          placement="left"
        >
          <IconButton
            onClick={toggleExperience}
            sx={{ color: showExperience ? "white" : "rgba(255,255,255,0.4)" }}
          >
            {showExperience ? <WorkHistoryIcon /> : <WorkOffIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            showAttachments
              ? "Hide Attachments (Certificates & References)"
              : "Show Attachments (Certificates & References)"
          }
          placement="left"
        >
          <IconButton
            onClick={toggleAttachments}
            sx={{ color: showAttachments ? "white" : "rgba(255,255,255,0.4)" }}
          >
            {showAttachments ? <AttachFileIcon /> : <AttachFileOffIcon />}
          </IconButton>
        </Tooltip>
        <Box
          sx={{
            width: "24px",
            height: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            my: 0.5,
          }}
        />
        <Tooltip
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
          placement="left"
        >
          <IconButton onClick={toggleTheme} sx={{ color: "white" }}>
            {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Bottom Zoom Bar - Desktop Only (centered) */}
      <Box
        className="cv-bottom-zoom-bar cv-no-print"
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        <IconButton onClick={zoomOut} size="small" sx={{ color: "white" }}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Tooltip title={zoom === 0 ? "Auto" : "Reset to Auto"} placement="top">
          <Button
            onClick={resetZoom}
            size="small"
            sx={{
              color: zoom === 0 ? "rgba(255,255,255,0.5)" : "white",
              minWidth: "50px",
              fontSize: "0.75rem",
              padding: "2px 8px",
            }}
          >
            {zoom === 0 ? "Auto" : `${Math.round(zoom * 100)}%`}
          </Button>
        </Tooltip>
        <IconButton onClick={zoomIn} size="small" sx={{ color: "white" }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Floating Export Button - Desktop (bottom right) - hidden when export panel open */}
      {!isEditing && onDownloadPdf && !exportDialogOpen && (
        <Box
          className="cv-no-print"
          sx={{
            display: { xs: "none", md: "flex" },
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
            gap: 1.5,
          }}
        >
          {/* Copy buttons for motivation letter mode */}
          {activeTab === "motivation-letter" &&
            activeContent.motivationLetter && (
              <>
                <Tooltip title="Copy Subject" placement="top">
                  <Fab
                    size="medium"
                    onClick={handleCopySubject}
                    sx={{
                      bgcolor: "#343a40",
                      color: "white",
                      "&:hover": { bgcolor: "#4a5058" },
                    }}
                  >
                    <SubjectIcon />
                  </Fab>
                </Tooltip>
                <Tooltip title="Copy Letter Body" placement="top">
                  <Fab
                    size="medium"
                    onClick={handleCopyBody}
                    sx={{
                      bgcolor: "#343a40",
                      color: "white",
                      "&:hover": { bgcolor: "#4a5058" },
                    }}
                  >
                    <ArticleIcon />
                  </Fab>
                </Tooltip>
              </>
            )}
          {showExportButton && (
            <Fab
              variant="extended"
              color="primary"
              onClick={handleExportClick}
              disabled={isDownloading}
              sx={{
                bgcolor: "#89665d",
                "&:hover": { bgcolor: "#6d524a" },
                "&.Mui-disabled": { bgcolor: "rgba(137, 102, 93, 0.5)" },
                gap: 1,
              }}
            >
              {isDownloading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DownloadIcon />
              )}
              {isDownloading ? "Generating..." : "Export PDF"}
            </Fab>
          )}
        </Box>
      )}

      {/* Mobile: Zoom bar + Export FAB + SpeedDial in same container */}
      <Box
        className="cv-no-print"
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          gap: 1,
          alignItems: "flex-end",
        }}
      >
        {/* Zoom controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            padding: "0.25rem 0.5rem",
            backgroundColor: "rgba(52, 58, 64, 0.9)",
            border: "1px solid rgba(137, 102, 93, 0.5)",
            borderRadius: "20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <IconButton
            onClick={zoomOut}
            size="small"
            sx={{ color: "white", p: 0.5 }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Tooltip
            title={zoom === 0 ? "Auto" : "Reset to Auto"}
            placement="top"
          >
            <Button
              onClick={resetZoom}
              size="small"
              sx={{
                color: zoom === 0 ? "rgba(255,255,255,0.5)" : "white",
                minWidth: "40px",
                fontSize: "0.7rem",
                padding: "2px 4px",
              }}
            >
              {zoom === 0 ? "Auto" : `${Math.round(zoom * 100)}%`}
            </Button>
          </Tooltip>
          <IconButton
            onClick={zoomIn}
            size="small"
            sx={{ color: "white", p: 0.5 }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
        {/* Export FAB with copy buttons stacked above for motivation letter mode - Mobile */}
        {!isEditing && onDownloadPdf && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Copy buttons stacked above Export */}
            {activeTab === "motivation-letter" &&
              activeContent.motivationLetter && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Copy Subject" placement="top">
                    <Fab
                      size="small"
                      onClick={handleCopySubject}
                      sx={{
                        bgcolor: "#343a40",
                        color: "white",
                        "&:hover": { bgcolor: "#4a5058" },
                      }}
                    >
                      <SubjectIcon fontSize="small" />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Copy Letter Body" placement="top">
                    <Fab
                      size="small"
                      onClick={handleCopyBody}
                      sx={{
                        bgcolor: "#343a40",
                        color: "white",
                        "&:hover": { bgcolor: "#4a5058" },
                      }}
                    >
                      <ArticleIcon fontSize="small" />
                    </Fab>
                  </Tooltip>
                </Box>
              )}
            {showExportButton && (
              <Fab
                variant="extended"
                size="medium"
                onClick={handleExportClick}
                disabled={isDownloading}
                sx={{
                  bgcolor: "#89665d",
                  color: "white",
                  "&:hover": { bgcolor: "#6d524a" },
                  "&.Mui-disabled": { bgcolor: "rgba(137, 102, 93, 0.5)" },
                  gap: 0.5,
                  fontSize: "0.8rem",
                }}
              >
                {isDownloading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <DownloadIcon fontSize="small" />
                )}
                {isDownloading ? "Generating..." : "Export PDF"}
              </Fab>
            )}
          </Box>
        )}
        <SpeedDial
          ariaLabel="CV Controls"
          direction="up"
          icon={<SpeedDialIcon icon={<MenuIcon />} />}
          onClose={handleSpeedDialClose}
          onOpen={handleSpeedDialOpen}
          open={speedDialOpen}
          sx={{
            "& .MuiSpeedDial-fab": {
              bgcolor: "#343a40",
              "&:hover": {
                bgcolor: "#89665d",
              },
            },
          }}
        >
          {/* Print */}
          <SpeedDialAction
            icon={<PrintIcon />}
            tooltipTitle="Print"
            onClick={handlePrintClick}
          />

          {/* Private Info Toggle - only show when logged in */}
          {canShowPrivateInfo && (
            <SpeedDialAction
              icon={getPrivacyIcon()}
              tooltipTitle={getPrivacyTooltip()}
              onClick={cyclePrivacyLevel}
            />
          )}

          {/* Photo Toggle */}
          <SpeedDialAction
            icon={showPhoto ? <PersonIcon /> : <PersonOffIcon />}
            tooltipTitle={showPhoto ? "Hide Photo" : "Show Photo"}
            onClick={togglePhoto}
          />

          {/* Experience Toggle */}
          <SpeedDialAction
            icon={showExperience ? <WorkHistoryIcon /> : <WorkOffIcon />}
            tooltipTitle={
              showExperience
                ? "Hide Detailed Experience"
                : "Show Detailed Experience"
            }
            onClick={toggleExperience}
          />

          {/* Attachments Toggle */}
          <SpeedDialAction
            icon={showAttachments ? <AttachFileIcon /> : <AttachFileOffIcon />}
            tooltipTitle={
              showAttachments ? "Hide Attachments" : "Show Attachments"
            }
            onClick={toggleAttachments}
          />

          {/* Theme Toggle */}
          <SpeedDialAction
            icon={theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            tooltipTitle={theme === "dark" ? "Light Mode" : "Dark Mode"}
            onClick={toggleTheme}
          />
        </SpeedDial>
      </Box>

      {/* Export Options Dialog */}
      <ExportOptionsDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onConfirm={handleConfirmExport}
        isDownloading={isDownloading}
        headerHeight={headerHeight}
      />

      {/* Copy confirmation snackbar - shown at top to avoid floating buttons */}
      <Snackbar
        open={copySnackbarOpen}
        autoHideDuration={2000}
        onClose={() => setCopySnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={() => setCopySnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<ContentCopyIcon fontSize="small" />}
        >
          {copySnackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );

  // Render based on props
  return (
    <>
      {renderToolbarBar && toolbarBar}
      {renderFloatingElements && floatingElements}

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        currentUrl={getCurrentShareUrl()}
        cvVersionId={searchParams.get("version") || undefined}
        settings={{
          theme,
          showPhoto,
          privacyLevel,
          showExperience,
          showAttachments,
          showExport: !!externalExportPanelOpen,
        }}
      />
    </>
  );
};

export default CVToolbar;
