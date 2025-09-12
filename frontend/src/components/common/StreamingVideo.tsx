import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

interface StreamingVideoProps {
  src: string;
  poster?: string;
  className?: string;
  sx?: SxProps<Theme>;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: (error: string) => void;
}

const StreamingVideo: React.FC<StreamingVideoProps> = ({
  src,
  poster,
  sx,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  onLoadStart,
  onCanPlay,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setLoading(true);
      onLoadStart?.();
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration || 1;
        setLoadProgress((bufferedEnd / duration) * 100);
      }
    };

    const handleCanPlay = () => {
      setLoading(false);
      onCanPlay?.();
    };

    const handleError = () => {
      const errorMsg = 'Video failed to load';
      setError(errorMsg);
      setLoading(false);
      onError?.(errorMsg);
    };

    const handleLoadedMetadata = () => {
      // Video metadata loaded, we can start measuring progress
      handleProgress();
    };

    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onLoadStart, onCanPlay, onError]);

  if (error) {
    return (
      <Box
        sx={{
          ...sx,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography color="error" variant="body2">
          Video unavailable
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 10,
          }}
        >
          <CircularProgress 
            size={40} 
            sx={{ color: 'white', mb: 1 }} 
            variant={loadProgress > 0 ? 'determinate' : 'indeterminate'}
            value={loadProgress}
          />
          <Typography 
            variant="caption" 
            sx={{ color: 'white', opacity: 0.8 }}
          >
            {loadProgress > 0 ? `${Math.round(loadProgress)}%` : 'Loading video...'}
          </Typography>
        </Box>
      )}

      {/* Video element */}
      <Box
        ref={videoRef}
        component="video"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload="metadata"
        poster={poster}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </Box>
    </Box>
  );
};

export default StreamingVideo;