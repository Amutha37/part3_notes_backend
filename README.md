# part3_nodejs

fullstackopen part3_nodejs and express (RESTfull Http Api as jason-server)

## part3_nodejs - part3_nodejs-1

Create simple server using node built-in http web server.

Output Listen to port3001

### 1. part3_nodejs

Create file header content-type: html/text print hardcoded response.end .

### 2. part3_nodejs-1

Create file header content-type: 'Content-Type': 'application/json' print hardcoded response.end json format.

## node-EXPRESS

### part3_nodejs-2

Install node express and nodemon.

> npm install express
> npm install --save-dev nodemon
> {
> // ..
> "scripts": {

    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"

},
// ..
}

> npm run dev

### part3_nodejs-3

.Use parameter id from route to pass to application to find the data.
.Implement error status code 404 for data not found

### part3_nodejs-4

.Delete data using id
.Install' plugin VS code REST Client for on board API data view.

.Run server Request in REST Clent editor `Get http://localhost:3001/api/notes/2`

### part3_nodejs-5

.Add new note.
.Auto generate header content-type: with the help of json-parser / app.use(express.json()).
.Retrive data from body property of the request object.

.Create hard code data object to add new note.

.Heroku app

![Screen Shot 2021-09-29 at 9 38 19 am](https://user-images.githubusercontent.com/67087939/135179688-418d6de5-57e4-494f-96ea-1323bd4491a7.png)

.Heroku express api/notes

![Screen Shot 2021-09-29 at 9 40 18 am](https://user-images.githubusercontent.com/67087939/135179832-abc61a32-c748-422d-a88d-3f5071bfbdfb.png)

.Heroku express frontend build and backend

![Screen Shot 2021-09-29 at 9 42 25 am](https://user-images.githubusercontent.com/67087939/135179969-db4f5d80-3379-4a0c-a0f2-6b8a6e259528.png)

.Front end proxy to backend localhost:3001/api/notes

![Screen Shot 2021-09-29 at 9 41 58 am](https://user-images.githubusercontent.com/67087939/135179934-c1f9a573-8827-4ada-ad86-7b8cedb1fe6e.png)

- heroku app for beckend
  `https://afternoon-plateau-39207.herokuapp.com/`

- Create new production build on the frontend and make a copy to backend.

- push the changes to heroku
  > `git push heroku main`

* To run heroku with mongoDB
  > `heroku config:set MONGODB_URI=mongodb+srv://fullstack_amutha:(secretpassword)@cluster0.eqxje.mongodb.net/note-app?retryWrites=true&w=majority`

If it causes error. set apostrophes for the MONGODB_URI's value.

- view the database in heroku
  `https://afternoon-plateau-39207.herokuapp.com/`

Part 4

- Establish file structure for separate responsibilities of the application into separate module

File structure of this backend project before separating the app into different modules : -
![Screen Shot 2021-11-04 at 2 13 46 pm](https://user-images.githubusercontent.com/67087939/140251907-a09f6885-747d-4b5b-a2d2-9995559c1c0a.png)

File structure of this backend project after separating the app into different modules : -
![Screen Shot 2021-11-04 at 2 13 06 pm](https://user-images.githubusercontent.com/67087939/140251849-0fddbb3f-98b7-4952-8684-22a8703d8af6.png)

### Testing Node applications

> `npm install --save-dev jest`

Edit npm npm scripts test : -
Execute tests with Jest and to report about the test execution with the verbose style:

"test": "jest --verbose"

Jest requires one to specify that the execution environment is Node. This can be done by adding the following to the end of package.json:

"jest": {
"testEnvironment": "node"
}

- Using `integration testing` where there are multiple components of the system being tested.

1. Define the execution mode of the application with the NODE_ENV environment variable

{
// ...
"scripts": {
"start": "NODE_ENV=production node index.js",
"dev": "NODE_ENV=development nodemon index.js",
"build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
"deploy": "git push heroku master",
"deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
"logs:prod": "heroku logs --tail",
"lint": "eslint .",
"test": "NODE_ENV=test jest --verbose --runInBand"
},
// ...
}

There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the cross-env package as a development dependency with the command:

> `npm install --save-dev cross-env`

- Edit config.js and .env file

const MONGODB_URI = process.env.NODE_ENV === 'test'
? process.env.TEST_MONGODB_URI
: process.env.MONGODB_URI

TEST_MONGODB_URI=" "

### Supertest

Install supertest package to help us write our tests for testing the API.

Install the package as a development dependency:

> `npm install --save-dev supertest`

Import supertest in test file.

const supertest = require('supertest')

### To run individual test file : -

run test file :

> `npm test -- test/note_api.test.js`

### run specific test name or describe block name

- test name

  > `npm test -- -t "a specific note is within the returned notes"`

- test describtion
  > `npm test -- -t 'notes'`

### Eliminating the try-catch

The express-async-errors library has solution for this.

> `npm install express-async-errors`

Import the library in `app.js`

`require('express-async-errors')`

1. The 'magic' of the library allows us to eliminate the try-catch blocks completely.
2. The library handles everything under the hood.
3. If an exception(error) occurs in a async route, the execution is automatically passed to the error handling middleware.

### Optimizing the beforeEach function

Using `promise.all`

1. Promise.all executes the promises it receives in parallel.
2. In order for the promises to be executed in a particular order, the operation can be executed inside of a for...of block that executed in specific order.

3. Promise.all executes the promises it receives in parallel.
4. In order for the promises to be executed in a particular order, the operation can be executed inside of a for...of block that executed in specific order.

The Promise.all method can be used for transforming an array of promises into a single promise, that will be fulfilled once every promise in the array passed to it as a parameter is resolved. The last line of code await Promise.all(promiseArray) waits that every promise for saving a note is finished, meaning that the database has been initialized.

The returned values of each promise in the array can still be accessed when using the Promise.all method. If we wait for the promises to be resolved with the await syntax const results = await `Promise.all(promiseArray)`, the operation will return an array that contains the resolved values for each promise in the promiseArray, and they appear in the same order as the promises in the array.

`Promise.all` executes the promises it receives in parallel. If the promises need to be executed in a particular order, this will be problematic. In situations like this, the operations can be executed inside of a `for...of` block, that guarantees a specific execution order.

beforeEach(async () => {
await Note.deleteMany({})

for (let note of helper.initialNotes) {
let noteObject = new Note(note)
await noteObject.save()
}
})

![Screen Shot 2021-11-23 at 10 28 06 am](https://user-images.githubusercontent.com/67087939/142950043-acd4f7d8-8a26-4550-9350-123c89540404.png)

# User administration

- This is task using MongoDB document database.

To create user password hash install :

> `npm install bcrypt`

Mongoose does not have a built-in validator for checking the uniqueness of a field. In order to have a unique username we install ready-made solutions from mongoose-unique-validator npm pakage.

> `npm install mongoose-unique-validator`

# Creating a new note with the user is who create it.

# Implement the functionality for loggin in.

> `npm instal jsonwebtoken`

Create code for the function in `controllers/login.js`.

The process for the new note is : -

1. Create user
2. Create token
3. Create new note with token from step 2.
