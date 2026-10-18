// index.js
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const app = express();

// Import routes based on your folder structure
const courseRoutes = require("./routes/courses");
const careerGuidanceRoutes = require("./routes/carrerguidance");
const internshipRoutes = require("./routes/internship");
const workshopRoutes = require("./routes/workshop");

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/courses", courseRoutes);
app.use("/api/career-guidance", careerGuidanceRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/workshops", workshopRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Vighnavi Backend Server is running!");
});

// Port configuration (using 5000 for API to avoid conflict with Postgres default 5432)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});