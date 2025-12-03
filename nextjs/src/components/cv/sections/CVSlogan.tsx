'use client';

import { useCVVersion } from '../contexts';
import { regenerateCVItem } from '@/services/ai/gemini.service';
import EditableText from '../components/EditableText';
import { CV_CHARACTER_LIMITS } from '@/config/cv.config';
import LanguageIcon from '@mui/icons-material/Language';

interface CVSloganProps {
  slogan: string;
  website?: string;
}

const CVSlogan = ({ slogan, website }: CVSloganProps) => {
  const { isEditing, updateEditedContent, activeVersion, regeneratingItems, setRegeneratingItem } =
    useCVVersion();

  const handleSloganChange = (newValue: string) => {
    updateEditedContent({ slogan: newValue });
  };

  const handleRegenerate = async (customInstructions?: string) => {
    const itemId = 'slogan';
    if (!activeVersion?.job_context) return;

    setRegeneratingItem(itemId, true);
    try {
      const result = await regenerateCVItem({
        itemType: 'slogan',
        currentValue: slogan,
        context: {
          companyName: activeVersion.job_context.company,
          jobTitle: activeVersion.job_context.position,
          jobPosting: activeVersion.job_context.jobPosting,
          companyResearch: activeVersion.job_context.companyResearch,
        },
        customInstructions,
      });
      updateEditedContent({ slogan: result.newValue });
    } catch (error) {
      console.error('Failed to regenerate slogan:', error);
    } finally {
      setRegeneratingItem(itemId, false);
    }
  };

  const canRegenerate = isEditing && activeVersion?.job_context?.companyResearch;

  return (
    <>
      <div className="cv-section cv-slogan">
        <EditableText
          value={slogan}
          onChange={handleSloganChange}
          isEditing={isEditing}
          variant="p"
          className="cv-slogan-text"
          maxLength={CV_CHARACTER_LIMITS.slogan}
          placeholder="Your slogan..."
          onRegenerate={canRegenerate ? handleRegenerate : undefined}
          isRegenerating={regeneratingItems.has('slogan')}
        />
      </div>
      {website && (
        <div className="cv-section cv-website-mention">
          <p style={{ fontSize: '0.85rem', color: 'var(--cv-text-muted)', margin: 0 }}>
            <LanguageIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--cv-accent)', textDecoration: 'none' }}
            >
              {website}
            </a>
          </p>
        </div>
      )}
    </>
  );
};

export default CVSlogan;
