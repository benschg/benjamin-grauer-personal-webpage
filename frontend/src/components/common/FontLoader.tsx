import { useEffect, useState } from 'react';

interface FontLoaderProps {
  children: React.ReactNode;
}

const FontLoader: React.FC<FontLoaderProps> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Create font face declarations
    const orbitronFont = new FontFace(
      'Orbitron',
      'url(https://fonts.gstatic.com/s/orbitron/v31/yMJMhbBCRUi6THLM7SJWqRo.woff2)',
      { weight: '400 900', display: 'swap' }
    );

    const quicksandFont = new FontFace(
      'Quicksand',
      'url(https://fonts.gstatic.com/s/quicksand/v32/6xKtdSZaM9iE8KbpRA_hK1QNYuDyP3xM.woff2)',
      { weight: '300 700', display: 'swap' }
    );

    // Load fonts
    Promise.all([orbitronFont.load(), quicksandFont.load()])
      .then((loadedFonts) => {
        loadedFonts.forEach((font) => {
          document.fonts.add(font);
        });
        setFontsLoaded(true);
      })
      .catch(() => {
        // Fallback to system fonts if loading fails
        setFontsLoaded(true);
      });

    // Fallback timeout
    const timeout = setTimeout(() => setFontsLoaded(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  if (!fontsLoaded) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#343A40',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            fontSize: '1.2rem',
            opacity: 0.8,
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default FontLoader;
