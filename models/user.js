//models/user.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: { type: String, default: "user" },
    isEmailVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },

    bio: { type: String },
    address: { type: String },
    country: { type: String },
    city: { type: String },
    zip: { type: String },
    profileImage: { type: String },

    verificationCode: { type: String },
    verificationLastSent: { type: Date },
    verificationCodeExpire: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ name: 1, email: 1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
