import { useState, useEffect, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  TextField, Button, DialogActions,
  MenuItem, Alert, CircularProgress
} from "@mui/material";
import api from "../services/api";
import { gsap } from "gsap";

const INITIAL_STATE = {
  title: "", description: "", techStack: "",
  status: "Active", teamMembers: [],
};

const AddProjectDialog = ({ open, handleClose, refreshProjects, editProject }) => {
  const formRef = useRef(null);

  const [members, setMembers] = useState([]);
  const [project, setProject] = useState(INITIAL_STATE);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(editProject);

  useEffect(() => {
    if (!open) return;

    if (isEditMode) {
      // ✅ Check if techStack is an array, if yes, join it into a string
      const formattedTechStack = Array.isArray(editProject.techStack) 
        ? editProject.techStack.join(", ") 
        : editProject.techStack || "";

      setProject({
        title: editProject.title || "",
        description: editProject.description || "",
        techStack: formattedTechStack, // 👈 Safe string conversion
        status: editProject.status || "Active",
        teamMembers: editProject.teamMembers?.map((m) =>
          typeof m === "object" ? m._id : m
        ) || [],
      });
    } else {
      setProject(INITIAL_STATE);
    }
    setError("");

    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }

    fetchMembers();
  }, [open, editProject]); // ✅ Added editProject to dependency array

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data);
    } catch (err) {
      setError("Failed to load team members");
    }
  };

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
    setError("");
  };

  const handleMembersChange = (e) => {
    setProject({ ...project, teamMembers: e.target.value });
  };

  // ✅ Updated Validation with Type-Safety
  const validate = () => {
    const { title, description, techStack } = project;
    
    if (!title || typeof title !== "string" || !title.trim()) {
        return "Project title is required";
    }
    if (!description || typeof description !== "string" || !description.trim()) {
        return "Description is required";
    }
    // Convert to string safely before trimming
    const techStackStr = String(techStack || "");
    if (!techStackStr.trim()) {
        return "Tech stack is required";
    }
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      // ✅ Clean techStack before sending (convert string back to array if your backend expects it)
      // Agar backend string maangta hai to seedha 'project' bhej dein
      const payload = {
        ...project,
        techStack: typeof project.techStack === "string" 
          ? project.techStack.split(",").map(item => item.trim()) 
          : project.techStack
      };

      if (isEditMode) {
        await api.put(`/projects/${editProject.id || editProject._id}`, payload);
      } else {
        await api.post("/projects", payload);
      }

      refreshProjects();
      handleClose();
      setProject(INITIAL_STATE);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? "update" : "add"} project`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditMode ? "Edit Project" : "Add Project"}
      </DialogTitle>

      <DialogContent ref={formRef}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        <TextField
          margin="dense" label="Project Title" name="title"
          fullWidth value={project.title} onChange={handleChange}
        />
        <TextField
          margin="dense" label="Description" name="description"
          fullWidth multiline rows={3}
          value={project.description} onChange={handleChange}
        />
        <TextField
          margin="dense" label="Tech Stack (comma separated)" name="techStack"
          fullWidth value={project.techStack} onChange={handleChange}
          placeholder="e.g. React, Node, MongoDB"
        />
        <TextField
          select margin="dense" label="Status" name="status"
          fullWidth value={project.status} onChange={handleChange}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        <TextField
          select margin="dense" label="Assign Team Members"
          fullWidth SelectProps={{ multiple: true }}
          value={project.teamMembers} onChange={handleMembersChange}
        >
          {members.length === 0 ? (
            <MenuItem disabled>No members available</MenuItem>
          ) : (
            members.map((m) => (
              <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
            ))
          )}
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
            : isEditMode ? "Save Changes" : "Add Project"
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectDialog;