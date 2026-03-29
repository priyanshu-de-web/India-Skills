const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/authController");
const { loginUser } = require("../controllers/authController");
const { logoutUser } = require("../controllers/authController");
const { getAllUsers } = require("../controllers/authController");
const { updateUserRole } = require("../controllers/authController");
const { banUser } = require("../controllers/authController");
const { unbanUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);

router.get("/user", authMiddleware, isAdmin, getAllUsers);
router.put("/user/:user_id", authMiddleware, isAdmin, updateUserRole);
router.put("/user/:user_id/ban", authMiddleware, isAdmin, banUser);
router.put("/user/:user_id/unban", authMiddleware, isAdmin, unbanUser);

module.exports = router;
