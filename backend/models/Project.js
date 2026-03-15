const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, "Project title is required"],
      trim:     true,
    },
    description: {
      type:    String,
      trim:    true,
      default: "",          // ✅ added per spec
    },
    // Updated Project Schema Snippet
techStack: {
  type: [String], // Array of strings
  default: [],
},
    status: {
      type:    String,
      default: "Active",
      enum:    ["Active", "Completed"], // ✅ restricted values
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Member",     // ✅ populate-ready
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",         // ✅ tracks which user created it
    },
  },
  {
    timestamps: true,       // ✅ createdAt, updatedAt
  }
);

module.exports = mongoose.model("Project", projectSchema);