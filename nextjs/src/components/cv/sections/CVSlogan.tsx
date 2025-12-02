'use client';

import { useCVVersion } from '../contexts';
import { regenerateCVItem } from '@/services/ai/gemini.service';
import EditableText from '../components/EditableText';
import { CV_CHARACTER_LIMITS } from '@/config/cv.config';

interface CVSloganProps {
  slogan: string;
}

const CVSlogan = ({ slogan }: CVSloganProps) => {
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
  );
};

export default CVSlogan;
