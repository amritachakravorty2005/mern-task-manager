const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../utils/token");
const { validateEmail } = require("../utils/validation");

exports.signup = async (req, res) => {
  try {
    console.log("Received signup request:", req.body);  // 🔍 Log input

    const { name, email, password } = req.body;

    // Basic validations
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ msg: "Please send string values only" });
    }

    if (password.length < 4) {
      return res.status(400).json({ msg: "Password must be at least 4 characters" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "This email is already registered" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    console.log("User created:", newUser.email);  // ✅ Confirm creation
    return res.status(200).json({ msg: "Account created successfully!" });

  } catch (err) {
    console.error("Signup error:", err);  // ⛔ log the full error
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Received login request:", req.body);  // 🔍 Log input

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, msg: "Please enter all details!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: false, msg: "This email is not registered!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, msg: "Incorrect password!" });
    }

    const token = createAccessToken({ id: user._id });

    console.log("Login successful:", user.email);
    res.status(200).json({ token, user: { name: user.name, email: user.email, _id: user._id }, status: true, msg: "Login successful!" });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
