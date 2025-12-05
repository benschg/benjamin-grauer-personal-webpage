'use client';

import { forwardRef, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

interface CVPageProps {
  children: ReactNode;
  pageNumber: number;
  totalPages: number;
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  zoom?: number; // 0 = auto (CSS media queries), > 0 = manual zoom level
}

const CVPage = forwardRef<HTMLDivElement, CVPageProps>(
  ({ children, pageNumber, totalPages, email, phone, linkedin, website, zoom = 0 }, ref) => {
    const hasContact = email || phone || linkedin || website;
    const contentRef = useRef<HTMLDivElement>(null);

    // Check if content overflows in sidebar, main content, and specific sections
    const checkOverflow = useCallback(() => {
      if (!contentRef.current) return;

      const pageContent = contentRef.current;

      // Check sidebar overflow
      const sidebar = pageContent.querySelector('.cv-sidebar');
      if (sidebar) {
        const hasOverflow = sidebar.scrollHeight > sidebar.clientHeight;
        sidebar.classList.toggle('cv-overflow', hasOverflow);
      }

      // Check main content overflow (works for both regular and full-width pages)
      const mainContent = pageContent.querySelector('.cv-main-content');
      if (mainContent) {
        const mainContentEl = mainContent as HTMLElement;

        // Compare scrollHeight to clientHeight - now works for full-width pages too
        // since we added explicit height constraints in CSS
        const mainContentOverflows = mainContentEl.scrollHeight > mainContentEl.clientHeight + 2;
        mainContent.classList.toggle('cv-overflow', mainContentOverflows);

        // Check each section - mark as overflowing if main content is clipped
        const sections = mainContent.querySelectorAll('.cv-section');

        sections.forEach((section, index) => {
          // Mark section as overflowing if main content is clipped and this is the last section
          const isLastSection = index === sections.length - 1;
          const sectionOverflows = mainContentOverflows && isLastSection;

          section.classList.toggle('cv-overflow', sectionOverflows);
        });
      }
    }, []);

    // Check overflow on mount and when children change
    useEffect(() => {
      checkOverflow();
      // Also check after delays to account for async rendering and CSS transforms
      const timeout1 = setTimeout(checkOverflow, 100);
      const timeout2 = setTimeout(checkOverflow, 500);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
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
            {linkedin && website && <span className="cv-footer-separator">|</span>}
            {website && (
              <span className="cv-footer-item">
                <LanguageIcon sx={{ fontSize: 14, mr: 0.3 }} />
                {website}
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
