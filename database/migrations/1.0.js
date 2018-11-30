"use strict"
const Promise = require("bluebird")
const sqlite3 = require("sqlite3")
const path = require("path")

module.exports = {
	up: function() {
		return new Promise(function(resolve, reject) {
			let db = new sqlite3.Database('./database/cookingApp.db')
			db.run(`PRAGMA foreign_keys = ON`)
			db.serialize(function() {
				db.run(`CREATE TABLE User (
					userID INTEGER PRIMARY KEY
				)`);
				db.run(`CREATE TABLE Recipe (
					recipeID INTEGER PRIMARY KEY,
					creatorID INTEGER,
					name TEXT,
					description TEXT,
					stars INTEGER,
					created TEXT,
					FOREIGN KEY(creatorID) REFERENCES User(userID)
				)`);
				db.run(`CREATE TABLE SavedRecipe (
					savedRecipeID INTEGER PRIMARY KEY,
					recipeID INTEGER,
					byUser INTEGER,
					FOREIGN KEY(recipeID) REFERENCES Recipe(recipeID),
					FOREIGN KEY(byUser) REFERENCES User(userID)
				)`);
				db.run(`CREATE TABLE RecipeInfo (
					recipeInfoID INTEGER PRIMARY KEY,
					recipeID INTEGER,
					ingredientID INTEGER,
					amount TEXT,
					FOREIGN KEY(recipeID) REFERENCES Recipe(recipeID),
					FOREIGN KEY(ingredientID) REFERENCES Ingredient(ingredientID)
				)`);
				db.run(`CREATE TABLE Ingredient (
					ingredientID INTEGER PRIMARY KEY,
					name TEXT
				)`);
				db.run(`CREATE TABLE RecipeCategory (
					recipeCategoryID INTEGER PRIMARY KEY,
					recipeID INTEGER,
					categoryID INTEGER,
					FOREIGN KEY(recipeID) REFERENCES Recipe(recipeID),
					FOREIGN KEY(categoryID) REFERENCES Category(categoryID)
				)`);
				db.run(`CREATE TABLE Category (
					categoryID INTEGER PRIMARY KEY,
					name TEXT
				)`);
			});
			db.close();
		});
	},
	down: function() {
		return new Promise(function(resolve, reject) {
			let db = new sqlite3.Database('./database/cookingApp.db')
			db.serialize(function() {
				db.run('DROP TABLE IF EXISTS User');
				db.run('DROP TABLE IF EXISTS Recipe');
				db.run('DROP TABLE IF EXISTS SavedRecipe');
				db.run('DROP TABLE IF EXISTS RecipeInfo');
				db.run('DROP TABLE IF EXISTS Ingredient');
				db.run('DROP TABLE IF EXISTS Measurement');
				db.run('DROP TABLE IF EXISTS MeasurementType');
				db.run('DROP TABLE IF EXISTS RecipeCategory');
				db.run('DROP TABLE IF EXISTS Category');
			});
			db.close();
		})
	}
}