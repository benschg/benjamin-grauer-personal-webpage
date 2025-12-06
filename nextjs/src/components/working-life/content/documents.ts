import { ContactPage, EmojiEvents, Description } from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';

export interface Document {
  title: string;
  description: string;
  icon: SvgIconComponent;
  fileType: string;
  downloadUrl: string;
  downloadAs: string;
}

// PDF path constants for reuse
export const REFERENCES_PDF_PATH = '/working-life/documents/References_Benjamin_20251120.pdf';
export const CERTIFICATES_PDF_PATH = '/working-life/documents/Certificates.Combined_Benjamin.Grauer_20201024.pdf';
export const FULL_CV_PDF_PATH = '/working-life/documents/Benjamin_Grauer_CV_detailed_light.pdf';

export const documents: Document[] = [
  {
    title: 'References',
    description: 'Professional references and recommendations from previous employers',
    icon: ContactPage,
    fileType: 'PDF',
    downloadUrl: REFERENCES_PDF_PATH,
    downloadAs: 'Benjamin_Grauer_References.pdf',
  },
  {
    title: 'Certificates',
    description: 'Professional certifications and training certificates',
    icon: EmojiEvents,
    fileType: 'PDF',
    downloadUrl: CERTIFICATES_PDF_PATH,
    downloadAs: 'Benjamin_Grauer_Certificates.pdf',
  },
  {
    title: 'Full CV',
    description: 'Complete curriculum vitae with detailed work history (references on request)',
    icon: Description,
    fileType: 'PDF',
    downloadUrl: FULL_CV_PDF_PATH,
    downloadAs: 'Benjamin_Grauer_CV.pdf',
  },
];
