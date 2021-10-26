const express = require("express");
const app = express();
const cors = require("cors");
// mongoDB atlas
// BEFORE models folder
// const mongoose = require("mongoose");
require("dotenv").config();
const Note = require("./models/note");

//  jason-parser to access data to dd new notes in the request body in JSON format.
app.use(express.json());
app.use(express.static("build"));
app.use(cors());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  // console.log("Header:  ", request.headers);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

// const url = process.env.MONGODB_URI;
// const url = `mongodb+srv://fullstack_amutha:fullstackamutha@cluster0.eqxje.mongodb.net/note-app?retryWrites=true&w=majority`;
// console.log("connecting to", url);

// mongoose
//   .connect(url)
//   .then((result) => {
//     console.log("connected to MongoDB");
//   })
//   .catch((error) => {
//     console.log("error connecting to MongoDB:", error.message);
//   });

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false,
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true,
//   },
// ];
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
// fetch notes from mongoDB

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// add new data
// BEFORE mongoDB
// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

app.post("/api/notes", (request, response) => {
  const body = request.body;
  // with mongoDB
  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });

  // before mongoDB
  // if (!body.content) {
  //   return response.status(400).json({
  //     error: "content missing",
  //   });
  // }

  // const note = {
  //   content: body.content,
  //   important: body.important || false,
  //   date: new Date(),
  //   id: generateId(),
  // };

  // notes = notes.concat(note);
  // console.log(notes);
  // response.json(notes);
});

// check for individual id to load from the url to code to filter
app.get("/api/notes/:id", (request, response) => {
  // with mongoDB
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
  // .catch((error) => {
  //   console.log(error);
  //   response.status(400).end({ error: "malformatted id" });
  // });

  // before mongoDB
  // const id = Number(request.params.id);
  // const note = notes.find((note) => note.id === id);

  // if (note) {
  //   response.json(note);
  // } else {
  //   response.status(404).end();
  // }
});
// update database
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// deleting data
app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));

  //   const id = Number(request.params.id);
  //   notes = notes.filter((note) => note.id !== id);

  //   response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);
// before mongo env
// const PORT = process.env.PORT || 3001;

// with mongoDB env
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
