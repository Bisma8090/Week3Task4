const express = require("express");
const router  = express.Router();
const Member  = require("../models/Member");
const { protect } = require("../middleware/auth");

// ✅ GET /api/members — get all members
router.get("/", protect, async (req, res) => {
  try {
    const members = await Member.find().select("-password"); // ✅ exclude password
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET /api/members/:id — get single member
router.get("/:id", protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select("-password");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST /api/members — create member
router.post("/", protect, async (req, res) => {
  const { name, email, password, role } = req.body;

  // ✅ Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    // ✅ Check duplicate email
    const exists = await Member.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // ✅ No manual hashing — model pre("save") hook handles it
    const member = await Member.create({ name, email, password, role });

    // ✅ Return without password
    const memberObj = member.toObject();
    delete memberObj.password;
    res.status(201).json(memberObj);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ PUT /api/members/:id — update member
router.put("/:id", protect, async (req, res) => {
  const { name, email, role, status } = req.body;

  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // ✅ Only update provided fields
    if (name)   member.name   = name;
    if (email)  member.email  = email;
    if (role)   member.role   = role;
    if (status) member.status = status;

    const updated = await member.save(); // ✅ triggers pre("save") hook

    const memberObj = updated.toObject();
    delete memberObj.password;
    res.json(memberObj);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE /api/members/:id — delete member
router.delete("/:id", protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await member.deleteOne();
    res.json({ message: "Member deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;