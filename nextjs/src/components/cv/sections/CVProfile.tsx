'use client';

import { useCVVersion } from '../contexts';
import { regenerateCVItem } from '@/services/ai/gemini.service';
import EditableText from '../components/EditableText';
import { CV_CHARACTER_LIMITS } from '@/config/cv.config';

interface CVProfileProps {
  profile: string;
}

const CVProfile = ({ profile }: CVProfileProps) => {
  const { isEditing, updateEditedContent, activeVersion, regeneratingItems, setRegeneratingItem } =
    useCVVersion();

  const handleProfileChange = (newValue: string) => {
    updateEditedContent({ profile: newValue });
  };

  const handleRegenerate = async (customInstructions?: string) => {
    const itemId = 'profile';
    if (!activeVersion?.job_context) return;

    setRegeneratingItem(itemId, true);
    try {
      const result = await regenerateCVItem({
        itemType: 'profile',
        currentValue: profile,
        context: {
          companyName: activeVersion.job_context.company,
          jobTitle: activeVersion.job_context.position,
          jobPosting: activeVersion.job_context.jobPosting,
          companyResearch: activeVersion.job_context.companyResearch,
        },
        customInstructions,
      });
      updateEditedContent({ profile: result.newValue });
    } catch (error) {
      console.error('Failed to regenerate profile:', error);
    } finally {
      setRegeneratingItem(itemId, false);
    }
  };

  const canRegenerate = isEditing && activeVersion?.job_context?.companyResearch;

  return (
    <div className="cv-section cv-profile">
      <h2>Profile</h2>
      <EditableText
        value={profile}
        onChange={handleProfileChange}
        isEditing={isEditing}
        multiline
        variant="p"
        maxLength={CV_CHARACTER_LIMITS.profile}
        onRegenerate={canRegenerate ? handleRegenerate : undefined}
        isRegenerating={regeneratingItems.has('profile')}
        showCharacterCount={isEditing}
      />
    </div>
  );
};

export default CVProfile;
