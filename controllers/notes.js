const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
// const jwt = require('jsonwebtoken')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })

  response.json(notes.map((note) => note.toJSON()))
})

// token authorization
// const getTokenFrom = (request) => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }

notesRouter.post('/', async (request, response) => {
  const body = request.body
  // token authorization

  const token = request.user
  const user = await User.findById(token)

  const addNote = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id,
  })

  if (!body.content) {
    return response.status(400).json({
      error: '`content` is required',
    })
  }

  const savedNote = await addNote.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note.toJSON())
  } else {
    response.status(404).end()
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  const user = request.user

  try {
    const note = await Note.findById(request.params.id)

    if (note.user.toString() === user.toString()) {
      await Note.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(403).json({ error: 'access denied' })
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const user = request.user

  try {
    const note = await Note.findById(request.params.id)

    if (note.user.toString() === user.toString()) {
      const note = {
        content: body.content,
        important: body.important,
        // user: userId,
      }
      const result = await Note.findByIdAndUpdate(request.params.id, note, {
        new: true,
      })
      response.json(result.toJSON())
    }
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
