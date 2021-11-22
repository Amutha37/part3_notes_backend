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
