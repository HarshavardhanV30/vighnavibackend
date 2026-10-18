// routes/projectEnquiry.js
const express = require("express");
const router = express.Router();
const pool = require("../db"); // Imports your existing PostgreSQL db.js connection

// ==========================================
// 1. POST: Create a new project enquiry
// ==========================================
router.post("/add", async (req, res) => {
  try {
    const { name, mobile, degree, branch, domain, tech, requirement, expectedDate } = req.body;

    const newEnquiry = await pool.query(
      `INSERT INTO project_enquiries (
        student_name, mobile_number, degree, branch, project_domain, 
        preferred_tech, requirement_desc, expected_completion_date
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *`,
      [
        name,
        mobile,
        degree,
        branch,
        domain,
        tech,
        requirement,
        expectedDate
      ]
    );

    res.status(201).json({
      success: true,
      message: "Project enquiry submitted successfully",
      data: newEnquiry.rows[0]
    });
  } catch (error) {
    console.error("Error saving project enquiry:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 2. GET: Retrieve all project enquiries
// ==========================================
router.get("/all", async (req, res) => {
  try {
    const allEnquiries = await pool.query("SELECT * FROM project_enquiries ORDER BY id DESC");
    res.status(200).json({
      success: true,
      count: allEnquiries.rowCount,
      data: allEnquiries.rows
    });
  } catch (error) {
    console.error("Error fetching project enquiries:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 3. PUT: Update an existing project enquiry by ID
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, degree, branch, domain, tech, requirement, expectedDate } = req.body;

    const updateQuery = await pool.query(
      `UPDATE project_enquiries SET 
        student_name = $1, mobile_number = $2, degree = $3, branch = $4, 
        project_domain = $5, preferred_tech = $6, requirement_desc = $7, expected_completion_date = $8
      WHERE id = $9 RETURNING *`,
      [
        name, mobile, degree, branch, domain, tech, requirement, expectedDate, id
      ]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: "Project enquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Project enquiry updated successfully",
      data: updateQuery.rows[0]
    });
  } catch (error) {
    console.error("Error updating project enquiry:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 4. DELETE: Delete a project enquiry by ID
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteQuery = await pool.query(
      "DELETE FROM project_enquiries WHERE id = $1 RETURNING *",
      [id]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: "Project enquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Project enquiry deleted successfully",
      data: deleteQuery.rows[0]
    });
  } catch (error) {
    console.error("Error deleting project enquiry:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;