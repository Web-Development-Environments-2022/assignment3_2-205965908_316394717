const dbUtils = require("./DButils");

async function getUser(user_id) {
    let query = `SELECT * FROM users WHERE id = ${user_id}`;
    return await dbUtils.execQuery(query);
}

async function markAsFavorite(user_id, recipe_id) {
    let query = `REPLACE INTO favorite_recipes VALUES ('${user_id}',${recipe_id})`;
    await dbUtils.execQuery(query);
}

async function removeMarkAsFavorite(user_id, recipe_id) {
    let query = `DELETE FROM favorite_recipes WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}`;
    await dbUtils.execQuery(query);
}

async function getFavoriteRecipes(user_id, skip = 0, limit = 10) {
    let query = `SELECT recipe_id FROM favorite_recipes WHERE user_id = ${user_id} LIMIT ${limit} OFFSET ${skip}`;
    return await dbUtils.execQuery(query);
}

async function getFavoriteRecipesCount(user_id) {
    let query = `SELECT COUNT(recipe_id) as num FROM favorite_recipes WHERE user_id = ${user_id}`;
    return await dbUtils.execQuery(query);
}

async function markAsViewed(user_id, recipe_id) {
    let query = `REPLACE INTO viewed_recipes VALUES (${user_id}, ${recipe_id}, NOW())`;
    await dbUtils.execQuery(query);
}

async function getViewedRecipes(user_id) {
    let query = `SELECT recipe_id FROM viewed_recipes WHERE user_id = ${user_id}`;
    return await dbUtils.execQuery(query);
}

async function getLastViewedRecipes(user_id, num) {
    let query = `SELECT recipe_id FROM viewed_recipes WHERE user_id = ${user_id} ORDER BY date DESC LIMIT ${num}`;
    return await dbUtils.execQuery(query);
}

exports.getUser = getUser;
exports.markAsFavorite = markAsFavorite;
exports.removeMarkAsFavorite = removeMarkAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFavoriteRecipesCount = getFavoriteRecipesCount;
exports.markAsViewed = markAsViewed;
exports.getViewedRecipes = getViewedRecipes;
exports.getLastViewedRecipes = getLastViewedRecipes;
