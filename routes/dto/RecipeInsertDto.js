class RecipeInsertDto {
    constructor(title, readyInMinutes, vegetarian, vegan, glutenFree, image, inventedBy, serveDay, servings, instructions) {
        this.title = title;
        this.readyInMinutes = readyInMinutes;
        this.vegetarian = vegetarian;
        this.vegan = vegan;
        this.glutenFree = glutenFree;
        this.image = image;
        this.inventedBy = inventedBy;
        this.serveDay = serveDay;
        this.servings = servings;
        this.instructions = instructions;
    }
}

module.exports = RecipeInsertDto;