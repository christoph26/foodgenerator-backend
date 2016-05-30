/**
 * Development script for manual database initialization and data import
 */

// connect to running mongoDb instance on localhost and default port
var mongoClient = require('mongodb').MongoClient;
console.log("Connecting to database at localhost:27017...");
mongoClient.connect("mongodb://localhost:27017/foodgeneratorDb", function (err, db) {
    // in case of error, print it to console and exit
    if (err) {
        return console.dir(err);
    }

    // delete the database before recreating it
    db.dropDatabase();
    console.log("Old data deleted.");

    // create the empty collections
    db.createCollection("ingredients");
    db.createCollection("recipes");
    db.createCollection("recipefamilies");
    db.createCollection("supermarkets");
    console.log("Collections created.");

    // import the supermarket entities
    var testSupermarket = {
        titel: "Testtitel",
        icon: "test_link_to_pic"
    };
    var result = db.supermarkets.insert(testSupermarket);
    console.log(result);

    // import the ingredient entities
    var testIngredient = {
        title: "Testtitel",
        supermarket: ["Testsupermarkt1", "Testsupermarkt2"],
        picture: "relative_path_to_pic"
    };
    result = db.ingredients.insert(testIngredient);
    console.log(result);

    // import the recipe entities
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
    console.log(result);

    // import the recipe family entities
    var testRecipeFamily = {
        defaultrecipe: {}
    };
    result = db.recipefamilies.insert(testRecipeFamily);
    console.log(result);

    // signalize success
    console.log("All tasks executed without errors.");
});
