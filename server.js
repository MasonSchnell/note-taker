const { v4: uuidv4 } = require("uuid");
const express = require("express");
const notes = require("./Develop/db/db.json");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.use(express.static("./Develop/public"));

app.get("/api/notes", (clientRequestObj, serverResponseObj) => {
    serverResponseObj.json(notes);
});

// Handles deleting the displayed notes
app.delete("/api/notes/:index", (clientRequestObj, serverResponseObj) => {
    const index = clientRequestObj.params.index;
    const obj = notes.find((funObj) => funObj.id === index);
    const item = notes.indexOf(obj);
    notes.splice(item, 1);
    const jNotes = JSON.stringify(notes);

    fs.writeFile("./Develop/db/db.json", jNotes, (err) => {
        if (err) {
            return serverResponseObj
                .status(500)
                .send("Error writing to file:", err);
        } else {
            console.log("Data deleted and file updated.");
            return serverResponseObj.status(204).end();
        }
    });
});

// app.get("/api/notes", (clientRequestObj, serverResponseObj) => {
//     serverResponseObj.json(notes);
// });

// Handles adding to json file
app.post("/api/notes", (clientRequestObj, serverResponseObj) => {
    const note = clientRequestObj.body;

    const newNote = {
        id: uuidv4(),
        title: note.title,
        text: note.text,
    };

    notes.push(newNote);
    const newNotes = JSON.stringify(notes);

    fs.writeFile("./Develop/db/db.json", newNotes, (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return serverResponseObj
                .status(500)
                .send("Error creating resource");
        } else {
            console.log("Data updated and saved to file.");
            serverResponseObj
                .status(201)
                .location(`/api/notes/${newNote.id}`)
                .json(newNote);
        }
    });
});

app.listen(3334, () => console.log("server started on port 3334"));
