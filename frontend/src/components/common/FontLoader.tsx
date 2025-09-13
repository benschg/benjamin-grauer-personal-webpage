import { useEffect } from 'react';

interface FontLoaderProps {
  children: React.ReactNode;
}

const FontLoader: React.FC<FontLoaderProps> = ({ children }) => {
  useEffect(() => {
    // Check if fonts are already loaded (to avoid duplicates)
    if (document.querySelector('link[href*="fonts.googleapis.com"]')) {
      return;
    }

    // Create link element for Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Quicksand:wght@300;400;500;600;700&display=swap';

    // Add to document head - fonts will load asynchronously in background
    document.head.appendChild(link);

    return () => {
      // Clean up link element
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Always render children immediately - no waiting for fonts
  return <>{children}</>;
};

export default FontLoader;
