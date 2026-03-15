import { useState, useEffect, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  TextField, Button, DialogActions,
  Alert, CircularProgress
} from "@mui/material";
import api from "../services/api";
import { gsap } from "gsap";

const INITIAL_STATE = { name: "", email: "", password: "", role: "Developer" };

const AddMemberDialog = ({ open, handleClose, refreshMembers, editMember }) => {
  const formRef = useRef(null);

  const [member,  setMember]  = useState(INITIAL_STATE);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(editMember); // ✅ true if editing

  // ✅ Pre-fill form when editing
  useEffect(() => {
    if (!open) return;

    if (isEditMode) {
      setMember({
        name:  editMember.name  || "",
        email: editMember.email || "",
        password: "",            // never pre-fill password
        role:  editMember.role  || "Developer",
      });
    } else {
      setMember(INITIAL_STATE); // reset for add mode
    }
    setError("");

    // GSAP animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [open]);

  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!member.name.trim())  return "Name is required";
    if (!member.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(member.email)) return "Invalid email format";
    // password only required in add mode
    if (!isEditMode && !member.password)
      return "Password is required";
    if (!isEditMode && member.password.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      if (isEditMode) {
        // ✅ Edit mode — PUT request
        const payload = { name: member.name, email: member.email, role: member.role };
        await api.put(`/members/${editMember._id}`, payload);
      } else {
        // ✅ Add mode — POST request
        await api.post("/members", member);
      }

      refreshMembers();
      handleClose();
      setMember(INITIAL_STATE);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? "update" : "add"} member`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {/* ✅ Title changes based on mode */}
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditMode ? "Edit Member" : "Add Team Member"}
      </DialogTitle>

      <DialogContent ref={formRef}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        <TextField
          margin="dense" label="Full Name" name="name"
          fullWidth value={member.name} onChange={handleChange}
        />
        <TextField
          margin="dense" label="Email" name="email"
          fullWidth value={member.email} onChange={handleChange}
        />

        {/* ✅ Password only shown in Add mode */}
        {!isEditMode && (
          <TextField
            margin="dense" label="Password" name="password"
            type="password" fullWidth
            value={member.password} onChange={handleChange}
            helperText="Minimum 6 characters"
          />
        )}

        <TextField
          select margin="dense" label="Role" name="role"
          fullWidth value={member.role} onChange={handleChange}
          SelectProps={{ native: true }}
        >
          {["Developer", "Designer", "Manager", "QA", "DevOps"].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained" onClick={handleSubmit} disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading
            ? isEditMode ? "Saving..." : "Adding..."
            : isEditMode ? "Save Changes" : "Add Member"
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberDialog;