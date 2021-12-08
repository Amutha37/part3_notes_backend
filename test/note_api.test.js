const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  console.log('cleared')
  // new way optimising
  // helper.initialNotes.forEach(async (note) => {
  //   let noteObject = new Note(note)
  //   await noteObject.save()
  // })

  // old way
  // let noteObject = new Note(helper.initialNotes[0])
  // await noteObject.save()

  // noteObject = new Note(helper.initialNotes[1])
  // await noteObject.save()

  // another way
  // await Note.insertMany(helper.initialNotes)

  //Another way with promise all
  const noteObjects = helper.initialNotes.map((note) => new Note(note))
  const promiseArray = noteObjects.map((note) => note.save())
  await Promise.all(promiseArray)
  console.log('done')
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
// test for removing individual note
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

afterAll(() => {
  mongoose.connection.close()
})
