const User = require("../model/user");
const crypto = require("crypto");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];

    //1. check header
    if (!header) {
      return res.status(401).json({
        success: false,
        message: "Access Token is required",
      });
    }

    //2. extract token
    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid Acccess Token",
      });
    }

    //3. find user by matching token
    const users = await User.find();

    let currentUser = null;

    for (let user of users) {
      const userToken = crypto
        .createHash("md5")
        .update(user.username)
        .digest("hex");

      if (userToken == token) {
        currentUser = user;
        break;
      }
    }

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid Access Token",
      });
    }

    //4. check banned
    if (currentUser.is_banned) {
      return res.status(403).json({
        success: false,
        message: "User is banned",
      });
    }

    //5. attach user
    req.user = currentUser;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = authMiddleware;
