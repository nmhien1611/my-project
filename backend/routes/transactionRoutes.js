const express = require("express");
const router = express.Router();

// POST
router.post("/", (req, res) => {
  res.json({
    message: "POST OK",
    data: req.body
  });
});

// GET
router.get("/", (req, res) => {
  res.json({
    message: "GET OK"
  });
});

module.exports = router;