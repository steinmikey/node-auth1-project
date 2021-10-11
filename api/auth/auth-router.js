const express = require("express");
const bcrypt = require("bcryptjs");

const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require("./auth-middleware");
const User = require("../users/users-model");

const router = express.Router();

router.post("/register", (req, res, next) => {
  res.json({
    message: "auth register endpoint successful"
  });
});
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

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
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router;
