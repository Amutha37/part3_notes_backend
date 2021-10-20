const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack_amutha:${password}@cluster0.eqxje.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url);

// GENERATE NEW NOTE DATA IN mongoDB database

// const noteSchema = new mongoose.Schema({
//   content: String,
//   date: Date,
//   important: Boolean,
// });

// const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//   content: "MongoDB made it easy with data collections.",
//   date: new Date(),
//   important: true,
// });

// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

// Fetching objects from the database mongoDB

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

// search only specific database
Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
