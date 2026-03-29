const User = require("../model/user");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //1. validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    //2. check existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or Email already taken",
      });
    }

    //3. create user
    const user = await User.create({
      username,
      email,
      password,
    });

    //4. response
    res.status(201).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.log("Register Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //1.validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    //2.user
    const user = await User.findOne({ username });

    if (!user || user.password != password) {
      return res.status(400).json({
        success: false,
        message: "Login failed",
      });
    }

    //3. check banned
    if (user.is_banned) {
      return res.status(200).json({
        success: false,
        message: "User is banned",
      });
    }

    //4. generate token
    const token = crypto.createHash("md5").update(username).digest("hex");

    //5. response
    res.status(200).json({
      success: true,
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.log("Login Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const TokenBlacklist = require("../model/TokenBlacklist");

const logoutUser = async (req, res) => {
  try {
    const header = req.headers["authorization"];
    const token = header.split(" ")[1];

    //store token in blacklist
    await TokenBlacklist.create({ token });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Logout Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let { limit = 10, cursor } = req.query;
    limit = parseInt(limit);

    let query = {};

    if (cursor) {
      const decoded = JSON.parse(
        Buffer.from(cursor, "base64").toString("utf-8"),
      );
      query._id = { $gt: decoded.id };
    }

    const users = await User.find(query).sort({ _id: 1 }).limit(limit);

    let next_cursor = null;

    if (users.length === limit) {
      const lastUser = users[users.length - 1];
      next_cursor = Buffer.from(JSON.stringify({ id: lastUser._id })).toString(
        "base64",
      );
    }

    res.status(200).json({
      success: true,
      data: users,
      meta: {
        next_cursor,
      },
    });
  } catch (error) {
    console.log("Get Users Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { user_id } = req.params;
    const role = req.body?.role;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either user or admin",
      });
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log("Update User Role Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const banUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.is_banned = true;
    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log("Ban User Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.is_banned = false;
    await user.save();
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log("Unban User Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUserRole,
  banUser,
  unbanUser,
};
