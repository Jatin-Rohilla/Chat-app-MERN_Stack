const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    avatar: {
      type: String,
      default: "https://via.placeholder.com/200x200.png",
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: { type: String, enum: ["offline", "online"], default: "offline" },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    loginType: {
      type: String,
      enum: ["google", "email_password"],
      default: "email_password",
    },
    newMessages: {
      type: Object,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
