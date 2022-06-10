import { RecipeDto } from "../dto/RecipeDto";
import { Instruction } from "../dto/Instruction";
import { Ingredient } from "../dto/Ingredient";
import { Equipment } from "../dto/Equipment";

const DButils = require("./DButils");

async function addRecipe(user_id, recipe) {
  let query_insert_recipe = `INSERT INTO recipes VALUES (0, ${user_id}, '${recipe.title}', ${recipe.readyInMinutes}, 
    ${recipe.vegetarian}, ${recipe.vegan}, ${recipe.glutenFree}, ${recipe.servings}, '${recipe.image}');
    SELECT LAST_INSERT_ID();`;
  let recipe_id = await DButils.execQuery(query_insert_recipe); //TODO: is it array returned?

  let instructions = [];
  let equipments = [];
  let ingredients = [];

  recipe.instructions.forEach((instruction) => {
    let query_insert_instructions = `INSERT INTO instructions VALUES (${recipe_id}, ${instruction.number}, '${instruction.step}')`;
    instructions.push(query_insert_instructions);
    instruction.equipments.forEach((equipment) => {
      let query_insert_equipment = `INSERT INTO instructions_equipments VALUES (${equipment.id}, ${recipe_id}, ${instruction.number})`;
      equipments.push(query_insert_equipment);
    });
    instruction.ingredients.forEach((ingredient) => {
      let query_insert_ingredient = `INSERT INTO instructions_ingredients VALUES (${ingredient.id}, ${recipe_id}, ${instruction.number}, ${ingredient.amount}, ${ingredient.amountType})`;
      ingredients.push(query_insert_ingredient);
    });
  });
  //TODO: add family if needed!

  let query = (instructions + equipments + ingredients).join("; \n") + ";";
  await DButils.execQuery(query);
}

async function getMyRecipe(user_id) {
  let query_select_my_recipes = `SELECT * FROM recipes WHERE user_id = '${user_id}')`;
  let recipes = await DButils.execQuery(query_select_my_recipes);
  let results = [];
  recipes.forEach(async (recipe) => {
    // get equipments
    let query_select_instruction_equipments = `SELECT a.number, a.step, c.id as equipment_id, 
    c.name as equipment_name, c.image_path as equipment_image
    FROM (SELECT * FROM instructions WHERE recipe_id = ${recipe.id}) a
    LEFT JOIN instructions_equipments b
    ON a.recipe_id = b.recipe_id AND a.number = b.number
    JOIN equipments c
    ON b.equipment_id = c.id`;
    let equipments_db = await DButils.execQuery(
      query_select_instruction_equipments
    );

    // get ingredients
    let query_select_instruction_ingredients = `SELECT a.number, a.step, b.amount, b.amount_type, c.id as ingredient_id, 
    c.name as ingredient_name, c.image_path as ingredient_image
    FROM (SELECT * FROM instructions WHERE recipe_id = ${recipe.id}) a
    LEFT JOIN instructions_ingredients b
    ON a.recipe_id = b.recipe_id AND a.number = b.number
    JOIN ingredients c
    ON b.ingredient_id = c.id;`;
    let ingredients_db = await DButils.execQuery(
      query_select_instruction_ingredients
    );
    ///////
    // get all uniqe numbers
    const numbers_and_steps = new Set();
    equipments_db.forEach((row) => {
      numbers_and_steps.add([row.number, row.step]);
    });

    let instructions = [];
    numbers_and_steps.forEach((num_and_step) => {
      const num = num_and_step[0];
      let equipments = [];
      equipments_db.forEach((equipment) => {
        if (equipment.number === num) {
          equipments.push(
            new Equipment(
              equipment.equipment_id,
              equipment.equipment_name,
              equipment.equipment_image
            )
          );
        }
      });
      let ingredients = [];
      ingredients_db.forEach((ingredient) => {
        if (ingredient.number === num) {
          ingredients.push(
            new Ingredient(
              ingredient.ingredient_id,
              ingredient.ingredient_name,
              ingredient.amount,
              ingredient.amountType,
              ingredient.ingredient_image
            )
          );
        }
      });
      instructions.push(
        new Instruction(
          equipments,
          ingredients,
          num_and_step[0],
          num_and_step[1]
        )
      );
    });

    results.push(
      new RecipeDto(
        recipe.id,
        recipe.title,
        recipe.ready_in_minutes,
        recipe.vegetarian,
        recipe.vegan,
        recipe.gluten_free,
        recipe.servings,
        recipe.image,
        "me",
        "now",
        instructions
      )
    );
  });
  return results;
}

export { addRecipe, getMyRecipe };
