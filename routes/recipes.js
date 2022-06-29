const express = require("express");
const router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const recipes_db_utils = require("./utils/recipes_db_utils");
const user_utils = require("./utils/user_utils");
const RecipeInsertDto = require("./dto/RecipeInsertDto");

// router.get("/", (req, res) => res.send("im here"));

router.get("/", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        let search_details = {
            query: req.query.query,
            cuisine: req.query.cuisine,
            diet: req.query.diet,
            intolerances: req.query.intolerance,
            sort: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            instructionsRequired: "true",
            addRecipeInformation: "true",
            offset: req.query.skip,
            number: req.query.limit,
        };
        Object.keys(search_details).forEach(key => search_details[key] === undefined ? delete search_details[key] : {});
        const recipes = await recipes_utils.searchRecipes(search_details, user_id);
        if (recipes.length === 0) res.status(204).send();
        else res.status(200).send(recipes);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (!user_id) throw {status: 401, message: "Need to login"};
        let recipe = new RecipeInsertDto( //TODO: change to the new structure
            req.body.title,
            req.body.readyInMinutes,
            req.body.vegetarian ? 1 : 0,
            req.body.vegan ? 1 : 0,
            req.body.glutenFree ? 1 : 0,
            req.body.image,
            req.body.inventedBy,
            req.body.serveDay,
            req.body.servings,
            req.body.instructions
        );
        if (!recipe.title || !recipe.readyInMinutes || recipe.vegetarian === undefined || recipe.vegan === undefined ||
            recipe.glutenFree === undefined || !recipe.servings || !recipe.image) {
            throw {status: 400, message: "Invalid recipe data"};
        }
        await recipes_db_utils.addRecipe(user_id, recipe);
        res.status(201).send(recipe);
    } catch (error) {
        next(error);
    }
});

/**
 * This path returns a random number of recipes
 */
router.get("/random/:num", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const num = parseInt(req.params.num);
        if (!Number.isInteger(num)) throw {status: 400, message: "Invalid number of random"};
        const recipes = await recipes_utils.getRandomRecipes(num, user_id);
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
        if (!user_id) throw {status: 401, message: "Need to login"};
        const recipes_id = await user_utils.getViewedRecipes(user_id);
        let recipes_id_array = [];
        recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
        const results = await recipes_utils.getRecipesPreview(recipes_id_array, user_id);
        if (results.length === 0) res.status(204).send();
        else res.status(200).send(results);
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
        if (!user_id) throw {status: 401, message: "Need to login"};
        const num = parseInt(req.params.num);
        if (!Number.isInteger(num)) throw {status: 400, message: "Invalid number of views"};
        const recipes_id = await user_utils.getLastViewedRecipes(
            user_id,
            num
        );
        let recipes_id_array = [];
        recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
        const results = await recipes_utils.getRecipesPreview(recipes_id_array, user_id);
        if (results.length === 0) res.status(204).send();
        else res.status(200).send(results);
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
        if (!user_id) throw {status: 401, message: "Need to login"};
        skip = parseInt(req.params.skip || 0);
        if (!Number.isInteger(skip)) throw {status: 400, message: "Invalid skip"};
        limit = parseInt(req.params.limit || 10);
        if (!Number.isInteger(limit)) throw {status: 400, message: "Invalid limit"};
        const recipes_id = await user_utils.getFavoriteRecipes(user_id, skip, limit);
        const recipes_count = (await user_utils.getFavoriteRecipesCount(user_id))[0].num;
        let recipes_id_array = [];
        recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
        const results = await recipes_utils.getRecipesPreview(recipes_id_array, user_id);
        let ret = {
            results: results,
            offset: skip,
            number: limit,
            totalResults: recipes_count,
        };
        res.status(200).send(ret);
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
        if (!user_id) throw {status: 401, message: "Need to login"};
        const recipes = await recipes_db_utils.getMyRecipes(user_id);
        res.status(200).send(recipes);
    } catch (error) {
        next(error);
    }
});

router.get("/my/:recipeId", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (!user_id) throw {status: 401, message: "Need to login"};
        const recipe_id = parseInt(req.params.recipeId);
        if (!Number.isInteger(recipe_id)) throw {status: 400, message: "Invalid recipe id"};
        const recipe = await recipes_db_utils.getMySpecificRecipe(user_id, recipe_id);
        if (!recipe) throw {status: 404, message: "My recipe not found"};
        else res.status(200).send(recipe);
    } catch (error) {
        next(error);
    }
});

router.get("/family", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (!user_id) throw {status: 401, message: "Need to login"};
        const recipes = await recipes_db_utils.getMyRecipes(user_id, true);
        res.status(200).send(recipes);
    } catch (error) {
        next(error);
    }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
    try {
        const recipe_id = parseInt(req.params.recipeId);
        if (!Number.isInteger(recipe_id)) throw {status: 400, message: "Invalid recipe id"};
        const user_id = req.session.user_id;
        const recipe = await recipes_utils.getRecipeDetails(recipe_id, user_id);
        if (user_id) await user_utils.markAsViewed(user_id, recipe_id);
        res.status(200).send(recipe);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
