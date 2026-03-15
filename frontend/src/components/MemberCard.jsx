import React, { useEffect, useRef } from "react";
import {
  Card, CardContent, Typography,
  IconButton, Tooltip, Chip, Avatar, Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { gsap } from "gsap";

const MemberCard = ({ member, onEdit, onDelete }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    // ✅ fromTo is reliable, no flicker
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

  // ✅ Generate avatar initials
  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

  return (
    <Card
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        mb: 2,
        borderRadius: 3,
        cursor: "pointer",
        transition: "box-shadow 0.3s",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">

          {/* ✅ Avatar + Info */}
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {getInitials(member.name)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {member.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {member.email}
              </Typography>
            </Box>
          </Box>

          {/* ✅ Actions */}
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={member.role || "Member"}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit(member)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(member._id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

        </Box>
      </CardContent>
    </Card>
  );
};

export default MemberCard;