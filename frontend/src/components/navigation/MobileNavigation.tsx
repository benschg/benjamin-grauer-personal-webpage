import {
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { navigationItems } from "./NavigationLinks";
import type { NavItem } from "./NavItem";

interface MobileNavigationProps {
  open: boolean;
  onToggle: () => void;
  items?: NavItem[];
}

const MobileNavigation = ({
  open,
  onToggle,
  items = navigationItems,
}: MobileNavigationProps) => {
  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          backgroundColor: "primary.main",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "white",
            fontSize: "1rem",
          }}
        >
          Menu
        </Typography>
        <IconButton
          color="inherit"
          aria-label="close drawer"
          onClick={onToggle}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ backgroundColor: "background.paper", height: "100%" }}>
        {items.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component="a"
              href={item.href}
              onClick={onToggle}
              sx={{
                py: 2,
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
            >
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontFamily: '"Orbitron", sans-serif',
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onToggle}
      >
        <MenuIcon />
      </IconButton>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default MobileNavigation;
