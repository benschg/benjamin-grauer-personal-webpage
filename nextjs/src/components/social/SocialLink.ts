import type { SvgIconComponent } from '@mui/icons-material';
import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material';

export interface SocialLink {
  name: string;
  url: string;
  icon: SvgIconComponent | ComponentType<SvgIconProps>;
}
