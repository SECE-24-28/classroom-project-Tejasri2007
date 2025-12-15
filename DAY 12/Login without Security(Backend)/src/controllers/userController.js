const User = require("../models/userModel");

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save(); // Save to MongoDB
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// USER LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find single user
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
