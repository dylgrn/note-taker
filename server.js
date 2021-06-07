const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 80;
const public = path.join(__dirname, '/public');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(public, "notes.html"));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));
})

app.post('/api/notes', (req, res) => {
    let sNote = JSON.parse(fs.readFileSync("./db/db.json"));
    let nNote = req.body;
    let nId = (sNote.length).toString();
    nNote.id = nId;
    sNote.push(nNote)
    fs.writeFileSync("./db/db.json", JSON.stringify(sNote));
    res.json(sNote);
})

app.post("/api/notes/:id", (req, res)=> {
    let sNote = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(sNote[Number(req.params.id)]);
})

app.delete("/api/notes/:id", (req, res)=> {
    let sNote = JSON.parse(fs.readFileSync("./db/db.json"));
    let thisId = req.params.id;
    let nId = 0;
    sNote = sNote.filter(thisNote => {
        return thisNote.id != thisId;
    })
    for (thisNote of sNote) {
        thisNote.id = nId.toString();
        nId++;
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(sNote));
    res.json(sNote);
})

app.listen(PORT)