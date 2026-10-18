require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();

const courseRoutes = require("./routes/courses");
const careerGuidanceRoutes = require("./routes/carrerguidance");
const internshipRoutes = require("./routes/internship");
const workshopRoutes = require("./routes/workshop");
const projectEnquiryRoutes = require("./routes/projectenquiry");

app.use(cors());
app.use(express.json());

app.use("/api/courses", courseRoutes);
app.use("/api/career-guidance", careerGuidanceRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/project-enquiry", projectEnquiryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Vighnavi Backend Server is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
