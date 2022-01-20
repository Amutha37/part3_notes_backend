const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const jwt = require('jsonwebtoken')

const api = supertest(app)

// user password schema
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Note = require('../models/note')
// const { request } = require('express')

// initialization
let token

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'Amutha',
      password: passwordHash,
    })

    await user.save()

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    token = jwt.sign(userForToken, process.env.SECRET)
    const notes = helper.initialNotes.map(
      (blog) => new Note({ ...blog, user: user.id })
    )
    await Note.insertMany(notes)
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
  }, 200000)

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
        .set('Authorization', `bearer ${token}`)
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

      const response = await api
        .post('/api/notes')
        .send(newNote)
        .set('Authorization', `bearer ${token}`)
      // .expect(400)
      expect(response.status).toBe(400)

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

  // updating a note
  describe('updating', () => {
    test('a blog may be edited by issuing http put request', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToUpdate = notesAtStart[1]

      const changeNote = {
        content: 'Browser to be edited.',
        important: false,
      }

      // const noteChanged = 'Browser to be edited. '
      const idNote = noteToUpdate.id.toString()
      console.log(idNote, noteToUpdate.id)
      await api
        .put(`/api/blogs/.${noteToUpdate.id}`)
        .send(changeNote)
        .set('Authorization', `bearer ${token}`)
      const newResult = await api.get(`/api/blogs/${noteToUpdate.id}`)
      console.log('newresult', newResult.body.content, changeNote.content)
      expect(newResult.body.content).toBe(changeNote.content)
    })
  })
  // adding without token
  describe('adding note without token', () => {
    test('cannot add note without a valid token', async () => {
      const newNote = {
        content: 'Cannot add note without token authorization.',
        important: true,
      }

      const response = await api
        .post('/api/blogs')
        .send(newNote)
        .set('Authorization', 'bearer without token')

      expect(response.status).toBe(401)
    })
  })

  // test for removing individual blog
  describe('deleting individual note', () => {
    test('a note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      const deleteBlog = await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
      expect(deleteBlog.status).toBe(204)

      const notesAtEnd = await helper.notesInDb()
      expect(notesAtEnd).toHaveLength(notesAtStart.length - 1)
      const contents = notesAtEnd.map((r) => r.content)
      expect(contents).not.toContain(noteToDelete.content)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
