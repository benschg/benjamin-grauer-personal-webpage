'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CodeIcon from '@mui/icons-material/Code';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FavoriteIcon from '@mui/icons-material/Favorite';

const wizardQuotes = [
  "A wizard is never late with an MVP, nor is he early. He delivers precisely when the sprint ends.",
  "You shall not pass... without proper TypeScript types!",
  "Keep it secret, keep it safe... like your API keys.",
  "All we have to decide is what to do with the bugs that are given to us.",
  "Even the smallest startup can change the course of the future.",
];

export default function BendalfTheGray() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % wizardQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Magical particles background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(137, 102, 93, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(100, 149, 237, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.1) 0%, transparent 30%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, md: 6 },
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glowing border effect */}
            <Box
              sx={{
                position: 'absolute',
                inset: -2,
                background: 'linear-gradient(45deg, #89665d, #6495ED, #FFD700, #89665d)',
                backgroundSize: '400% 400%',
                animation: 'gradient 8s ease infinite',
                borderRadius: 5,
                zIndex: -1,
                opacity: 0.5,
                '@keyframes gradient': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
              }}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: [0, -2, 2, -2, 2, 0],
                y: [0, 1, -1, 1, -1, 0],
                rotate: [0, -0.5, 0.5, -0.5, 0.5, 0],
              }}
              transition={{
                scale: { delay: 0.3, duration: 0.6 },
                opacity: { delay: 0.3, duration: 0.6 },
                x: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
                y: { repeat: Infinity, duration: 0.4, ease: 'easeInOut' },
                rotate: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 250, md: 350 },
                  height: { xs: 250, md: 350 },
                  mx: 'auto',
                  mb: 4,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 0 60px rgba(137, 102, 93, 0.5), 0 0 100px rgba(100, 149, 237, 0.3)',
                }}
              >
                <Image
                  src="/bendalf-the-gray.jpg"
                  alt="Bendalf the Gray - Benjamin Grauer as a wizard"
                  fill
                  style={{ objectFit: 'cover', transform: 'scale(1.15)' }}
                  priority
                />
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                  fontWeight: 900,
                  background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
                  mb: 1,
                }}
              >
                Bendalf the Gray
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontStyle: 'italic',
                  mb: 3,
                  fontFamily: '"Quicksand", sans-serif',
                }}
              >
                The Fullstack Wizard of Middle-Stack
              </Typography>

              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderLeft: '4px solid #FFD700',
                  minHeight: '4.5rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%' }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontStyle: 'italic',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '1.1rem',
                        minHeight: '3.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      &ldquo;{wizardQuotes[quoteIndex]}&rdquo;
                    </Typography>
                  </motion.div>
                </AnimatePresence>
              </Paper>

              {/* Special Props Section */}
              <Paper
                sx={{
                  p: 4,
                  mb: 4,
                  background: 'linear-gradient(135deg, rgba(137, 102, 93, 0.2), rgba(100, 149, 237, 0.1))',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                  <FavoriteIcon sx={{ color: '#FF6B6B' }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Orbitron", sans-serif',
                      color: '#FFD700',
                    }}
                  >
                    Special Props To
                  </Typography>
                  <FavoriteIcon sx={{ color: '#FF6B6B' }} />
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Orbitron", sans-serif',
                    color: 'white',
                    mb: 2,
                  }}
                >
                  Ábel Bodogán
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    mb: 3,
                    maxWidth: 500,
                    mx: 'auto',
                  }}
                >
                  Fellow wizard of the code realm, MVP conjurer extraordinaire, and master of TypeScript sorcery.
                  Creating webapp MVPs with the ancient arts of fullstack development.
                  A true ally in the quest for clean code and shipped products!
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 3,
                    flexWrap: 'wrap',
                    mb: 3,
                  }}
                >
                  {[
                    { icon: <CodeIcon />, label: 'TypeScript Sorcery' },
                    { icon: <RocketLaunchIcon />, label: 'MVP Conjuration' },
                    { icon: <AutoFixHighIcon />, label: 'Fullstack Wizardry' },
                  ].map((skill, index) => (
                    <motion.div
                      key={skill.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
                          px: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {skill.icon}
                        <Typography variant="body2">{skill.label}</Typography>
                      </Paper>
                    </motion.div>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<LinkedInIcon />}
                      href="https://www.linkedin.com/in/bodoganabel/"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background: 'linear-gradient(45deg, #0077B5, #00A0DC)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #005885, #0077B5)',
                        },
                      }}
                    >
                      Connect with Bodo
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<GitHubIcon />}
                      href="https://github.com/bodoganabel"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      View His GitHub
                    </Button>
                  </motion.div>
                </Box>
              </Paper>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.4)',
                }}
              >
                You have discovered a secret page! A wizard never reveals his secrets... but he does give credit where credit is due.
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
