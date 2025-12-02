'use client';

import { useCVVersion } from '../contexts';
import EditableText from '../components/EditableText';

interface CVSloganProps {
  slogan: string;
}

const CVSlogan = ({ slogan }: CVSloganProps) => {
  const { isEditing, updateEditedContent } = useCVVersion();

  const handleSloganChange = (newValue: string) => {
    updateEditedContent({ slogan: newValue });
  };

  return (
    <div className="cv-section cv-slogan">
      <EditableText
        value={slogan}
        onChange={handleSloganChange}
        isEditing={isEditing}
        variant="p"
        className="cv-slogan-text"
        maxLength={50}
        placeholder="Your slogan..."
      />
    </div>
  );
};

export default CVSlogan;
