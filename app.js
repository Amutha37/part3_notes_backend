const express = require('express')
const cors = require('cors')
require('express-async-errors')
const app = express()
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
// mongoDB atlas
const mongoose = require('mongoose')
logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
//  jason-parser to access data to dd new notes in the request body in JSON format.
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
