'use client';

import { Box, Link } from '@mui/material';
import type { SocialLink } from './SocialLink';

interface SocialLinksGroupProps {
  links: SocialLink[];
  showText?: boolean;
}

const SocialLinksGroup = ({ links, showText = true }: SocialLinksGroupProps) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {links.map((link, index) => {
        const IconComponent = link.icon;
        return (
          <Link
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                opacity: 0.8,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <IconComponent sx={{ fontSize: '1.2rem' }} />
            {showText && <span style={{ fontSize: '0.9rem' }}>{link.name}</span>}
          </Link>
        );
      })}
    </Box>
  );
};

export default SocialLinksGroup;
