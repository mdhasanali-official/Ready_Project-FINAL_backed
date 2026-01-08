//controllers/authController.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const emailTemplates = require("../utils/emailTemplates");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existEmail = await User.findOne({ email });
    if (existEmail)
      return res.status(400).json({ message: "User already exists" });

    const existPhone = await User.findOne({ phone });
    if (existPhone)
      return res.status(400).json({ message: "Phone already used" });

    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      phone,
      password,
      isEmailVerified: false,
      verificationCode: otp,
      verificationCodeExpire: otpExpire,
      verificationLastSent: new Date(),
    });

    sendMail(
      email,
      "Verify your Neterskill Account",
      emailTemplates.verificationOTP(name, otp)
    ).catch((err) => {
      console.log("Email Failed:", err.message);
    });

    return res.status(201).json({
      message: "Registration Successful. Please verify your email!",
      userId: user._id,
    });
  } catch {
    return res.status(500).json({ message: "Register Failed" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isEmailVerified)
      return res.status(400).json({ message: "Email already verified" });
    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Invalid verification code" });
    if (user.verificationCodeExpire < Date.now())
      return res.status(400).json({ message: "Verification code expired" });

    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save();

    sendMail(
      user.email,
      "🎉 Email Verified – Your Neterskill Account is Now Active",
      emailTemplates.emailVerified(user.name)
    ).catch((err) => {
      console.log("Verify Success Email Failed:", err.message);
    });

    return res.status(200).json({ message: "Email Verified Successfully" });
  } catch {
    return res.status(500).json({ message: "Verification Failed" });
  }
};

exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isEmailVerified)
      return res.status(400).json({ message: "Email already verified" });

    if (
      user.verificationLastSent &&
      Date.now() - user.verificationLastSent.getTime() < 30 * 1000
    ) {
      const timeLeft =
        30 -
        Math.floor((Date.now() - user.verificationLastSent.getTime()) / 1000);
      return res.status(429).json({
        message: `Please wait ${timeLeft}s before resending`,
      });
    }

    const otp = generateOTP();
    user.verificationCode = otp;
    user.verificationCodeExpire = Date.now() + 10 * 60 * 1000;
    user.verificationLastSent = new Date();
    await user.save();

    sendMail(
      email,
      "Resend Verification Code - Neterskill",
      emailTemplates.resendOTP(otp)
    ).catch((err) => {
      console.log("Resend Email Failed:", err.message);
    });

    return res.status(200).json({
      message: "Verification code resent successfully",
    });
  } catch {
    return res.status(500).json({ message: "Failed to resend code" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isEmailVerified)
      return res
        .status(401)
        .json({ message: "Please verify your email first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch {
    res.status(500).json({ message: "Login Failed" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch {
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, bio, address, country, city, zip, profileImage } =
      req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, bio, address, country, city, zip, profileImage },
      { new: true }
    ).select("-password -verificationCode");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
