Base for general use NodeJS projects. It provides a file structure that allows you to quickly start working on a new project.  
It uses [`express`](https://www.npmjs.com/package/express) and [`mongoose`](https://mongoosejs.com/) and implements [Jason Web Token](https://jwt.io/) for user 
authorization. 

It's also secured against:
- DOS Attacks
- XSS Attacks
- NoSQL Injections

## Important
`.env` file must be added
```
ACCESS_TOKEN_SECRET = <TOKEN_STR>
REFRESH_TOKEN_SECRET = <TOKEN_STR>
MONGO_URL = <MONGO_URL>
```

# Folder structure
### db
Contains files representing database structure.  
It cointains [`schemes.js`](db/schemes.js) that implements [`mongoose.Schema`s](https://mongoosejs.com/docs/guide.html). Each `Schema` represents collection in database. Using them in other files allows you to manipulate data in database.  
This base project contains `Schema`s for `Course` (exemplary data) and `RefreshToken` (for JWT) objects.

### loaders
Contains basic configuration for `mongoose` and `express`.  
[`mongoose.js`](loaders/mongoose.js) connects with database based on `MONGO_URL` from `.env` file.  
[`express.js`](loaders/express.js) creates express app and configures basic security and avaibility features.

### services
Contains business logic of API.  
This base project has services for adding, getting, updating and deleting data from `MongoDB` and logging system with `JWT` handling.

### routers
Contains files with endpoints for handling user's `request`s. They're supposed to assign functions from `services`. 

### views
Contains `hbs` files. They're just a more convinient version of html files and are usually meant to be returned by one of endpoints as a `HtmlResponse`.

### public
Contains public rescources. Everything in it can be referenced by frontend (see one of files from `views` folder for a reference).  
This Base project contains `css` and `js` folders.
