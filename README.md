# user
* create user
	* POST https://platr.herokuapp.com/user
		+ body:
			{userID}		

* get user
	* GET /user/[userID]
		- token returned

		
# recipe
* create recipe 
	* POST https://platr.herokuapp.com/recipe
		body:
			{name, method}
		header:
			{Bearer: [token from /user/[userID]]}
			
* get all recipes
	* GET https://platr.herokuapp.com/recipe
		body:
			{amount (OPTIONAL), offset (OPTIONAL)}
		header:
			{Bearer: [token from /user/[userID]]}
			
* get info about one recipe
	* GET https://platr.herokuapp.com/recipe/[recipeID]

* add ingredient to recipe
	* POST https://platr.herokuapp.com/recipe/[recipeID]/ingredient
		body:
			{ name, amount }
		header:
			{Bearer: [token from /user/[userID]]}

* save recipe
	* POST https://platr.herokuapp.com/recipe/[recipeID]/save
		header:
			{Bearer: [token from /user/[userID]]}

* add category to recipe
	POST https://platr.herokuapp.com/recipe/[recipeID]/category
		body:
			{ name }
		header:
			{Bearer: [token from /user/[userID]]}

# general
* get all categories
	* GET https://platr.herokuapp.com/general/categories
		body:
			{amount (OPTIONAL), offset (OPTIONAL)}
		header:
			{Bearer: [token from /user/[userID]]}
