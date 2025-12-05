'use client';

import { forwardRef, useRef, useEffect, useCallback } from 'react';
import { useCVTheme, useCVVersion } from './contexts';
import { sharedProfile } from '@/data/shared-profile';
import type { MotivationLetter } from '@/types/database.types';
import './styles/cv.css';

interface MotivationLetterDocumentProps {
  letter?: MotivationLetter;
}

const MotivationLetterDocument = forwardRef<HTMLDivElement, MotivationLetterDocumentProps>(
  ({ letter: letterProp }, ref) => {
    const { theme, zoom, privacyLevel, canShowPrivateInfo } = useCVTheme();
    const { activeContent } = useCVVersion();
    const containerRef = useRef<HTMLDivElement>(null);

    const letter = letterProp || activeContent.motivationLetter;

    // Check if content overflows and add red border indicator
    const checkOverflow = useCallback(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;

      // Check if the letter body text is overflowing
      const letterBody = container.querySelector('.motivation-letter-body');
      if (letterBody) {
        const hasOverflow = letterBody.scrollHeight > letterBody.clientHeight + 2;
        container.classList.toggle('cv-overflow', hasOverflow);
      }
    }, []);

    // Check overflow on mount and when letter changes
    useEffect(() => {
      checkOverflow();
      // Also check after delays to account for async rendering
      const timeout1 = setTimeout(checkOverflow, 100);
      const timeout2 = setTimeout(checkOverflow, 500);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }, [letter, checkOverflow]);

    // Check overflow on window resize
    useEffect(() => {
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }, [checkOverflow]);

    if (!letter) {
      return null;
    }

    // Enforce privacy: only show private info if user is logged in
    const effectivePrivacyLevel = canShowPrivateInfo ? privacyLevel : 'none';
    const showPersonalInfo = effectivePrivacyLevel !== 'none';

    // Format body paragraphs - split on double newlines
    const bodyParagraphs = letter.body
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Calculate zoom transform
    const zoomStyle =
      zoom === 0
        ? {}
        : {
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          };

    return (
      <div className="cv-document-wrapper" ref={ref} data-theme={theme}>
        <div className="cv-page motivation-letter-page" style={zoomStyle}>
          <div className="motivation-letter-container" ref={containerRef}>
            <div className="motivation-letter-content">
              {/* Header with name and contact info */}
              <div className="motivation-letter-header">
                <div className="motivation-letter-header-row">
                  <div className="motivation-letter-candidate-name">{sharedProfile.name}</div>
                  {showPersonalInfo && (
                    <div className="motivation-letter-contact">
                      {sharedProfile.email && <span>{sharedProfile.email}</span>}
                      {sharedProfile.phone && <span>{sharedProfile.phone}</span>}
                      {sharedProfile.location && <span>{sharedProfile.location}</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="motivation-letter-date">{currentDate}</div>

              {/* Subject line */}
              <div className="motivation-letter-subject">{letter.subject}</div>

              {/* Greeting */}
              <div className="motivation-letter-greeting">{letter.greeting}</div>

              {/* Body */}
              <div className="motivation-letter-body">
                <p>{letter.opening}</p>
                {bodyParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <p>{letter.closing}</p>
              </div>

              {/* Sign-off */}
              <div className="motivation-letter-signoff">
                <div className="motivation-letter-signoff-text">{letter.signoff}</div>
                <div className="motivation-letter-signature">{sharedProfile.name}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="cv-footer">
            <span>{sharedProfile.linkedin}</span>
            <span className="cv-footer-separator">•</span>
            <span>{sharedProfile.website}</span>
          </div>
        </div>
      </div>
    );
  }
);

MotivationLetterDocument.displayName = 'MotivationLetterDocument';

export default MotivationLetterDocument;
