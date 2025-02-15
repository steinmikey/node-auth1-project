const { findBy } = require("../users/users-model");

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next({
      status: 401,
      message: "You shall not pass!"
    });
  }
}

async function checkUsernameFree(req, res, next) {
  const existingUser = await findBy({ username: req.body.username }).first();
  if (existingUser) {
    next({
      status: 422,
      message: "Username taken"
    });
  } else {
    next();
  }
}

async function checkUsernameExists(req, res, next) {
  const existingUser = await findBy({ username: req.body.username }).first();
  if (existingUser) {
    next();
  } else {
    next({
      status: 401,
      message: "Invalid credentials"
    });
  }
}

function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  if (!password || password.length < 4) {
    next({
      status: 422,
      message: "Password must be longer than 3 chars"
    });
  } else {
    next();
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
};
