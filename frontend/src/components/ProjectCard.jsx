import React, { useEffect, useRef } from "react";
import {
  Card, CardContent, Typography,
  Chip, Box, IconButton, Tooltip,
  AvatarGroup, Avatar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CodeIcon from "@mui/icons-material/Code";
import GroupIcon from "@mui/icons-material/Group";
import { gsap } from "gsap";

// ✅ Status color helper
const getStatusColor = (status) => {
  switch (status) {
    case "Active":    return "success";
    case "Completed": return "primary";
    default:          return "default";
  }
};

// ✅ Avatar initials helper
const getInitials = (name) =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    // ✅ fromTo — no flicker
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  // ✅ Hover animations
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.02,
      boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
      duration: 0.3,
      ease: "power1.out",
    });
  };

  return (
    <Card
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ mb: 2, borderRadius: 3, cursor: "pointer" }}
    >
      <CardContent>

        {/* ✅ Header row — title + status + actions */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {project.title}
            </Typography>
            {/* ✅ Description */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {project.description || "No description provided"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            {/* ✅ Colored status chip */}
            <Chip
              label={project.status}
              size="small"
              color={getStatusColor(project.status)}
            />
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit(project)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => onDelete(project._id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={0.5} sx={{ mt: 1.5 }}>
  {project.techStack?.split(",").map((tech, index) => (
    <Chip 
      key={index} 
      label={tech.trim()} 
      size="small" 
      sx={{ fontSize: '10px', height: 20, bgcolor: 'rgba(255,255,255,0.05)' }} 
    />
  ))}
</Box>

        {/* ✅ Team members as Avatar group */}
        {project.teamMembers?.length > 0 && (
          <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1.5 }}>
            <GroupIcon fontSize="small" color="action" />
            <AvatarGroup max={4}>
              {project.teamMembers.map((m) => (
                <Tooltip title={m.name} key={m._id}>
                  <Avatar
                    sx={{ width: 28, height: 28, fontSize: 12, bgcolor: "primary.main" }}
                  >
                    {getInitials(m.name)}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        )}

      </CardContent>
    </Card>
  );
};

export default ProjectCard;