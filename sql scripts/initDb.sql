CREATE SCHEMA `mydb` ;

CREATE TABLE `mydb`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `country` VARCHAR(45) NULL,
  `password` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

  CREATE TABLE `mydb`.`recipes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `image_path` VARCHAR(45) NULL,
  `title` VARCHAR(45) NULL,
  `making_time` INT NULL,
  `is_vegetarian` TINYINT NULL,
  `is_vegan` TINYINT NULL,
  `is_gluten_free` TINYINT NULL,
  PRIMARY KEY (`id`));

  CREATE TABLE `mydb`.`likes` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `recipe_id`),
  CONSTRAINT `likes_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `likes_recipe_id`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `mydb`.`recipes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `mydb`.`views` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `recipe_id`),
  CONSTRAINT `views_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `views_recipe_id`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `mydb`.`recipes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `mydb`.`favorites` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `recipe_id`),
  CONSTRAINT `favorites_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `favorites_recipe_id`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `mydb`.`recipes` (`id`)
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
