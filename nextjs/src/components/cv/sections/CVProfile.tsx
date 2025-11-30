'use client';

import { useCVVersion } from '../contexts';
import EditableText from '../components/EditableText';

interface CVProfileProps {
  profile: string;
}

const CVProfile = ({ profile }: CVProfileProps) => {
  const { isEditing, updateEditedContent } = useCVVersion();

  const handleProfileChange = (newValue: string) => {
    updateEditedContent({ profile: newValue });
  };

  return (
    <div className="cv-section cv-profile">
      <h2>Profile</h2>
      <EditableText
        value={profile}
        onChange={handleProfileChange}
        isEditing={isEditing}
        multiline
        variant="p"
      />
    </div>
  );
};

export default CVProfile;
