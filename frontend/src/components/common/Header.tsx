import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'

const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Benjamin Grauer
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            href="/personal-life"
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '0.9rem',
            }}
          >
            Personal Life
          </Button>
          <Button
            color="inherit"
            href="/working-life"
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '0.9rem',
            }}
          >
            Working Life
          </Button>
          <Button
            color="inherit"
            href="/portfolio"
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '0.9rem',
            }}
          >
            Portfolio
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header