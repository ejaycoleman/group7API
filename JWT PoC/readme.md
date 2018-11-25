# get token
## endpoint
localhost:3128/userToken

## headers
userID: "anything"

## returns 
token


# using token
## endpoint
localhost:3128/

## headers
authorization: "Bearer [TOKEN FROM /userToken]"

## returns 
if authorised or not
