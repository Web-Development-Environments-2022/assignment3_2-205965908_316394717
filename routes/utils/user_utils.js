const DButils = require("./DButils");

async function getUser(user_id) {
  let query = `SELECT * FROM users WHERE id = ${user_id}`;
  return await DButils.execQuery(query);
}

async function markAsFavorite(user_id, recipe_id) {
  let query = `INSERT INTO favorite_recipes VALUES ('${user_id}',${recipe_id})`;
  await DButils.execQuery(query);
}

async function removeMarkAsFavorite(user_id, recipe_id) {
  let query = `DELETE FROM favorite_recipes WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}`;
  await DButils.execQuery(query);
}

async function getFavoriteRecipes(user_id) {
  let query = `SELECT recipe_id FROM favorite_recipes WHERE user_id = ${user_id}`;
  const recipes_id = await DButils.execQuery();
  return recipes_id;
}

async function markAsViewed(user_id, recipe_id) {
  let query = `REPLACE INTO viewed_recipes VALUES (${user_id}, ${recipe_id}, NOW())`;
  await DButils.execQuery(query);
}

async function getViewedRecipes(user_id) {
  let query = `SELECT recipe_id FROM viewed_recipes WHERE user_id = ${user_id}`;
  const recipes_id = await DButils.execQuery(query);
  return recipes_id;
}

async function getLastViewedRecipes(user_id, num) {
  const recipes_id = await DButils.execQuery(
    `SELECT recipe_id FROM viewed_recipes WHERE user_id = ${user_id} ORDER BY date DESC LIMIT ${num}`
  );
  return recipes_id;
}

exports.getUser = getUser;
exports.markAsFavorite = markAsFavorite;
exports.removeMarkAsFavorite = removeMarkAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsViewed = markAsViewed;
exports.getViewedRecipes = getViewedRecipes;
exports.getLastViewedRecipes = getLastViewedRecipes;
