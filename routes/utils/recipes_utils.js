const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info
 */
async function getRecipeInformation(recipe_id) {
  return await axios.get(`${api_domain}/${recipe_id}/information`, {
    params: {
      apiKey: process.env.spooncular_apiKey,
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
      apiKey: process.env.spooncular_apiKey,
      ids: recipes_ids.join(),
    },
  });
}

async function getRecipeDetails(recipe_id) {
  let recipe_info = await getRecipeInformation(recipe_id);
  let {
    id,
    title,
    readyInMinutes,
    image,
    aggregateLikes,
    vegan,
    vegetarian,
    glutenFree,
  } = recipe_info.data;

  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    image: image,
    popularity: aggregateLikes,
    vegan: vegan,
    vegetarian: vegetarian,
    glutenFree: glutenFree,
  };
}

async function getRecipeDetailsBulk(recipes_ids) {
  let recipe_info = await getRecipeInformationBulk(recipes_ids);
  let ret = [];
  recipe_info.data.forEach((element) => {
    let {
      id,
      title,
      readyInMinutes,
      image,
      aggregateLikes,
      vegan,
      vegetarian,
      glutenFree,
    } = element;
    
    ret.push({
      id: id,
      title: title,
      readyInMinutes: readyInMinutes,
      image: image,
      popularity: aggregateLikes,
      vegan: vegan,
      vegetarian: vegetarian,
      glutenFree: glutenFree,
    });
  });

  return ret;
}

async function getRecipesPreview(recipes_id_array) {
  return getRecipeDetailsBulk(recipes_id_array); //TODO: maybe remove this function and use the BULK insted?
}

async function getRandomRecipes(num) {
  return await axios.get(`${api_domain}/random`, {
    params: {
      apiKey: process.env.spooncular_apiKey,
      number: num,
    },
  });
}

async function searchRecipes(search_details) {
  return await axios.get(`${api_domain}/complexSearch`, {
    params: search_details, //TODO: check if worked fine, what about nulls?
  });
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipeDetailsBulk = getRecipeDetailsBulk;
exports.getRecipesPreview = getRecipesPreview;
exports.getRandomRecipes = getRandomRecipes;
exports.searchRecipes = searchRecipes;
