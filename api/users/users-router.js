const express = require("express");

const { restricted } = require("../auth/auth-middleware");

const Users = require("./users-model");
const router = express.Router();

router.get("/", restricted, (req, res, next) => {
  // const users = await Users.find();
  // console.log(users, "userz here");
  // res.status(200).json({ michael: "hey there" });
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
});
/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]
 */

module.exports = router;
