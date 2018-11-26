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