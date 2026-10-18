require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();

// Import routes
const courseRoutes = require("./routes/courses");
const careerGuidanceRoutes = require("./routes/carrerguidance");
const internshipRoutes = require("./routes/internship");
const workshopRoutes = require("./routes/workshop");
const projectEnquiryRoutes = require("./routes/projectenquiry");

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/courses", courseRoutes);
app.use("/api/career-guidance", careerGuidanceRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/project-enquiry", projectEnquiryRoutes);

// Health check endpoint (Useful for Railway to verify deployment)
app.get("/", (req, res) => {
  res.json({ message: "Vighnavi Backend Server is running!" });
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
