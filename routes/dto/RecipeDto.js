class RecipeDto {
    constructor(id, title, readyInMinutes, popularity, vegetarian, vegan, glutenFree, hasViewed, isFavorite,
                image, inventedBy, serveDay, servings, ingredients, equipments, instructions) {
        this.id = id;
        this.title = title;
        this.readyInMinutes = readyInMinutes;
        this.popularity = popularity;
        this.vegetarian = vegetarian;
        this.vegan = vegan;
        this.glutenFree = glutenFree;
        this.hasViewed = hasViewed;
        this.isFavorite = isFavorite;
        this.image = image;
        this.inventedBy = inventedBy;
        this.serveDay = serveDay;
        this.servings = servings;
        this.ingredients = ingredients;
        this.equipments = equipments;
        this.instructions = instructions;
    }
}

module.exports = RecipeDto;