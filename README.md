### part3_nodejs

fullstackopen part3_nodejs and express (RESTfull Http Api as jason-server)

## part3_nodejs - part3_nodejs-1

Create simple server using node built-in http web server.

Output Listen to port3001

# 1. part3_nodejs

Create file header content-type: html/text print hardcoded response.end .

# 2. part3_nodejs-1

Create file header content-type: 'Content-Type': 'application/json' print hardcoded response.end json format.

## node-EXPRESS

# part3_nodejs-2

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

# part3_nodejs-3

.Use parameter id from route to pass to application to find the data.
.Implement error status code 404 for data not found

# part3_nodejs-4

.Delete data using id
.Install' plugin VS code REST Client for on board API data view.
.Run server Request in REST Clent editor `Get http://localhost:3001/api/notes`

# part3_nodejs-5

.Add new note.
.Auto generate header content-type: with the help of json-parser / app.use(express.json()).
.Retrive data from body property of the request object.

.Create hard code data object to add new note.
