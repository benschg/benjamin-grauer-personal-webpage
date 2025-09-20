import { useState, type JSX } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Backdrop,
} from '@mui/material';
import {
  Close,
  NavigateBefore,
  NavigateNext,
  Palette,
  Brush,
  Category,
  Star,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { artworkGallery, getArtworkCategories, filterArtwork } from '../data/artworkData';

const categoryIcons: Record<string, JSX.Element> = {
  Painting: <Palette sx={{ fontSize: 16 }} />,
  'Digital Art': <Brush sx={{ fontSize: 16 }} />,
  Crafts: <Category sx={{ fontSize: 16 }} />,
  'Mixed Media': <Brush sx={{ fontSize: 16 }} />,
  Abstract: <Palette sx={{ fontSize: 16 }} />,
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Painting: '#E91E63',
    'Digital Art': '#2196F3',
    Crafts: '#4CAF50',
    'Mixed Media': '#FF9800',
    Abstract: '#9C27B0',
  };
  return colors[category] || '#89665d';
};

interface ArtworkGalleryProps {
  showFilters?: boolean;
}

const ArtworkGallery = ({ showFilters = true }: ArtworkGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const categories = ['All', ...getArtworkCategories()];

  // Filter artworks
  let filteredArtworks =
    selectedCategory === 'All' ? artworkGallery : filterArtwork(artworkGallery, selectedCategory);

  if (showFeaturedOnly) {
    filteredArtworks = filteredArtworks.filter((artwork) => artwork.featured);
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredArtworks.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredArtworks.length) % filteredArtworks.length);
  };

  const currentArtwork = filteredArtworks[currentImageIndex];

  return (
    <Box>
      {/* Filters */}
      {showFilters && (
        <Box sx={{ mb: 4 }}>
          {/* Category Filter */}
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((category) => (
              <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip
                  label={category}
                  icon={
                    category !== 'All' ? categoryIcons[category] : <Star sx={{ fontSize: 16 }} />
                  }
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                  sx={{
                    borderColor: category === 'All' ? 'primary.main' : getCategoryColor(category),
                    backgroundColor:
                      selectedCategory === category
                        ? category === 'All'
                          ? 'primary.main'
                          : getCategoryColor(category)
                        : 'transparent',
                    color: selectedCategory === category ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor:
                        selectedCategory === category
                          ? category === 'All'
                            ? 'primary.main'
                            : getCategoryColor(category)
                          : category === 'All'
                            ? 'rgba(137, 102, 93, 0.2)'
                            : `${getCategoryColor(category)}20`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                />
              </motion.div>
            ))}
          </Box>

          {/* Featured Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
            <Chip
              label="Featured Only"
              icon={<Star sx={{ fontSize: 16 }} />}
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              variant={showFeaturedOnly ? 'filled' : 'outlined'}
              sx={{
                borderColor: '#ffd700',
                backgroundColor: showFeaturedOnly ? '#ffd700' : 'transparent',
                color: showFeaturedOnly ? '#343A40' : 'text.primary',
                '&:hover': {
                  backgroundColor: showFeaturedOnly ? '#ffd700' : 'rgba(255, 215, 0, 0.2)',
                },
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Gallery Grid */}
      <Grid container spacing={2}>
        {filteredArtworks.map((artwork, index) => (
          <Grid key={artwork.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => openLightbox(index)}
              style={{ cursor: 'pointer' }}
            >
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  border: '1px solid rgba(137, 102, 93, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: getCategoryColor(artwork.category),
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  },
                }}
              >
                {/* Featured Badge */}
                {artwork.featured && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: '#ffd700',
                      borderRadius: '50%',
                      p: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    <Star sx={{ fontSize: 16, color: '#343A40' }} />
                  </Box>
                )}

                {/* Image */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(/portfolio/arts-and-crafts/${artwork.filename})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      p: 2,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '.MuiCard-root:hover &': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'white',
                        mb: 0.5,
                      }}
                    >
                      {artwork.title}
                    </Typography>
                    <Chip
                      label={artwork.category}
                      size="small"
                      icon={categoryIcons[artwork.category]}
                      sx={{
                        backgroundColor: `${getCategoryColor(artwork.category)}20`,
                        color: getCategoryColor(artwork.category),
                        border: `1px solid ${getCategoryColor(artwork.category)}`,
                        fontSize: '0.7rem',
                        height: 20,
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxOpen}
        onClose={closeLightbox}
        maxWidth={false}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          },
        }}
        components={{ Backdrop }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
        }}
      >
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <AnimatePresence mode="wait">
            {currentArtwork && (
              <motion.div
                key={currentArtwork.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Close Button */}
                  <IconButton
                    onClick={closeLightbox}
                    sx={{
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                      },
                      zIndex: 1,
                    }}
                  >
                    <Close />
                  </IconButton>

                  {/* Navigation Buttons */}
                  {filteredArtworks.length > 1 && (
                    <>
                      <IconButton
                        onClick={prevImage}
                        sx={{
                          position: 'absolute',
                          left: -60,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'white',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                          },
                        }}
                      >
                        <NavigateBefore />
                      </IconButton>
                      <IconButton
                        onClick={nextImage}
                        sx={{
                          position: 'absolute',
                          right: -60,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'white',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                          },
                        }}
                      >
                        <NavigateNext />
                      </IconButton>
                    </>
                  )}

                  {/* Image */}
                  <Box
                    component="img"
                    src={`/portfolio/arts-and-crafts/${currentArtwork.filename}`}
                    alt={currentArtwork.title}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '80vh',
                      objectFit: 'contain',
                      borderRadius: 1,
                    }}
                  />

                  {/* Image Info */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: 'rgba(52, 58, 64, 0.9)',
                      borderRadius: 1,
                      minWidth: 300,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {currentArtwork.title}
                    </Typography>
                    {currentArtwork.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
                          mb: 2,
                        }}
                      >
                        {currentArtwork.description}
                      </Typography>
                    )}
                    <Box
                      sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                      <Chip
                        label={currentArtwork.category}
                        icon={categoryIcons[currentArtwork.category]}
                        size="small"
                        sx={{
                          backgroundColor: `${getCategoryColor(currentArtwork.category)}20`,
                          color: getCategoryColor(currentArtwork.category),
                          border: `1px solid ${getCategoryColor(currentArtwork.category)}`,
                        }}
                      />
                      {currentArtwork.medium && (
                        <Chip
                          label={currentArtwork.medium}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                          }}
                        />
                      )}
                      {currentArtwork.year && (
                        <Chip
                          label={currentArtwork.year}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ArtworkGallery;
