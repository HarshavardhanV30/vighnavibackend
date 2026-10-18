// routes/courses.js
const express = require("express");
const router = express.Router();
const pool = require("../db"); 

// ==========================================
// 1. POST: Create a new course enrollment
// ==========================================
router.post("/add", async (req, res) => {
  try {
    const { studentDetails, courseDetails, paymentDetails } = req.body;

    const newEnrollment = await pool.query(
      `INSERT INTO course_enrollments (
        name, email, phone, qualification, degree, year, employment_status, 
        course_id, title, price, 
        transaction_id, payment_status, payment_gateway, amount_paid, payment_timestamp
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, 
        $8, $9, $10, 
        $11, $12, $13, $14, $15
      ) RETURNING *`,
      [
        // Student Details
        studentDetails.name,
        studentDetails.email,
        studentDetails.phone,
        studentDetails.qualification,
        studentDetails.degree,
        studentDetails.year,
        studentDetails.employmentStatus,
        // Course Details
        courseDetails.courseId,
        courseDetails.title,
        courseDetails.price,
        // Payment Details
        paymentDetails.transactionId,
        paymentDetails.paymentStatus,
        paymentDetails.paymentGateway,
        paymentDetails.amountPaid,
        paymentDetails.timestamp
      ]
    );

    res.status(201).json({
      success: true,
      message: "Enrollment successful",
      data: newEnrollment.rows[0]
    });
  } catch (error) {
    console.error("Error saving enrollment:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 2. GET: Retrieve all course enrollments
// ==========================================
router.get("/all", async (req, res) => {
  try {
    const allEnrollments = await pool.query("SELECT * FROM course_enrollments ORDER BY id DESC");
    res.status(200).json({
      success: true,
      count: allEnrollments.rowCount,
      data: allEnrollments.rows
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 3. PUT: Update an existing enrollment by ID
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentDetails, courseDetails, paymentDetails } = req.body;

    const updateQuery = await pool.query(
      `UPDATE course_enrollments SET 
        name = $1, email = $2, phone = $3, qualification = $4, degree = $5, year = $6, employment_status = $7, 
        course_id = $8, title = $9, price = $10, 
        transaction_id = $11, payment_status = $12, payment_gateway = $13, amount_paid = $14, payment_timestamp = $15
      WHERE id = $16 RETURNING *`,
      [
        studentDetails.name, studentDetails.email, studentDetails.phone, studentDetails.qualification, studentDetails.degree, studentDetails.year, studentDetails.employmentStatus,
        courseDetails.courseId, courseDetails.title, courseDetails.price,
        paymentDetails.transactionId, paymentDetails.paymentStatus, paymentDetails.paymentGateway, paymentDetails.amountPaid, paymentDetails.timestamp,
        id
      ]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      data: updateQuery.rows[0]
    });
  } catch (error) {
    console.error("Error updating enrollment:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 4. DELETE: Delete an enrollment by ID
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteQuery = await pool.query(
      "DELETE FROM course_enrollments WHERE id = $1 RETURNING *",
      [id]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully",
      data: deleteQuery.rows[0]
    });
  } catch (error) {
    console.error("Error deleting enrollment:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
