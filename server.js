const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

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
    if (data === "") {
      data = "[]";
      fs.writeFile("db/db.json", data, function (err) {
        if (err) throw err;
      });
    }
    const addIdtoNotes = JSON.parse(data).map(function (note) {
      if (!note.hasOwnProperty("id")) {
        note.id = uuid.v4();
      }
      return note;
    });
    fs.writeFile("db/db.json", JSON.stringify(addIdtoNotes), function (err) {
      if (err) throw err;
    });

    return res.json(addIdtoNotes);
  });
});

app.post("/api/notes", function (req, res) {
  let allNotes;
  const newNote = req.body;
  newNote.id = uuid.v4();
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
