/**
 * Created by christoph on 29.05.16.
 */

//Connect to running mongoDb instance on localhost and default port
conn = new Mongo();
db = conn.getDB("foodgeneratorDb");
var result;

//delete all data
//db.getCollectionNames().forEach(
//    function(collection_name) {
//        db[collection_name].remove({})
//    }
//);
db.dropDatabase();
print("Data deleted.");


//create collections
db.createCollection("ingredients");
db.createCollection("recipes");
db.createCollection("recipefamilies");
db.createCollection("supermarkets");
print("Collections created.");

var testIngredient = {
    title: "Testtitel",
    supermarket: ["Testsupermarkt1", "Testsupermarkt2"],
    picture: "relative_path_to_pic"
};
var testIngredient = function(){

}
result = db.ingredients.insert(testIngredient);
print(result);

var testRecipe = {
    title: "Testtitle",
    skill: 2,
    description: "Testdescription",
    vegan: false,
    vegetarian: true,
    ingredientlist: {
        amount: [],
        ingredient: []
    },
    recipeFamily: {}
};
result = db.recipes.insert(testRecipe);
print(result);

var testRecipeFamily = {
    defaultrecipe: {}
};
result = db.recipefamilies.insert(testRecipeFamily);
print(result);

var testSupermarket = {
    titel: "Testtitel",
    icon: "test_link_to_pic"
};
result = db.supermarkets.insert(testSupermarket);
print(result);