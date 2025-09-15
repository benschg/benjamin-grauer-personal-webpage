import { Card, CardContent, Typography, Box, Chip, LinearProgress, Collapse } from '@mui/material';
import { getContrastColor } from '../../../utils/colorUtils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ExpandMore, Domain, Star } from '@mui/icons-material';
import { domainExpertise } from './data/domainExpertiseData';

// Import domain-specific icons from react-icons
import { GiGamepad, GiMedicalPack, GiDeliveryDrone } from 'react-icons/gi';
import { MdPrint, MdDeviceHub, MdLocalShipping } from 'react-icons/md';
import { BiCube } from 'react-icons/bi';

const getDomainIcon = (iconName?: string) => {
  const iconStyle = { fontSize: 24 };

  switch (iconName) {
    case 'game':
      return <GiGamepad style={iconStyle} />; // Game controller icon
    case 'medical':
      return <GiMedicalPack style={iconStyle} />; // Medical pack icon
    case '3d':
      return <BiCube style={iconStyle} />; // 3D cube icon
    case 'print3d':
      return <MdPrint style={iconStyle} />; // 3D printer icon
    case 'iot':
      return <MdDeviceHub style={iconStyle} />; // IoT hub icon
    case 'drone':
      return <GiDeliveryDrone style={iconStyle} />; // Drone icon
    case 'logistics':
      return <MdLocalShipping style={iconStyle} />; // Shipping/logistics icon
    default:
      return <Domain sx={{ fontSize: 24 }} />;
  }
};

const EnhancedDomainExpertiseCard = () => {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);

  const sortedDomains = [...domainExpertise].sort((a, b) => {
    // Sort by favorites first, then by proficiency
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return (b.proficiency || 0) - (a.proficiency || 0);
  });

  return (
    <Card
      sx={{
        p: 2,
        background:
          'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
        border: '2px solid rgba(137, 102, 93, 0.3)',
        height: '100%',
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontSize: '1.3rem',
            fontWeight: 700,
            mb: 3,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Domain /> Domain Expertise
        </Typography>

        {/* Domains Grid/List */}
        <Box sx={{ position: 'relative' }}>
          {sortedDomains.map((domain, index) => {
            const isExpanded = expandedDomain === domain.name;
            const isHovered = hoveredDomain === domain.name;

            return (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredDomain(domain.name)}
                onHoverEnd={() => setHoveredDomain(null)}
              >
                <Box
                  onClick={() => setExpandedDomain(isExpanded ? null : domain.name)}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      isHovered || isExpanded
                        ? 'rgba(137, 102, 93, 0.1)'
                        : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor:
                      isHovered || isExpanded ? domain.color : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: isExpanded ? '100%' : '0%',
                      height: '2px',
                      backgroundColor: domain.color,
                      transition: 'width 0.3s ease',
                    },
                  }}
                >
                  {/* Domain Header */}
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: `${domain.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: domain.color,
                          border: `2px solid ${domain.color}`,
                        }}
                      >
                        {getDomainIcon(domain.icon)}
                      </Box>

                      {/* Name and Category */}
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            {domain.name}
                          </Typography>
                          {domain.isFavorite && <Star sx={{ fontSize: 18, color: '#ffd700' }} />}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                          }}
                        >
                          {domain.category} • {domain.experience}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Proficiency & Expand */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Mini Proficiency Bar */}
                      {!isExpanded && (
                        <Box sx={{ width: 60, display: { xs: 'none', sm: 'block' } }}>
                          <LinearProgress
                            variant="determinate"
                            value={domain.proficiency || 0}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: domain.color,
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Box>
                      )}

                      <Box
                        sx={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        <ExpandMore sx={{ color: 'text.secondary' }} />
                      </Box>
                    </Box>
                  </Box>

                  {/* Expandable Content */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.9rem',
                          color: 'text.secondary',
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        {domain.description}
                      </Typography>

                      {/* Proficiency Bar (Expanded) */}
                      {domain.proficiency && (
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Expertise Level
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: domain.color, fontWeight: 600 }}
                            >
                              {domain.proficiency}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={domain.proficiency}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: domain.color,
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>
                      )}

                      {/* Key Projects */}
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            mb: 2,
                            color: 'text.primary',
                          }}
                        >
                          Key Projects & Applications:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {domain.projects.map((project) => (
                            <motion.div
                              key={project}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Chip
                                label={project}
                                size="small"
                                sx={{
                                  backgroundColor: `${domain.color}20`,
                                  color: 'text.primary',
                                  border: `1px solid ${domain.color}`,
                                  fontSize: '0.75rem',
                                  '&:hover': {
                                    backgroundColor: domain.color,
                                    color: getContrastColor(domain.color),
                                  },
                                  transition: 'all 0.3s ease',
                                }}
                              />
                            </motion.div>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              </motion.div>
            );
          })}
        </Box>

        {/* Summary Stats */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(137, 102, 93, 0.05)',
            border: '1px solid rgba(137, 102, 93, 0.2)',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
              {domainExpertise.length}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Domains
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
              15+
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Years Max
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
              {domainExpertise.filter((d) => d.isFavorite).length}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Core Areas
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedDomainExpertiseCard;
