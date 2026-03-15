import React, { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, CircularProgress, Divider } from "@mui/material"; 
import Grid from "@mui/material/Grid"; 
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

import FolderIcon from "@mui/icons-material/Folder";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const STAT_CONFIGS = [
  { title: "Total Projects", icon: <FolderIcon sx={{ fontSize: 32 }} />, color: "#4F8EF7", glow: "rgba(79,142,247,0.3)", bg: "rgba(79,142,247,0.1)", key: "total", path: "/projects" },
  { title: "Team Members", icon: <GroupIcon sx={{ fontSize: 32 }} />, color: "#A78BFA", glow: "rgba(167,139,250,0.3)", bg: "rgba(167,139,250,0.1)", key: "members", path: "/members" },
  { title: "Active Projects", icon: <AutorenewIcon sx={{ fontSize: 32 }} />, color: "#34D399", glow: "rgba(52,211,153,0.3)", bg: "rgba(52,211,153,0.1)", key: "active", path: "/projects" },
  { title: "Completed", icon: <CheckCircleIcon sx={{ fontSize: 32 }} />, color: "#FBBF24", glow: "rgba(251,191,36,0.3)", bg: "rgba(251,191,36,0.1)", key: "completed", path: "/projects" },
];

const animateCount = (el, target) => {
  if (!el) return;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = Math.round(obj.val);
    },
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const badgeRef = useRef(null);
  const countRefs = useRef([]);

  const [stats, setStats] = useState({ total: 0, members: 0, active: 0, completed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, membersRes] = await Promise.all([
          api.get("/projects"),
          api.get("/members"),
        ]);
        const projects = projectsRes.data;
        const members = membersRes.data;
        setStats({
          total: projects.length,
          members: members.length,
          active: projects.filter((p) => p.status === "Active").length,
          completed: projects.filter((p) => p.status === "Completed").length,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(badgeRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 })
      .fromTo(titleRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
      .fromTo(subtitleRef.current, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
  }, []);

  useEffect(() => {
    const validCards = cardsRef.current.filter(el => el !== null);
    if (validCards.length > 0) {
      gsap.fromTo(validCards,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6, ease: "power2.out" }
      );
    }

    const values = [stats.total, stats.members, stats.active, stats.completed];
    countRefs.current.forEach((el, i) => {
      if (el) animateCount(el, values[i]);
    });
  }, [stats]);

  const handleNavigation = (key, path) => {
    if (key === "active") {
      navigate(path, { state: { statusFilter: "Active" } });
    } else if (key === "completed") {
      navigate(path, { state: { statusFilter: "Completed" } });
    } else {
      navigate(path);
    }
  };

  return (
    <Box display="flex" sx={{ minHeight: "100vh", bgcolor: "#0F1117" }}>
      <Navbar />
      <Box sx={{ marginLeft: { xs: 0, md: "250px" }, flexGrow: 1, p: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 4, p: 5, borderRadius: 4, background: "linear-gradient(135deg, #1A1D2E 0%, #12152A 100%)", border: "1px solid rgba(79,142,247,0.15)", position: "relative", overflow: "hidden" }}>
          <Box ref={badgeRef} display="inline-flex" alignItems="center" gap={0.8} sx={{ mb: 2, px: 2, py: 0.6, borderRadius: 10, background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)" }}>
            <TrendingUpIcon sx={{ fontSize: 14, color: "#4F8EF7" }} />
            <Typography variant="caption" sx={{ color: "#4F8EF7", fontWeight: 600 }}>Overview Dashboard</Typography>
          </Box>
          <Typography ref={titleRef} variant="h3" fontWeight={700} color="#fff" sx={{ mb: 1, fontSize: { xs: "2rem", md: "3rem" } }}>Welcome back to Portal</Typography>
          <Typography ref={subtitleRef} variant="body1" color="rgba(255,255,255,0.6)" sx={{ maxWidth: 480 }}>Here's a snapshot of your team's progress. Stay on top of your projects.</Typography>
        </Box>

       <Grid container spacing={3}>
  {STAT_CONFIGS.map(({ title, icon, color, glow, bg, key, path }, index) => (
    <Grid 
      item             // 1. Purane Grid mein 'item' likhna zaroori hai
      key={key} 
      xs={12}          // 2. 'size' ki jagah direct props use karein
      sm={6} 
      md={3} 
      ref={(el) => (cardsRef.current[index] = el)}
    >
      <Paper 
        elevation={0} 
        onClick={() => handleNavigation(key, path)}
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          background: "#1A1D2E", 
          border: "1px solid rgba(255,255,255,0.06)", 
          minHeight: 180, 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between", 
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": { transform: "translateY(-6px)", boxShadow: `0 16px 40px ${glow}` } 
        }}
      >
        {/* ... baqi code same rahega ... */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255,255,255,0.5)" fontWeight={500}>{title}</Typography>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</Box>
        </Box>
        <Typography variant="h2" fontWeight={700} sx={{ color, mt: 2 }} ref={(el) => (countRefs.current[index] = el)}>0</Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.4)" sx={{ mt: 1 }}>
          {key === "members" ? "people in team" : key === "active" ? "currently running" : key === "completed" ? "successfully finished" : "all time"}
        </Typography>
      </Paper>
    </Grid>
  ))}
</Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;