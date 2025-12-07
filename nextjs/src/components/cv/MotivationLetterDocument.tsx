'use client';

import { forwardRef, useRef, useEffect, useCallback } from 'react';
import { useCVTheme, useCVVersion } from './contexts';
import { sharedProfile } from '@/data/shared-profile';
import type { MotivationLetter } from '@/types/database.types';
import EditableText from './components/EditableText';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import './styles/cv.css';

interface MotivationLetterDocumentProps {
  letter?: MotivationLetter;
}

const MotivationLetterDocument = forwardRef<HTMLDivElement, MotivationLetterDocumentProps>(
  ({ letter: letterProp }, ref) => {
    const { theme, zoom, privacyLevel, canShowPrivateInfo } = useCVTheme();
    const { activeContent, activeVersion, isEditing, updateEditedContent } = useCVVersion();
    const containerRef = useRef<HTMLDivElement>(null);

    const letter = letterProp || activeContent.motivationLetter;

    // Get the original letter from the version for reset comparison
    const originalLetter = activeVersion?.content?.motivationLetter;

    // Helper to update a specific letter field
    const handleLetterFieldChange = (field: keyof MotivationLetter, value: string) => {
      if (!letter) return;
      updateEditedContent({
        motivationLetter: {
          ...letter,
          [field]: value,
        },
      });
    };

    // Helper to reset a specific field to original
    const handleResetField = (field: keyof MotivationLetter) => {
      if (!letter || !originalLetter) return;
      updateEditedContent({
        motivationLetter: {
          ...letter,
          [field]: originalLetter[field],
        },
      });
    };

    // Check if a field is modified from original
    const isFieldModified = (field: keyof MotivationLetter): boolean => {
      if (!letter || !originalLetter) return false;
      return letter[field] !== originalLetter[field];
    };

    // Check if content overflows and add red border indicator to the overflowing element
    const checkOverflow = useCallback(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;

      // Check if the letter body text is overflowing
      const letterBody = container.querySelector('.motivation-letter-body');
      if (letterBody) {
        const hasOverflow = letterBody.scrollHeight > letterBody.clientHeight + 2;
        letterBody.classList.toggle('cv-overflow', hasOverflow);
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
                      {sharedProfile.website && (
                        <a
                          href={`https://${sharedProfile.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {sharedProfile.website}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="motivation-letter-date">{currentDate}</div>

              {/* Subject line */}
              <div className="motivation-letter-subject">
                <EditableText
                  value={letter.subject}
                  onChange={(value) => handleLetterFieldChange('subject', value)}
                  isEditing={isEditing}
                  variant="span"
                  placeholder="Subject line..."
                  onReset={() => handleResetField('subject')}
                  isModified={isFieldModified('subject')}
                />
              </div>

              {/* Greeting */}
              <div className="motivation-letter-greeting">
                <EditableText
                  value={letter.greeting}
                  onChange={(value) => handleLetterFieldChange('greeting', value)}
                  isEditing={isEditing}
                  variant="span"
                  placeholder="Dear..."
                  onReset={() => handleResetField('greeting')}
                  isModified={isFieldModified('greeting')}
                />
              </div>

              {/* Body */}
              <div className="motivation-letter-body">
                <div className="motivation-letter-opening">
                  <EditableText
                    value={letter.opening}
                    onChange={(value) => handleLetterFieldChange('opening', value)}
                    isEditing={isEditing}
                    multiline
                    variant="p"
                    placeholder="Opening paragraph..."
                    onReset={() => handleResetField('opening')}
                    isModified={isFieldModified('opening')}
                  />
                </div>
                <div className="motivation-letter-main-body">
                  <EditableText
                    value={letter.body}
                    onChange={(value) => handleLetterFieldChange('body', value)}
                    isEditing={isEditing}
                    multiline
                    variant="p"
                    placeholder="Main body paragraphs..."
                    onReset={() => handleResetField('body')}
                    isModified={isFieldModified('body')}
                  />
                </div>
                <div className="motivation-letter-closing-para">
                  <EditableText
                    value={letter.closing}
                    onChange={(value) => handleLetterFieldChange('closing', value)}
                    isEditing={isEditing}
                    multiline
                    variant="p"
                    placeholder="Closing paragraph..."
                    onReset={() => handleResetField('closing')}
                    isModified={isFieldModified('closing')}
                  />
                </div>
              </div>

              {/* Sign-off */}
              <div className="motivation-letter-signoff">
                <div className="motivation-letter-signoff-text">
                  <EditableText
                    value={letter.signoff}
                    onChange={(value) => handleLetterFieldChange('signoff', value)}
                    isEditing={isEditing}
                    variant="span"
                    placeholder="Best regards,"
                    onReset={() => handleResetField('signoff')}
                    isModified={isFieldModified('signoff')}
                  />
                </div>
                <div className="motivation-letter-signature">{sharedProfile.name}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="cv-footer">
            <a
              href={`https://${sharedProfile.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-footer-item"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <LinkedInIcon sx={{ fontSize: 14, mr: 0.3 }} />
              {sharedProfile.linkedin}
            </a>
            <span className="cv-footer-separator">•</span>
            <a
              href={`https://${sharedProfile.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-footer-item"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <LanguageIcon sx={{ fontSize: 14, mr: 0.3 }} />
              {sharedProfile.website}
            </a>
          </div>
        </div>
      </div>
    );
  }
);

MotivationLetterDocument.displayName = 'MotivationLetterDocument';

export default MotivationLetterDocument;
