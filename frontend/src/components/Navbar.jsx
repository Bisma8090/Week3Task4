import React, { useRef, useEffect, useState } from "react";
import { 
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, 
  Typography, Box, Divider, Tooltip, useMediaQuery, 
  useTheme, IconButton 
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const DRAWER_WIDTH = 260;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Team Members", icon: <GroupIcon />, path: "/members" },
  { label: "Projects", icon: <FolderIcon />, path: "/projects" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!isMobile && drawerRef.current) {
      gsap.fromTo(
        drawerRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "expo.out" }
      );
    }
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box sx={{ 
            width: 40, height: 40, borderRadius: 2, 
            background: "linear-gradient(135deg, #4F8EF7, #7C3AED)", 
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)"
          }}>
            🚀
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.5, color: "#fff" }}>
              TeamPortal
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
              v1.0.4 Admin
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 2, my: 1 }} />

      {/* Navigation Links */}
      <List sx={{ mt: 1, flexGrow: 1, px: 1.5 }}>
        {navItems.map(({ label, icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <ListItemButton
              key={path}
              component={Link}
              to={path}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                borderRadius: "12px", mb: 1,
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                background: isActive ? "linear-gradient(90deg, rgba(79,142,247,0.15) 0%, transparent 100%)" : "transparent",
                borderLeft: isActive ? "3px solid #4F8EF7" : "3px solid transparent",
                transition: "all 0.2s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.04)" }
              }}
            >
              <ListItemIcon sx={{ color: isActive ? "#4F8EF7" : "inherit", minWidth: 40 }}>
                {icon}
              </ListItemIcon>
              <ListItemText 
                primary={label} 
                primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: isActive ? 600 : 400 }} 
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Logout Action */}
      <Box sx={{ p: 2 }}>
        <ListItemButton 
          onClick={handleLogout} 
          sx={{ 
            borderRadius: "12px", 
            color: "#F87171",
            "&:hover": { bgcolor: "rgba(248, 113, 113, 0.08)" } 
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );
return (
    <>
      {/* Mobile Menu Button - Sirf mobile par nazar aayega */}
      {isMobile && (
        <IconButton 
          onClick={() => setMobileOpen(true)}
          sx={{ 
            position: 'fixed', top: 15, left: 15, zIndex: 1100, // Z-index handling
            bgcolor: "rgba(79,142,247,0.1)", color: "#4F8EF7",
            backdropFilter: "blur(10px)", border: "1px solid rgba(79,142,247,0.2)"
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            background: "#0F1117",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            // Mobile par drawer shadow alag hogi
            boxShadow: isMobile ? "20px 0 50px rgba(0,0,0,0.8)" : "none" 
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;