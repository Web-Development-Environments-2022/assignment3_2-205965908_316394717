class RecipePage {
    constructor(id,title,readyInMinutes,popularity,vegetarian,vegan,glutenFree,image,inventedBy, serveDay, servings, instructions) {
        this.id = id;
        this.title = title;
        this.readyInMinutes = readyInMinutes;
        this.popularity = popularity;
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

export {RecipePage};