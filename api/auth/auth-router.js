const express = require("express");
const bcrypt = require("bcryptjs");

const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require("./auth-middleware");
const User = require("../users/users-model");

const router = express.Router();

router.post("/register", checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    const user = { username, password: hash };
    const newRegisteredUser = await User.add(user);
    const userInfo = {
      user_id: newRegisteredUser.user_id,
      username: newRegisteredUser.username
    };
    res.status(201).json(userInfo);
  } catch (err) {
    next(err);
  }
});

router.post("/login", checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findBy({ username: username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({ message: `Welcome ${username}!` });
    } else {
      next({
        status: 401,
        message: "Invalid credentials"
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.json({
          message: "It turns out, you cannot leave so easily"
        });
      } else {
        res.json({
          message: "logged out"
        });
      }
    });
  } else {
    res.json({
      message: "no session"
    });
  }
});

module.exports = router;
