//controllers/adminAuthController.js
const SuperAdmin = require("../models/superAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await SuperAdmin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: admin._id, role: "super_admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Admin Login Successful",
      token,
      admin: { id: admin._id, email: admin.email, role: "super_admin" },
    });
  } catch {
    res.status(500).json({ message: "Admin Login Failed" });
  }
};
