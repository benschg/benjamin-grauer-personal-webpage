import { Box, Button } from "@mui/material";
import { navigationItems } from "./NavigationLinks";
import type { NavItem } from "./NavItem";

interface DesktopNavigationProps {
  items?: NavItem[];
}

const DesktopNavigation = ({
  items = navigationItems,
}: DesktopNavigationProps) => {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {items.map((item) => (
        <Button
          key={item.text}
          color="inherit"
          href={item.href}
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontSize: "0.9rem",
          }}
        >
          {item.text}
        </Button>
      ))}
    </Box>
  );
};

export default DesktopNavigation;
