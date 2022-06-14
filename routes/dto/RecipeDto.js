class RecipeDto {
    constructor(id, title, readyInMinutes, popularity, vegetarian, vegan, glutenFree, hasViewed, isFavorite, servings,
                image, inventedBy, serveDay, instructions) {
        this.id = id;
        this.title = title;
        this.readyInMinutes = readyInMinutes;
        this.popularity = popularity;
        this.vegetarian = vegetarian;
        this.vegan = vegan;
        this.glutenFree = glutenFree;
        this.hasViewed = hasViewed;
        this.isFavorite = isFavorite;
        this.servings = servings;
        this.image = image;
        this.inventedBy = inventedBy;
        this.serveDay = serveDay;
        this.instructions = instructions;
    }
}

// exports.RecipeDto = RecipeDto;
module.exports = RecipeDto;