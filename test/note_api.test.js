const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

// user password schema
const User = require('../models/user')
const Note = require('../models/note')

jest.setTimeout(70000)
// initialization
let globalToken

beforeEach(async () => {
  await Note.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('test', 10)
  const user = new User({ username: 'test', passwordHash })
  await user.save()

  const response = await api
    .post('/api/login')
    .send({ username: 'test', password: 'test' })

  globalToken = `Bearer ${response.body.token}`

  const notes = helper.initialNotes.map(
    (note) => new Note({ ...note, user: user.id })
  )
  await Note.insertMany(notes)
})

// test

describe('content type', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('all notes', () => {
  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body.length).toBe(helper.initialNotes.length)
  })
})

describe('first notes', () => {
  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')

    expect(response.body[0].content).toBe('HTML is easy')
  })
}, 200000)

describe('search for data', () => {
  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map((r) => r.content)
    expect(contents).toContain('Browser can execute only Javascript')
  })
})

// test operation for each route of the API

// 1. add new obj
describe('add first new note.', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }
    console.log('newBlog', newNote, 'globalToken', globalToken)
    await api
      .post('/api/notes')
      .set('Authorization', globalToken)
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map((r) => r.content)
    expect(contents).toContain('async/await simplifies making async calls')
  })
})
// note without content will not be saved
describe('no content test', () => {
  test('Fails with status 400 without content note', async () => {
    // const user = await User.findById(token)
    const newNote = {
      important: true,
    }

    await api
      .post('/api/notes')
      .set('Authorization', globalToken)
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

// retrive one note
describe('view specific note', () => {
  test('successfully viewed specific note', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
  })
})

// updating a note
describe('updating', () => {
  test('Editing a notes', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToUpdate = notesAtStart[0]

    const changeNote = {
      ...noteToUpdate,
      important: false,
    }
    await api
      .put(`/api/notes/${noteToUpdate.id}`)
      .send(changeNote)
      .set('Authorization', globalToken)
      .expect(200)

    const notesAfterUpdate = await helper.notesInDb()

    expect(notesAfterUpdate[0].important).toBe(changeNote.important)
  })
})

// test for removing individual note
describe('deleting individual note', () => {
  test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    const deleteNote = await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .set('Authorization', globalToken)
    expect(deleteNote.status).toBe(204)

    const notesAfterDelete = await helper.notesInDb()
    expect(notesAfterDelete).toHaveLength(notesAtStart.length - 1)
    const contents = notesAfterDelete.map((r) => r.content)
    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
