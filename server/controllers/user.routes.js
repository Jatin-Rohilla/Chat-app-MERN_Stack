const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const { passport } = require("../passport/passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { v4 } = require("uuid");

const userController = express.Router();

userController.post("/signup", async (req, res) => {
  const { avatar, name, email, password } = req.body;

  if (!(name && email && password)) {
    return res.status(400).json({ message: "Please fill alll the details!" });
  }

  const user_already_exist = await UserModel.findOne({ email });

  if (user_already_exist) {
    return res
      .status(400)
      .json({ message: "User already exists please login!" });
  }

  bcrypt.hash(password, 5, async function (err, hash) {
    if (err) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    await UserModel.create({ ...req.body, password: hash, googleId: v4() });

    res.json({ message: "User signed up successfully" });
  });
});

userController.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    if (req.user._id) {
      const token = jwt.sign(
        { userId: req.user._id, role: req.user.role },
        process.env.JWT_SECRET
      );

      // console.log(User);
      res.cookie("token", token, {
        httpOnly: true,
        secure: "none",
        sameSite: "none",
      });
      res.cookie("name", req.user.name, { secure: true, sameSite: "none" });
      res.cookie("avatar", req.user.avatar, { secure: true, sameSite: "none" });
      res.cookie("userId", req.user._id.toString(), {
        secure: true,
        sameSite: "none",
      });

      return res.json({
        message: "login succcessful",
        userData: {
          token: token,
          name: req.user.name,
          avatar: req.user.avatar,
          userId: req.user._id.toString(),
        },
      });
    }
    return res.status(400).json(req.user);
  }
);

userController.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userController.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET
    );
    const User = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { status: "online" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("name", req.user.name, { secure: true, sameSite: "none" });
    res.cookie("avatar", req.user.avatar, { secure: true, sameSite: "none" });
    res.cookie("userId", req.user._id.toString(), {
      secure: true,
      sameSite: "none",
    });

    res.redirect(process.env.REDIRECTING_URL);
  }
);

module.exports = { userController };
