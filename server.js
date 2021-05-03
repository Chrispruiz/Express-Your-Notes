const express = require('express');
const path = require("path");
const fs = require("fs");

var PORT = process.env.PORT || 3001;
var app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const dbDir = require("./db/db.json");

// Routes to main HTML page
app.get("/", function(req, res) {
    res.json(path.join(__dirname, "/public/index.html"));
  });

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
  

app.get("/api/notes/:id"), function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("/db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
} 

//making a commet for github to acknowledge changes

// Adds the text 
app.route("/api/notes")
    .get(function (req, res) {
        res.json(dbDir);
    })
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;
        let maxId = 2000;
        
        for (let i = 0; i < dbDir.length; i++) {
            let individualNote = dbDir[i];
            if (individualNote.id > maxId) {
                highestId = individualNote.id;
            }
        }
         
        newNote.id = maxId + 1;
        dbDir.push(newNote)

    
        fs.writeFile(jsonFilePath, JSON.stringify(dbDir), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Note Saved.");
            res.json(dbDir);
        });
    });


// Delete note
app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    
    for (let i = 0; i < dbDir.length; i++) {
        if (dbDir[i].id == req.params.id) {
            dbDir.splice(i, 1);
            break;
        }
    }
    // Clear the db.json file
    fs.writeFileSync(jsonFilePath, JSON.stringify(dbDir), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log("Note successfully deleted.");
        }
    });
    res.json(dbDir);
});

/* app.get('*', function (req, res) {
    const index = path.join(__dirname, '/public/index.html');
    res.sendFile(index);
  }); */

//Makes server live
app.listen(PORT, () => {
    console.log(`API server is now on PORT ${PORT}`);
});