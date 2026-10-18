const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/all", async (req, res) => {
  res.status(200).json({ success: true, message: "Route active" });
});

module.exports = router;
