import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

interface CVPageProps {
  children: ReactNode;
  pageNumber: number;
  totalPages: number;
  email?: string;
  phone?: string;
  linkedin?: string;
}

const CVPage = forwardRef<HTMLDivElement, CVPageProps>(
  ({ children, pageNumber, totalPages, email, phone, linkedin }, ref) => {
    const hasContact = email || phone || linkedin;
    return (
      <div className="cv-page" ref={ref}>
        <div className="cv-page-content">{children}</div>
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
