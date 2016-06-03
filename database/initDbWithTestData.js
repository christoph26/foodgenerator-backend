/**
 * Development script for manual database initialization and data import
 */
'use strict';

const DATA_FOLDER_PATH = "../dummydata/";
const FILE_PATH_INGREDIENT = "Ingredient.json";
const FILE_PATH_RECIPE = "recipe.json";
const FILE_PATH_SUPERMARKET = "supermarket.json";
const FILE_PATH_USER = "user.json";
const FILE_PATH_RECIPEFAMILY = "recipeFamily.json";
const FILE_PATH_INGREDIENTLIST = "IngredientList.json";


var Config = require('../config/config.js');
var UglifyJS = require("uglify-js");
var fs = require('fs');
var mongoose = require('mongoose');

// Load Schema Models
var Ingredient = require('../components/ingredient/ingredientSchema');
var Supermarket = require('../components/supermarket/supermarketSchema');
var Recipe = require('../components/recipe/recipeSchema');
var RecipeFamily = require('../components/recipeFamily/recipeFamilySchema');
var IngredientList = require('../components/ingredientList/ingredientListSchema');


function removeCommentsAndOpen(directoryPath, fileName) {
    var fileContent = fs.readFileSync(directoryPath + fileName, "utf8");
    var abstractSyntaxTree = UglifyJS.parse(fileContent, {filename: fileName});
    var outputStream = UglifyJS.OutputStream({quote_keys: true, semicolons: false});
    abstractSyntaxTree.print(outputStream);
    var code = outputStream.toString();
    return JSON.parse(code);
}

// connect to running mongoDb instance on localhost and default port
mongoose.connect([Config.db.host, '/', Config.db.name].join(''), function (err) {
    if (err)
        console.error(err);
    else {
        console.log("Connected to database at localhost:27017.");
    }

    mongoose.connection.db.dropDatabase(function (err) {
        if (err)
            console.error(err);
        else {
            console.log("Dropped database.");
        }

        console.log("Starting to import entities.");
        // import the supermarket entities
        var supermarkets = removeCommentsAndOpen(DATA_FOLDER_PATH, FILE_PATH_SUPERMARKET);
        Supermarket.insertMany(supermarkets, function (err, result) {
            if (err)
                console.error(err);
            else {
                console.log("Created supermarket entities:");
                console.log(result);
            }


            // import the ingredient entities
            var ingredients = removeCommentsAndOpen(DATA_FOLDER_PATH, FILE_PATH_INGREDIENT);
            Ingredient.insertMany(ingredients, function (err, result) {
                if (err)
                    console.error(err);
                else {
                    console.log("Created ingredient entities:");
                    console.log(result);
                }

                // import the ingredient List entities
                var ingredientLists = removeCommentsAndOpen(DATA_FOLDER_PATH, FILE_PATH_INGREDIENTLIST);
                IngredientList.insertMany(ingredientLists, function (err, result) {
                    if (err)
                        console.error(err);
                    else {
                        console.log("Created ingredienlist entities:");
                        console.log(result);
                    }


                    // import the recipe entities
                    var recipeFamilies = removeCommentsAndOpen(DATA_FOLDER_PATH, FILE_PATH_RECIPEFAMILY);
                    RecipeFamily.insertMany(recipeFamilies, function (err, result) {
                        if (err)
                            console.error(err);
                        else {
                            console.log("Created recipeFamily entities:");
                            console.log(result);
                        }

                        // import the recipe entities
                        var recipes = removeCommentsAndOpen(DATA_FOLDER_PATH, FILE_PATH_RECIPE);
                        Recipe.insertMany(recipes, function (err, result) {
                            if (err)
                                console.error(err);
                            else {
                                console.log("Created recipe entities:");
                                console.log(result);
                            }

                            console.log("Disconnecting...");
                            mongoose.disconnect();
                        });
                    });
                });
            });
        });


    });
});
