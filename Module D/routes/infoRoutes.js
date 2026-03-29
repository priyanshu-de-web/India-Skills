const express = require("express");
const router = express.Router();
const { getInfoItems } = require("../controllers/infoController");

router.get("/info-items", getInfoItems);

module.exports = router;
