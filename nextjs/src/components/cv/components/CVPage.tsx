'use client';

import { forwardRef, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

interface CVPageProps {
  children: ReactNode;
  pageNumber: number;
  totalPages: number;
  email?: string;
  phone?: string;
  linkedin?: string;
  zoom?: number; // 0 = auto (CSS media queries), > 0 = manual zoom level
}

const CVPage = forwardRef<HTMLDivElement, CVPageProps>(
  ({ children, pageNumber, totalPages, email, phone, linkedin, zoom = 0 }, ref) => {
    const hasContact = email || phone || linkedin;
    const contentRef = useRef<HTMLDivElement>(null);

    // Check if content overflows in sidebar and main content
    const checkOverflow = useCallback(() => {
      if (!contentRef.current) return;

      // Check sidebar overflow
      const sidebar = contentRef.current.querySelector('.cv-sidebar');
      if (sidebar) {
        const hasOverflow = sidebar.scrollHeight > sidebar.clientHeight;
        sidebar.classList.toggle('cv-overflow', hasOverflow);
      }

      // Check main content overflow
      const mainContent = contentRef.current.querySelector('.cv-main-content');
      if (mainContent) {
        const hasOverflow = mainContent.scrollHeight > mainContent.clientHeight;
        mainContent.classList.toggle('cv-overflow', hasOverflow);
      }
    }, []);

    // Check overflow on mount and when children change
    useEffect(() => {
      checkOverflow();
      // Also check after a short delay to account for async rendering
      const timeout = setTimeout(checkOverflow, 100);
      return () => clearTimeout(timeout);
    }, [children, checkOverflow]);

    // Check overflow on window resize
    useEffect(() => {
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }, [checkOverflow]);

    // Calculate CSS custom properties for manual zoom
    // These are used by the CSS to apply transforms with !important to override media queries
    const getZoomStyles = (): React.CSSProperties => {
      if (zoom === 0) return {}; // Auto mode - let CSS handle it

      // Calculate negative margins to compensate for scaling
      const scaleFactor = 1 - zoom;
      return {
        '--manual-zoom-transform': `scale(${zoom})`,
        '--manual-zoom-margin-bottom': `calc(-297mm * ${scaleFactor})`,
        '--manual-zoom-margin-left': `calc(-210mm * ${scaleFactor / 2})`,
        '--manual-zoom-margin-right': `calc(-210mm * ${scaleFactor / 2})`,
        transformOrigin: 'top center',
      } as React.CSSProperties;
    };

    return (
      <div
        className={`cv-page ${zoom > 0 ? 'cv-page-manual-zoom' : ''}`}
        ref={ref}
        style={getZoomStyles()}
      >
        <div className="cv-page-content" ref={contentRef}>{children}</div>
        <div className="cv-page-footer">
          <div className="cv-footer-contact">
            {email && (
              <span className="cv-footer-item">
                <EmailIcon sx={{ fontSize: 14, mr: 0.3 }} />
                {email}
              </span>
            )}
            {email && phone && <span className="cv-footer-separator">|</span>}
            {phone && (
              <span className="cv-footer-item">
                <PhoneIcon sx={{ fontSize: 14, mr: 0.3 }} />
                {phone}
              </span>
            )}
            {hasContact && linkedin && (email || phone) && (
              <span className="cv-footer-separator">|</span>
            )}
            {linkedin && (
              <span className="cv-footer-item">
                <LinkedInIcon sx={{ fontSize: 14, mr: 0.3 }} />
                {linkedin}
              </span>
            )}
          </div>
          <span className="cv-page-number">
            {pageNumber} / {totalPages}
          </span>
        </div>
      </div>
    );
  }
);

CVPage.displayName = 'CVPage';

export default CVPage;
