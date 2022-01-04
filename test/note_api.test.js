const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Note = require('../models/note')

// user password schema
const bcrypt = require('bcrypt')
const User = require('../models/user')

// initialization
describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
  }, 100000)

  // test

  describe('content type', () => {
    test('notes are returned as json', async () => {
      await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    }, 100000)
  })

  describe('all notes', () => {
    test('all notes are returned', async () => {
      const response = await api.get('/api/notes')

      expect(response.body).toHaveLength(helper.initialNotes.length)
    })
  }, 200000)

  describe('first notes', () => {
    test('the first note is about HTTP methods', async () => {
      const response = await api.get('/api/notes')

      expect(response.body[0].content).toBe('HTML is easy')
    })
  }, 2000000)

  describe('search for data', () => {
    test('a specific note is within the returned notes', async () => {
      const response = await api.get('/api/notes')

      const contents = response.body.map((r) => r.content)
      expect(contents).toContain('Browser can execute only Javascript')
    })
  }, 100000)

  // test operation for each route of the API
  // 1. add new obj
  describe('add first new note.', () => {
    test('a valid note can be added', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

      const contents = notesAtEnd.map((r) => r.content)
      expect(contents).toContain('async/await simplifies making async calls')
    })
  })
  // note without content will not be saved
  describe('no content test', () => {
    test('note without content is not added', async () => {
      const newNote = {
        important: true,
      }

      await api.post('/api/notes').send(newNote).expect(400)

      const notesAtEnd = await helper.notesInDb()

      expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })
  }, 100000)
  // Test for insuffiecient data/data invalid with status code 400
  describe('Content missing response with 400 Bad Request', () => {
    test('Fails with status 400 if data invalid', async () => {
      const newNote = {
        important: true,
      }

      await api.post('/api/notes').send(newNote).expect(400)

      const notesAtEnd = await helper.notesInDb()
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })
  })
  // retrive one note
  describe('view specific note', () => {
    test('successfully viewed specific note', async () => {
      // const response = await api.get('/api/notes')
      const notesAtStart = await helper.notesInDb()

      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

      expect(resultNote.body).toEqual(processedNoteToView)
    })
  }, 100000)
  // test for removing individual blog
  describe('deleting individual note', () => {
    test('a note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

      const notesAtEnd = await helper.notesInDb()

      expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

      const contents = notesAtEnd.map((r) => r.content)

      expect(contents).not.toContain(noteToDelete.content)
    })
  })
})

//  Test note for user password authentication

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'AMutha',
      name: 'Amutha Muhunthan',
      password: 'narracan',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
