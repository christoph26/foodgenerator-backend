/**
 * Development script for manual database initialization and data import
 */

const DATA_FOLDER_PATH = "../dummydata/";
const FILE_PATH_INGREDIENT = "Ingredient.json";
const FILE_PATH_RECIPE = "recipe.json";
const FILE_PATH_SUPERMARKET = "supermarket.json";
const FILE_PATH_USER = "user.json";

var UglifyJS = require("uglify-js");
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

function removeCommentsAndOpen(directoryPath, fileName) {
    var fileContent = fs.readFileSync(directoryPath + fileName, "utf8");
    var abstractSyntaxTree = UglifyJS.parse(fileContent, {filename: fileName});
    var outputStream = UglifyJS.OutputStream({quote_keys: true, semicolons: false});
    abstractSyntaxTree.print(outputStream);
    var code = outputStream.toString();
    return JSON.parse(code);
}

// connect to running mongoDb instance on localhost and default port
console.log("Connecting to database at localhost:27017...");
MongoClient.connect("mongodb://localhost:27017/foodgeneratorDb", function (err, db) {
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

    console.log("Starting to import entities.");
    // import the supermarket entities
    var supermarkets = removeCommentsAndOpen(DATA_FOLDER_PATH, FILE_PATH_SUPERMARKET);
    var result = db.collection("supermarkets").insertMany(supermarkets);
    console.log(result);

    // import the ingredient entities
    var ingredients = removeCommentsAndOpen(DATA_FOLDER_PATH, FILE_PATH_INGREDIENT);
    result = db.collection("ingredients").insertMany(ingredients);
    console.log(result);

    // import the recipe entities
    var recipes = removeCommentsAndOpen(DATA_FOLDER_PATH, FILE_PATH_RECIPE);
    result = db.collection("recipes").insertMany(recipes);
    console.log(result);

    // // import the recipe family entities
    // var recipeFamilies = removeCommentsAndOpen(DATA_FOLDER_PATH, FILE_PATH_RECIPE_FAMILY);
    // result = db.collection("recipefamilies").insertMany(recipeFamilies);
    // console.log(result);
    
    // signalize success
    db.close();
    console.log("All tasks executed without errors.");
});

