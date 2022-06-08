const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`INSERT INTO favorite_recipes VALUES ('${user_id}',${recipe_id})`);
}

async function removeMarkAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`DELETE FROM favorite_recipes WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM favorite_recipes WHERE user_id = ${user_id}`);
    return recipes_id;
}

async function markAsViewed(user_id, recipe_id){
    await DButils.execQuery(`REPLACE INTO viewed_recipes VALUES ('${user_id}', ${recipe_id}, NOW())`);
}

async function getViewedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM viewed_recipes WHERE user_id = ${user_id}`);
    return recipes_id;
}

async function getLastViewedRecipes(user_id, num){
    const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM viewed_recipes WHERE user_id = ${user_id} ORDER BY date DESC LIMIT ${num}`);
    return recipes_id;
}

exports.markAsFavorite = markAsFavorite;
exports.removeMarkAsFavorite = removeMarkAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsViewed = markAsViewed;
exports.getViewedRecipes = getViewedRecipes;
exports.getLastViewedRecipes = getLastViewedRecipes;
