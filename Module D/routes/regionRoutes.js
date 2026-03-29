const express = require("express");
const router = express.Router();
const { getRegionsWithAttractions } = require("../controllers/regionController");

router.get("/regions", getRegionsWithAttractions);

module.exports = router;
