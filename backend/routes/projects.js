const express  = require("express");
const router   = express.Router();
const Project  = require("../models/Project");
const { protect } = require("../middleware/auth");

// ✅ GET /api/projects — all projects
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("teamMembers", "name email role")
      .populate("createdBy", "name email")  // ✅ populate creator
      .sort({ createdAt: -1 });             // ✅ newest first
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ GET /api/projects/stats — Get dashboard statistics
router.get("/stats", protect, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: "Active" });
    const completedProjects = await Project.countDocuments({ status: "Completed" });
    const teamSize = await Member.countDocuments();

    res.json({
      totalProjects,
      activeProjects,
      completedProjects,
      teamSize
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ GET /api/projects/:id — single project
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("teamMembers", "name email role")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST /api/projects — create project
router.post("/", protect, async (req, res) => {
  const { title, description, techStack, status, teamMembers } = req.body;

  // ✅ Validation
  if (!title) {
    return res.status(400).json({ message: "Project title is required" });
  }

  try {
    const project = await Project.create({
      title,
      description: description || "",
      techStack:   techStack   || "",   // ✅ renamed from language
      status:      status      || "Active",
      teamMembers: teamMembers || [],
      createdBy:   req.user._id,        // ✅ set from auth token
    });

    const populated = await project.populate([
      { path: "teamMembers", select: "name email role" },
      { path: "createdBy",   select: "name email"      },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ PUT /api/projects/:id — update project
router.put("/:id", protect, async (req, res) => {
  const { title, description, techStack, status, teamMembers } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Only update provided fields
    if (title       !== undefined) project.title       = title;
    if (description !== undefined) project.description = description;
    if (techStack   !== undefined) project.techStack   = techStack;
    if (status      !== undefined) project.status      = status;
    if (teamMembers !== undefined) project.teamMembers = teamMembers;

    const updated = await project.save();

    const populated = await updated.populate([
      { path: "teamMembers", select: "name email role" },
      { path: "createdBy",   select: "name email"      },
    ]);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE /api/projects/:id — delete project
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;