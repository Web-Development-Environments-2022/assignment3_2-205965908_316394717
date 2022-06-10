var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const recipes_db_utils = require("./utils/recipes_db_utils");
const user_utils = require("./utils/user_utils");
const { RecipeInsertDto } = require("./dto/RecipeInsertDto");

// router.get("/", (req, res) => res.send("im here"));

router.get("/", async (req, res, next) => {
  try {
    let search_details = {
      query: req.params.query,
      cuisine: req.params.cuisine,
      diet: req.params.diet,
      intolerances: req.params.intolerance,
      sort: req.params.sortBy,
      sortDirection: req.params.sortDirection,
      offset: req.params.skip,
      number: req.params.limit,
    };
    const recipes = await recipes_utils.searchRecipes(search_details);
    res.send(recipes.recipes);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let recipe = new RecipeInsertDto(
      req.body.id,
      req.body.title,
      req.body.readyInMinutes,
      req.body.popularity,
      req.body.vegetarian,
      req.body.vegan,
      req.body.glutenFree,
      req.body.image,
      req.body.inventedBy,
      req.body.serveDay,
      req.body.servings,
      req.body.instructions
    );

    await recipes_db_utils.addRecipe(recipe);
    res.status(201).send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    await user_utils.markAsViewed(user_id, req.params.recipeId); //TODO: if the recipe alrady marked as viewed?
    res.status(200).send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a random number of recipes
 */
router.get("/random/:num", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getRandomRecipes(req.params.num);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the viewed recipes by the logged-in user
 */
router.get("/viewed", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getViewedRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipes_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the top N last viewed recipes by the logged-in user
 */
router.get("/viewed/:num", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getLastViewedRecipes(
      user_id,
      req.params.num
    );
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipes_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get("/favorites", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipes_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the user written recipes in the DB
 */
router.get("/my", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await recipes_db_utils.getMyRecipe(user_id);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
