'use client';

import { Card, CardContent, Typography, Box, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { FormatQuote, LinkedIn } from '@mui/icons-material';
import type { Recommendation } from './content';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

const RecommendationCard = ({ recommendation, index }: RecommendationCardProps) => {
  const {
    recommenderName,
    recommenderTitle,
    recommenderCompany,
    relationship,
    recommendationText,
    highlightText,
    date,
    linkedInUrl,
    avatar,
  } = recommendation;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <Card
        sx={{
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          mt: 3,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: (theme) => theme.shadows[12],
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            left: 20,
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <FormatQuote sx={{ color: 'white', fontSize: 16 }} />
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            pt: 3,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 24px)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 2,
              lineHeight: 1.4,
              fontSize: '1.1rem',
            }}
          >
            &quot;{highlightText}&quot;
          </Typography>

          <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.6,
                fontStyle: 'italic',
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              &quot;{recommendationText}&quot;
            </Typography>
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={avatar}
                sx={{
                  width: 48,
                  height: 48,
                  mr: 2,
                  backgroundColor: 'primary.main',
                }}
              >
                {recommenderName.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {recommenderName}
                  </Typography>
                  {linkedInUrl && (
                    <Box
                      component="a"
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#0077B5',
                        '&:hover': { color: '#005885' },
                      }}
                    >
                      <LinkedIn sx={{ fontSize: 16 }} />
                    </Box>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {recommenderTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {recommenderCompany}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Chip
                label={relationship}
                size="small"
                sx={{
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  fontSize: '0.75rem',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {date}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;
