CREATE SCHEMA `mydb` ;

CREATE TABLE `mydb`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NOT NULL UNIQUE,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `country` VARCHAR(45) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

  CREATE TABLE `mydb`.`recipes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `ready_in_minutes` INT NOT NULL,
  `vegetarian` TINYINT NOT NULL,
  `vegan` TINYINT NOT NULL,
  `gluten_free` TINYINT NOT NULL,
  `servings` INT NOT NULL,
  `image_path` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `recipes_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `mydb`.`viewed_recipes` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`user_id`, `recipe_id`),
  CONSTRAINT `views_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `mydb`.`favorite_recipes` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `recipe_id`),
  CONSTRAINT `favorites_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `mydb`.`ingredients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `image_path` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `mydb`.`equipments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `image_path` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `mydb`.`instructions` (
  `recipe_id` INT NOT NULL,
  `number` INT NOT NULL,
  `step` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`recipe_id`, `number`),
  CONSTRAINT `instructions_recipe_id`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `mydb`.`recipes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `mydb`.`instructions_equipments` (
  `equipment_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `number` INT NOT NULL,
  PRIMARY KEY (`equipment_id`, `recipe_id`, `number`),
CONSTRAINT `instructions_equipments_equipment_id`
    FOREIGN KEY (`equipment_id`)
    REFERENCES `mydb`.`equipments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `instructions_equipments_recipe_id_and_number`
    FOREIGN KEY (`recipe_id` , `number`)
    REFERENCES `mydb`.`instructions` (`recipe_id` , `number`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `mydb`.`instructions_ingredients` (
  `ingredient_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `number` INT NOT NULL,
  `amount` INT NOT NULL,
  `amount_type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ingredient_id`, `recipe_id`, `number`),CONSTRAINT `instructions_ingredients_recipe_id_and_number`
    FOREIGN KEY (`recipe_id` , `number`)
    REFERENCES `mydb`.`instructions` (`recipe_id` , `number`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `instructions_ingredients_ingredient_id`
    FOREIGN KEY (`ingredient_id`)
    REFERENCES `mydb`.`ingredients` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
