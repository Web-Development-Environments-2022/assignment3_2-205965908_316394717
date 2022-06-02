var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email, //,
      // profilePic: req.body.profilePic
    };
    let select_query = `SELECT * FROM users WHERE user_name = '${user_details.username}'`;
    let user = await DButils.execQuery(select_query);
    if (user.length != 0) throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    let insert_query = `INSERT INTO users VALUES (0, '${user_details.username}', '${user_details.firstname}', '${user_details.lastname}', '${user_details.country}', '${hash_password}', '${user_details.email}')`;
    await DButils.execQuery(insert_query);
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    let query = `SELECT * FROM users WHERE user_name = '${req.body.username}'`;
    const user = await DButils.execQuery(query);
    if (user.length != 1 || !bcrypt.compareSync(req.body.password, user[0].password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    } else {
      // TODO: add user uuid for each login
      // Set cookie
      req.session.user_id = user[0].id;
      // return cookie
      res.status(200).send({ message: "login succeeded", success: true });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
