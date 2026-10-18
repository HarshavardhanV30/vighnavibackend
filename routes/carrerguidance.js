const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/add", async (req, res) => {
  try {
    const { bookingDetails, studentDetails, paymentDetails } = req.body;
    const newBooking = await pool.query(
      `INSERT INTO career_guidance_bookings (duration, total_session_price, booking_date, start_time, end_time, full_name, mobile_number, email, qualification, branch, current_year, career_goal, payment_method, booking_fee_paid, payment_status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [bookingDetails.duration, bookingDetails.totalSessionPrice, bookingDetails.date, bookingDetails.startTime, bookingDetails.endTime, studentDetails.fullName, studentDetails.mobileNumber, studentDetails.email, studentDetails.qualification, studentDetails.branch, studentDetails.currentYear, studentDetails.careerGoal, paymentDetails.paymentMethod, paymentDetails.bookingFeePaid, paymentDetails.paymentStatus]
    );
    res.status(201).json({ success: true, data: newBooking.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const allBookings = await pool.query("SELECT * FROM career_guidance_bookings ORDER BY id DESC");
    res.status(200).json({ success: true, data: allBookings.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingDetails, studentDetails, paymentDetails } = req.body;
    const updateQuery = await pool.query(
      `UPDATE career_guidance_bookings SET duration = $1, total_session_price = $2, booking_date = $3, start_time = $4, end_time = $5, full_name = $6, mobile_number = $7, email = $8, qualification = $9, branch = $10, current_year = $11, career_goal = $12, payment_method = $13, booking_fee_paid = $14, payment_status = $15 WHERE id = $16 RETURNING *`,
      [bookingDetails.duration, bookingDetails.totalSessionPrice, bookingDetails.date, bookingDetails.startTime, bookingDetails.endTime, studentDetails.fullName, studentDetails.mobileNumber, studentDetails.email, studentDetails.qualification, studentDetails.branch, studentDetails.currentYear, studentDetails.careerGoal, paymentDetails.paymentMethod, paymentDetails.bookingFeePaid, paymentDetails.paymentStatus, id]
    );
    res.status(200).json({ success: true, data: updateQuery.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM career_guidance_bookings WHERE id = $1 RETURNING *", [id]);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
