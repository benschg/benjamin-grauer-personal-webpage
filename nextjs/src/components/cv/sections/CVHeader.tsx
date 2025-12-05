'use client';

import type { CVHeaderData } from '../types/CVTypes';
import { useCVVersion } from '../contexts';
import { regenerateCVItem } from '@/services/ai/gemini.service';
import EditableText from '../components/EditableText';
import { CV_CHARACTER_LIMITS } from '@/config/cv.config';
import { sharedProfile } from '@/data/shared-profile';

interface CVHeaderProps {
  data: CVHeaderData;
}

const CVHeader = ({ data }: CVHeaderProps) => {
  const { isEditing, updateEditedContent, activeVersion, regeneratingItems, setRegeneratingItem } =
    useCVVersion();

  const defaultTagline = sharedProfile.tagline;

  const handleTaglineChange = (newValue: string) => {
    updateEditedContent({ tagline: newValue });
  };

  const handleRegenerate = async (customInstructions?: string) => {
    const itemId = 'tagline';
    if (!activeVersion?.job_context) return;

    setRegeneratingItem(itemId, true);
    try {
      const result = await regenerateCVItem({
        itemType: 'tagline',
        currentValue: data.title,
        context: {
          companyName: activeVersion.job_context.company,
          jobTitle: activeVersion.job_context.position,
          jobPosting: activeVersion.job_context.jobPosting,
          companyResearch: activeVersion.job_context.companyResearch,
        },
        customInstructions,
      });
      updateEditedContent({ tagline: result.newValue });
    } catch (error) {
      console.error('Failed to regenerate tagline:', error);
    } finally {
      setRegeneratingItem(itemId, false);
    }
  };

  const canRegenerate = isEditing && activeVersion?.job_context?.companyResearch;

  const handleReset = () => {
    updateEditedContent({ tagline: defaultTagline });
  };

  const isModified = data.title !== defaultTagline;

  return (
    <div className="cv-section cv-header">
      <div className="cv-header-main">
        {data.photo && (
          <div className="cv-header-photo">
            <img src={data.photo} alt={data.name} />
          </div>
        )}
        <div className="cv-header-info">
          <h1>{data.name}</h1>
          <EditableText
            value={data.title}
            onChange={handleTaglineChange}
            isEditing={isEditing}
            variant="p"
            className="cv-header-title"
            maxLength={CV_CHARACTER_LIMITS.tagline}
            placeholder="Your professional tagline..."
            onRegenerate={canRegenerate ? handleRegenerate : undefined}
            isRegenerating={regeneratingItems.has('tagline')}
            onReset={handleReset}
            isModified={isModified}
          />
        </div>
      </div>
    </div>
  );
};

export default CVHeader;
