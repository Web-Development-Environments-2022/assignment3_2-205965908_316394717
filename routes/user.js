var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipes_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery(`SELECT id FROM users WHERE id = ${req.session.user_id}`)
      .then((users) => {
        if (users.length == 1) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post("/favorites", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    if (!user_id) throw {status: 401, message: "Need to login"};
    const recipe_id = req.body.recipeId;
    if (!Number.isInteger(recipe_id)) throw {status: 400, message: "Invalid recipe id"};
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(201).send("The Recipe successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.delete("/favorites", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    if (!user_id) throw {status: 401, message: "Need to login"};
    const recipe_id = req.body.recipeId;
    if (!Number.isInteger(recipe_id)) throw {status: 400, message: "Invalid recipe id"};
    await user_utils.removeMarkAsFavorite(user_id, recipe_id);
    res.status(202).send("The Recipe successfully deleted from favorites");
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    if (!user_id) throw {status: 401, message: "Need to login"};
    let user = (await user_utils.getUser(user_id))[0];
    if (!user) {
      res.status(404).send();
    } else {
      user.password = 'its a secret';
      res.status(202).send(user);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
