'use client';

import { ReactNode } from 'react';
import CookieConsentBanner from './CookieConsentBanner';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      {children}
      <CookieConsentBanner />
    </>
  );
}
