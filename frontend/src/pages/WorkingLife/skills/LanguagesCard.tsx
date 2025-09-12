import { Card, CardContent, Typography, Chip, Stack, Box } from '@mui/material';
import * as Flags from 'country-flag-icons/react/3x2';
import { languages } from './data/languagesData';

interface LanguagesCardProps {
  monochrome?: boolean;
}

const LanguagesCard = ({ monochrome = false }: LanguagesCardProps) => {
  const getFlagComponent = (countryCode: string) => {
    const FlagComponent = Flags[countryCode as keyof typeof Flags];
    return FlagComponent;
  };

  const baseFlagStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '2px',
  };

  return (
    <Card
      sx={{
        height: '100%',
        p: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 600,
            mb: 2,
            color: 'primary.main',
          }}
        >
          Languages
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {languages.map((language, index) => {
            const FlagComponent = getFlagComponent(language.countryCode);
            return (
              <Chip
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {FlagComponent && (
                      <Box
                        sx={{
                          width: 20,
                          height: 15,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <FlagComponent style={baseFlagStyle} />
                      </Box>
                    )}
                    <span>
                      {language.name} ({language.level})
                    </span>
                  </Box>
                }
                variant="outlined"
                sx={{
                  borderColor: 'primary.main',
                  color: 'text.primary',
                  '& svg': {
                    filter: monochrome ? 'grayscale(100%) contrast(120%) brightness(0.8)' : 'none',
                    transition: 'filter 0.3s ease',
                  },
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& svg': {
                      filter: 'none',
                    },
                  },
                  transition: 'all 0.3s ease',
                  py: 1,
                }}
              />
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LanguagesCard;
