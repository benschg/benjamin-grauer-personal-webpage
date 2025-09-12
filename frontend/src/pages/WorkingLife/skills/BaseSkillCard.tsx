import { Card, CardContent, Typography, Chip, Stack } from '@mui/material';

interface BaseSkillCardProps {
  title: string;
  skills: string[];
}

const BaseSkillCard = ({ title, skills }: BaseSkillCardProps) => {
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
          {title}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {skills.map((skill, skillIndex) => (
            <Chip
              key={skillIndex}
              label={skill}
              variant="outlined"
              sx={{
                borderColor: 'primary.main',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BaseSkillCard;
