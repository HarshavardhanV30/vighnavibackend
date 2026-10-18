const express = require("express");
const router = express.Router();

// Placeholder route to prevent crashes
router.get("/", (req, res) => {
  res.json({ message: "Route is currently under construction" });
});

// This export line is strictly required
module.exports = router;
