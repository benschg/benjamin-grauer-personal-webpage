import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { DesktopNavigation, MobileNavigation } from '../navigation'

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
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
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Benjamin Grauer
          </Typography>

          {/* Desktop Menu */}
          {!isMobile && <DesktopNavigation />}

          {/* Mobile Menu */}
          {isMobile && (
            <MobileNavigation
              open={mobileOpen}
              onToggle={handleDrawerToggle}
            />
          )}
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header