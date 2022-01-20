const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    _id: '61e8d79d34091000e7e2658d',
    content: 'HTML is easy',
    important: false,
    __v: 0,
  },
  {
    _id: '61e8d79d34091000e7e2658e',
    content: 'Browser can execute only Javascript',
    important: true,
    __v: 0,
  },
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map((note) => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}
