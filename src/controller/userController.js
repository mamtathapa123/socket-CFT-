const sequelize = require("../config/db");
const User = require("../models/user");
const bcrypt = require("../helper/hash");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");

//CRUD

//user signup
exports.signUp = async (req, res) => {
  const { username, password, first_name, last_name, occupation } = req.body;
  try {
    const hashPass = await bcrypt.hashPassword(password);
    const newUser = await User.create({
      username,
      password: hashPass,
      first_name,
      last_name,
      occupation,
    });
    if (newUser) {
      res.status(201).json({ msg: "successfully signed up", newUser });
    } else {
      res.status(400).json({ msg: "unable to signup, please try again" });
    }
  } catch (err) {
    console.log("error occured on signup", err);
    res.status(500).json({ err });
  }
};

//login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      res.status(401).json({ msg: "Invalid Username" });
    }
    const isMatch = await bcrypt.comparePassword(password, user.password);
    if (isMatch) {
      const payload = {
        userId: user.userId,
        first_name: user.first_name,
        last_name: user.last_name,
      };
      const token = jwt.sign(payload, process.env.SECRECT_KEY);
      res.status(200).json({ msg: "successfully logged in", token });
    }
  } catch (err) {
    console.log("error occured on login", err);
    res.status(500).json({ err });
  }
};

//get user
exports.getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });
    if (user) {
      res.status(200).json({ msg: "user details", user });
    } else {
      res.status(404).json({ msg: "user not found" });
    }
  } catch (err) {
    console.log("error occured on get user", err);
    res.status(500).json({ err });
  }
};

//update user details
exports.updateUser = async (req, res) => {
  const { occupation, first_name, last_name } = req.body;
  try {
    const userId = req.user.userId;
    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });
    const payload = {
      first_name: first_name || user.first_name,
      last_name: first_name || user.first_name,
      occupation: occupation || user.occupation,
    };
    const updatedUser = await User.findOneAndUpdate({
      payload,
      where: {
        userId: userId,
      },
    });
    if (updatedUser) {
      res.status(200).json({ msg: "data updated successfully" });
    } else {
      res.status(404).json({ msg: "something went wrong" });
    }
  } catch (err) {
    console.log("error occured on updating user details", err);
    res.status(500).json({ err });
  }
};

//delete user
exports.removeUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.destroy({
      where: {
        userId: userId,
      },
    });
    if (user) {
      res.status(200).json({ msg: "user deleted successfully" });
    } else {
      res.status(404).json({ msg: "something went wrong" });
    }
  } catch (err) {
    console.log("error occured on removing user", err);
    res.status(500).json({ err });
  }
};
