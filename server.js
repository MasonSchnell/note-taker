const express = require("express");
const notes = require("./Develop/db/db.json");
const fs = require("fs");
// const path = require("path");
const app = express();

// app.use(express.static("assets"));

app.use(express.static("./Develop/public"));

app.get("/api/notes", (clientRequestObj, serverResponseObj) => {
    serverResponseObj.json(notes);
});

app.get("/api/notes/:index", (clientRequestObj, serverResponseObj) => {
    const index = clientRequestObj.params.index;
    console.log(index);
    const obj = notes.find((funObj) => funObj.id === index);
    console.log(obj);
    serverResponseObj.send(obj);
});

app.delete("/api/notes/:index", (clientRequestObj, serverResponseObj) => {
    const index = clientRequestObj.params.index;
    const obj = notes.find((funObj) => funObj.id === index);
    const item = notes.indexOf(obj);
    console.log(obj.id);
    notes.splice(item, 1);
    const jNotes = JSON.stringify(notes);

    fs.writeFile("./Develop/db/db.json", jNotes, (err) => {
        if (err) {
            console.error("Error writing to file:", err);
        } else {
            console.log("Data updated and saved to file.");
        }
    });
});

app.listen(3334, () => console.log("server started on port 3334"));
