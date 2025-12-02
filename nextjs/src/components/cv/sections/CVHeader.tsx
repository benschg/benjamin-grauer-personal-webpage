'use client';

import type { CVHeaderData } from '../types/CVTypes';
import LanguageIcon from '@mui/icons-material/Language';
import { useCVVersion } from '../contexts';
import EditableText from '../components/EditableText';
import { CV_CHARACTER_LIMITS } from '@/config/cv.config';

interface CVHeaderProps {
  data: CVHeaderData;
}

const CVHeader = ({ data }: CVHeaderProps) => {
  const { isEditing, updateEditedContent } = useCVVersion();

  const handleTaglineChange = (newValue: string) => {
    updateEditedContent({ tagline: newValue });
  };

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
          />
          {data.website && (
            <div className="cv-header-contact">
              <span className="cv-header-contact-item">
                <LanguageIcon sx={{ fontSize: 16 }} />
                <a href={`https://${data.website}`} target="_blank" rel="noopener noreferrer">
                  {data.website}
                </a>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVHeader;
