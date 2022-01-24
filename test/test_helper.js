const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    _id: '61e8d79d34091000e7e2658d',
    content: 'HTML is easy',
    important: false,
    user: '61e5151101a959d72d6fb2f4',
    __v: 0,
  },
  {
    _id: '61e8d79d34091000e7e2658e',
    content: 'Browser can execute only Javascript',
    important: true,
    user: '61e664b542ec71b7ce62c34f',
    __v: 0,
  },
]

const initialUsers = [
  {
    _id: '61e516b61860663d817931ee',
    username: 'Harrison',
    name: 'Karyn Robert',
    passwordHas: '123456',
    notes: '61e8d79d34091000e7e2658d',
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
// const hashpass = (user) => {
//   const saltRounds = 1
//   const passwordHash = bcrypt.hashSync(user.password, saltRounds)

//   const resultPassword = new User({
//     username: user.username,
//     name: user.name,
//     passwordHash,
//   })

//   const savedUser = resultPassword.save()
//   return savedUser
// }

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  // hashpass,
  initialUsers,
}
