const DButils = require("./DButils");

async function addRecipe(user_id) {
    let query = `SELECT * FROM users WHERE id = ${user_id}`;
    return await DButils.execQuery(query);
  }