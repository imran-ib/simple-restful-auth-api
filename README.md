# Simple Restful Api for User Registration 

A simple user authentication with node express and mongodb . 

**libraries used**

`bcrypt`for hashing the password 

`jsonwebtoken`  for storing user session 

`mongoose ` mongodb ORM

## Set up Database 

in `.evn` change 

`DATABASE=mongodb://localhost:27017/test`

**Note**

*After setting up database ,  `.env` file should be added to `.gitignore` file*

## Usage

To Run Server 

`yarn run server`

# Api End Points

## Registration 

`http:localhost:3002/api/user/register`

Takes `req.body` and saves it to database

## Authenticated User

`http:localhost:3002/api/user/auth`

If User is authenticated it will give you followings.

`isAdmin ` :  Boolean 
`isAuth `: Boolean 
``firstName`: String
`lastName` : String
`fullName`  : String

## Login 

`http:localhost:3002/api/user/login`

After checking the password it will creates a token and save is as cookie 

## 	Logout 	

`http:localhost:3002/api/user/logout`

Removes the tokens 
