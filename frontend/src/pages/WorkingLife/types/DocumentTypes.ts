import type { SvgIconProps } from '@mui/material/SvgIcon';

export interface Document {
  title: string;
  description: string;
  icon: React.ComponentType<SvgIconProps>;
  downloadUrl: string;
  downloadAs: string;
  fileType: string;
}
