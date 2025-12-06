"use client";

import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((window.scrollY / documentHeight) * 100, 100);
      setScrollProgress(progress);

      let currentActiveId = "";

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element) {
          const elementTop = element.offsetTop;

          if (scrollPosition >= elementTop) {
            currentActiveId = item.id;
          }
        }
      }

      setActiveId(currentActiveId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 150);
    setHoverTimeout(timeout);
  };

  return (
    <Box
      data-testid="toc-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "fixed",
        top: "50%",
        right: 0,
        transform: "translateY(-50%)",
        zIndex: 1000,
        width: isHovered ? "240px" : "8px",
        height: `${items.length * 34 + 120}px`,
        transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Collapsed state - thin progress bar */}
      <Box
        data-testid="toc-collapsed"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          opacity: isHovered ? 0 : 1,
          width: 8,
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "4px 0 0 4px",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          pointerEvents: isHovered ? "none" : "auto",
        }}
      >
        {/* Progress indicator */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${scrollProgress}%`,
            backgroundColor: "#89665d",
            borderRadius: "3px 0 0 3px",
            transition: "height 0.1s ease-out",
            boxShadow: "inset 0 0 4px rgba(255, 255, 255, 0.3)",
          }}
        />

        {/* Section dots */}
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              position: "absolute",
              top: `${(index / (items.length - 1)) * 100}%`,
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: activeId === item.id ? 12 : 6,
              height: activeId === item.id ? 12 : 6,
              backgroundColor:
                activeId === item.id ? "#fff" : "rgba(255, 255, 255, 0.7)",
              borderRadius: "50%",
              transition: "all 0.3s ease",
              boxShadow:
                activeId === item.id
                  ? "0 0 8px rgba(137, 102, 93, 0.8)"
                  : "0 0 3px rgba(0, 0, 0, 0.3)",
              border:
                activeId === item.id
                  ? "2px solid #89665d"
                  : "1px solid rgba(137, 102, 93, 0.5)",
            }}
          />
        ))}
      </Box>

      {/* Expanded state - full TOC */}
      <Paper
        data-testid="toc-expanded"
        elevation={6}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: isHovered ? 1 : 0,
          width: "100%",
          height: "100%",
          overflowY: "hidden",
          overflowX: "hidden",
          p: 2,
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(137, 102, 93, 0.2)",
          borderRadius: "12px 0 0 12px",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
          pointerEvents: isHovered ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "#333",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          Contents
        </Typography>
        <List
          dense
          sx={{
            flex: 1,
            py: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {items.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => scrollToSection(item.id)}
                selected={activeId === item.id}
                sx={{
                  pl: item.level * 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  "&.Mui-selected": {
                    backgroundColor: "rgba(137, 102, 93, 0.15)",
                    "&:hover": {
                      backgroundColor: "rgba(137, 102, 93, 0.25)",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(137, 102, 93, 0.08)",
                  },
                }}
              >
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "0.85rem",
                    fontWeight: activeId === item.id ? 600 : 400,
                    color: activeId === item.id ? "#89665d" : "#666",
                    noWrap: true,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TableOfContents;
