import React, { useEffect, useState, useRef } from "react";
import {
  Box, Typography, CircularProgress,
  Button, Alert, Snackbar
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { gsap } from "gsap";
import MemberCard from "../components/MemberCard";
import AddMemberDialog from "../components/AddMemberDialog";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Members = () => {
  const [members,    setMembers]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);

  // ✅ GSAP success notification state
  const [toast,     setToast]     = useState({ open: false, message: "" });
  const toastRef    = useRef(null);
  const listRef     = useRef(null);

  const fetchMembers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/members");
      setMembers(res.data);
    } catch (err) {
      setError("Failed to load members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  // ✅ Staggered entrance after load
  useEffect(() => {
    if (!loading && members.length > 0 && listRef.current) {
      const cards = listRef.current.querySelectorAll(".member-card");
      gsap.fromTo(
        cards,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [loading, members]);

  // ✅ GSAP toast animation
  const showToast = (message) => {
    setToast({ open: true, message });
    setTimeout(() => {
      if (toastRef.current) {
        gsap.fromTo(
          toastRef.current,
          { opacity: 0, y: 50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
      }
    }, 50);
  };

  const hideToast = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        opacity: 0, y: 20, duration: 0.3, ease: "power2.in",
        onComplete: () => setToast({ open: false, message: "" }),
      });
    } else {
      setToast({ open: false, message: "" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/members/${id}`);
      showToast("Member deleted successfully");
      fetchMembers();
    } catch (err) {
      setError("Failed to delete member.");
    }
  };

  const handleEdit = (member) => {
    setEditMember(member);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditMember(null);
  };

  // ✅ Called after add or edit succeeds
  const handleRefresh = () => {
    fetchMembers();
    showToast(editMember ? "Member updated successfully!" : "Member added successfully!");
  };

  return (
    <Box display="flex" sx={{ minHeight: "100vh", bgcolor: "#0F1117" }}>
      <Navbar />

      <Box sx={{ marginLeft: "250px", flexGrow: 1, p: 4 }}>

        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="overline" color="text.secondary" letterSpacing={2}>
              Management
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Team Members
            </Typography>
          </Box>
          <Button
            variant="contained" startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Add Member
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress />
          </Box>
        ) : members.length === 0 ? (
          <Box textAlign="center" mt={6}>
            <Typography color="text.secondary" variant="h6">
              No members found.
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Click "Add Member" to get started.
            </Typography>
          </Box>
        ) : (
          <Box ref={listRef}>
            {members.map((member) => (
              <Box className="member-card" key={member._id}>
                <MemberCard
                  member={member}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* ✅ GSAP-animated toast notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={hideToast}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Box
            ref={toastRef}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              px: 3, py: 1.5, borderRadius: 3,
              background: "linear-gradient(135deg, #1A1D2E, #12152A)",
              border: "1px solid rgba(52,211,153,0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <CheckCircleIcon sx={{ color: "#34D399", fontSize: 20 }} />
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {toast.message}
            </Typography>
          </Box>
        </Snackbar>

        <AddMemberDialog
          open={dialogOpen}
          handleClose={handleDialogClose}
          refreshMembers={handleRefresh}
          editMember={editMember}
        />
      </Box>
    </Box>
  );
};

export default Members;