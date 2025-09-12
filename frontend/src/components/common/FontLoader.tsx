import { useEffect, useState } from 'react';
import WebFont from 'webfontloader';

interface FontLoaderProps {
  children: React.ReactNode;
}

const FontLoader: React.FC<FontLoaderProps> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          'Orbitron:400,700,900',
          'Quicksand:300,400,500,600,700'
        ]
      },
      active: () => {
        setFontsLoaded(true);
      },
      inactive: () => {
        // Show content even if fonts fail to load
        setTimeout(() => setFontsLoaded(true), 2000);
      },
      timeout: 3000
    });
  }, []);

  if (!fontsLoaded) {
    return (
      <div style={{
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
        color: '#ffffff'
      }}>
        <div style={{
          fontSize: '1.2rem',
          opacity: 0.8
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default FontLoader;