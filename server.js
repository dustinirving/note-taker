const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    const notes = JSON.parse(data);
    return res.json(notes);
  });
  // res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.post("/api/notes", function (req, res) {
  // // Generate a random id
  // const characters =
  //   "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?[\\]^_`{|}~";
  // let uniqueId = "";
  // for (let i = 0; i < 10; i++) {
  //   uniqueId =
  //     uniqueId + characters[Math.floor(Math.random() * characters.length)];
  // }
  // //

  let allNotes;
  const newNote = req.body;
  newNote.id = newNote.title;
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    allNotes = JSON.parse(data);
    allNotes.push(newNote);
    fs.writeFile("db/db.json", JSON.stringify(allNotes), function (err) {
      if (err) throw err;
    });
    console.log("Added!");
  });
  res.json(newNote);
});

app.delete("/api/notes/:id", function (req, res) {
  let query = { _id: req.params.id };
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    let allNotes = JSON.parse(data);
    const newNotes = allNotes.filter(function (note) {
      if (note.id !== query._id) {
        console.log(note.id);
        console.log(query._id);
        return note;
      }
    });
    fs.writeFile("db/db.json", JSON.stringify(newNotes), function (err) {
      if (err) throw err;
      return res.json(newNotes);
    });
  });
});

app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
