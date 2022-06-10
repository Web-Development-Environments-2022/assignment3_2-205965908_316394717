class RecipeInsertDto {
    constructor(id,title,readyInMinutes,vegetarian,vegan,glutenFree, servings,image,inventedBy, serveDay, instructions) {
        this.id = id;
        this.title = title;
        this.readyInMinutes = readyInMinutes;
        this.vegetarian = vegetarian;
        this.vegan = vegan;
        this.glutenFree = glutenFree;
        this.servings = servings;
        this.image = image;
        this.inventedBy = inventedBy;
        this.serveDay = serveDay;
        this.instructions = instructions;
    }
}

export {RecipeInsertDto};