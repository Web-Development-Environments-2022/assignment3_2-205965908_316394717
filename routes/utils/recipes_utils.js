const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");
const RecipeDto = require("../dto/RecipeDto");

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info
 */
async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            apiKey: process.env.APOONCULAR_API_KEY,
            includeNutrition: false,
        },
    });
}

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info
 */
async function getRecipeInformationBulk(recipes_ids) {
    return await axios.get(`${api_domain}/informationBulk`, {
        params: {
            apiKey: process.env.APOONCULAR_API_KEY,
            ids: recipes_ids.join(),
        },
    });
}

async function getRecipeDetails(recipe_id, user_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    return await convertToRecipePage(recipe_info.data, user_id);
}

async function getRecipeDetailsBulk(recipes_ids, user_id) {
    let recipe_info = await getRecipeInformationBulk(recipes_ids);
    let ret = [];
    for (const element of recipe_info.data) {
        ret.push(await convertToRecipePreview(element, user_id));
    }

    return ret;
}

async function getRecipesPreview(recipes_id_array, user_id) {
    return getRecipeDetailsBulk(recipes_id_array, user_id);
}

async function getRandomRecipes(num, user_id) {
    let data = await axios.get(`${api_domain}/random`, {
        params: {
            apiKey: process.env.APOONCULAR_API_KEY,
            number: num,
        },
    });
    let promises = data.data.recipes.map(async (x) => await convertToRecipePreview(x, user_id));
    return Promise.all(promises);
}

async function searchRecipes(search_details, user_id) {
    let params = search_details
    params["apiKey"] = process.env.APOONCULAR_API_KEY
    let data = await axios.get(`${api_domain}/complexSearch`, {
        params: params
    });
    let promises = data.data.results.map(async (x) => await convertToRecipePreview(x, user_id));
    return Promise.all(promises);
}

async function convertToRecipePreview(recipe, user_id) {
    let {
        id,
        title,
        readyInMinutes,
        image,
        aggregateLikes,
        vegan,
        vegetarian,
        glutenFree,
    } = recipe;

    let viewed_favorite = {viewed: 0, favorite: 0}
    if (user_id) {
        const query = `SELECT * FROM 
(SELECT count(*) as viewed FROM viewed_recipes WHERE user_id = ${user_id} AND recipe_id = ${id}) a,
(SELECT count(*) as favorite FROM favorite_recipes WHERE user_id = ${user_id} AND recipe_id = ${id}) b`
        viewed_favorite = (await DButils.execQuery(query))[0];
    }
    let preview = {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        hasViewed: viewed_favorite.viewed === 1,
        isFavorite: viewed_favorite.favorite === 1
    };
    return preview;
}


async function convertToRecipePage(recipe, user_id) {
    let viewed_favorite = {viewed: 0, favorite: 0}
    if (user_id) {
        const query = `SELECT * FROM 
(SELECT count(*) as viewed FROM viewed_recipes WHERE user_id = ${user_id} AND recipe_id = ${recipe.id}) a,
(SELECT count(*) as favorite FROM favorite_recipes WHERE user_id = ${user_id} AND recipe_id = ${recipe.id}) b`
        viewed_favorite = (await DButils.execQuery(query))[0];
    }

    let ingredients = [];
    recipe.extendedIngredients.forEach(ingredient => {
        ingredients.push(
            {
                id: ingredient.id,
                name: ingredient.name,
                amount: ingredient.amount,
                amountType: ingredient.unit,
                image: ingredient.image
            }
        )
    });

    let equipments = {};
    recipe.analyzedInstructions.forEach(analyzedInstruction => {
        analyzedInstruction.steps.forEach(step => {
            step.equipment.forEach(equipment => {
                equipments[equipment.id] =
                    {
                        id: equipment.id,
                        name: equipment.name,
                        image: equipment.image
                    };
            });
        });
    });
    equipments = Object.values(equipments);


    let instructionSets = [];
    recipe.analyzedInstructions.forEach(instructions => {
        let steps = [];
        instructions.steps.forEach(step => {
            steps.push(
                {
                    number: step.number,
                    step: step.step,
                    ingredients: step.ingredients.map((x) => {
                        return {id: x.id, name: x.name, image: x.image}
                    }),
                    equipments: step.equipment.map((x) => {
                        return {id: x.id, name: x.name, image: x.image}
                    })
                });
        });
        instructionSets.push({name: instructions.name, steps: steps});
    });

    return new RecipeDto(
        recipe.id,
        recipe.title,
        recipe.readyInMinutes,
        recipe.aggregateLikes,
        recipe.vegetarian,
        recipe.vegan,
        recipe.glutenFree,
        viewed_favorite.viewed === 1,
        viewed_favorite.favorite === 1,
        recipe.image,
        "",
        "",
        recipe.servings,
        ingredients,
        equipments,
        instructionSets
    )
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipeDetailsBulk = getRecipeDetailsBulk;
exports.getRecipesPreview = getRecipesPreview;
exports.getRandomRecipes = getRandomRecipes;
exports.searchRecipes = searchRecipes;
