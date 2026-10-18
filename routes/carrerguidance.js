// routes/carrerguidance.js
const express = require("express");
const router = express.Router();
const pool = require("../db"); // Imports your existing db.js connection

// ==========================================
// 1. POST: Create a new career guidance booking
// ==========================================
router.post("/add", async (req, res) => {
  try {
    const { bookingDetails, studentDetails, paymentDetails } = req.body;

    const newBooking = await pool.query(
      `INSERT INTO career_guidance_bookings (
        duration, total_session_price, booking_date, start_time, end_time,
        full_name, mobile_number, email, qualification, branch, current_year, career_goal,
        payment_method, booking_fee_paid, payment_status
      ) VALUES (
        $1, $2, $3, $4, $5, 
        $6, $7, $8, $9, $10, $11, $12, 
        $13, $14, $15
      ) RETURNING *`,
      [
        // Booking Details
        bookingDetails.duration,
        bookingDetails.totalSessionPrice,
        bookingDetails.date,
        bookingDetails.startTime,
        bookingDetails.endTime,
        // Student Details
        studentDetails.fullName,
        studentDetails.mobileNumber,
        studentDetails.email,
        studentDetails.qualification,
        studentDetails.branch,
        studentDetails.currentYear,
        studentDetails.careerGoal,
        // Payment Details
        paymentDetails.paymentMethod,
        paymentDetails.bookingFeePaid,
        paymentDetails.paymentStatus
      ]
    );

    res.status(201).json({
      success: true,
      message: "Career guidance booking successful",
      data: newBooking.rows[0]
    });
  } catch (error) {
    console.error("Error saving booking:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 2. GET: Retrieve all career guidance bookings
// ==========================================
router.get("/all", async (req, res) => {
  try {
    const allBookings = await pool.query("SELECT * FROM career_guidance_bookings ORDER BY id DESC");
    res.status(200).json({
      success: true,
      count: allBookings.rowCount,
      data: allBookings.rows
    });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 3. PUT: Update an existing booking by ID
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingDetails, studentDetails, paymentDetails } = req.body;

    const updateQuery = await pool.query(
      `UPDATE career_guidance_bookings SET 
        duration = $1, total_session_price = $2, booking_date = $3, start_time = $4, end_time = $5,
        full_name = $6, mobile_number = $7, email = $8, qualification = $9, branch = $10, current_year = $11, career_goal = $12,
        payment_method = $13, booking_fee_paid = $14, payment_status = $15
      WHERE id = $16 RETURNING *`,
      [
        // Booking Details
        bookingDetails.duration, bookingDetails.totalSessionPrice, bookingDetails.date, bookingDetails.startTime, bookingDetails.endTime,
        // Student Details
        studentDetails.fullName, studentDetails.mobileNumber, studentDetails.email, studentDetails.qualification, studentDetails.branch, studentDetails.currentYear, studentDetails.careerGoal,
        // Payment Details
        paymentDetails.paymentMethod, paymentDetails.bookingFeePaid, paymentDetails.paymentStatus,
        // ID
        id
      ]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updateQuery.rows[0]
    });
  } catch (error) {
    console.error("Error updating booking:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 4. DELETE: Delete a booking by ID
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteQuery = await pool.query(
      "DELETE FROM career_guidance_bookings WHERE id = $1 RETURNING *",
      [id]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      data: deleteQuery.rows[0]
    });
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;