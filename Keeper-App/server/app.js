const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mern-keeperApp");

const noteSchema = mongoose.Schema({
    title: String,
    content: String
})

const Note = mongoose.model("Note", noteSchema);

app.get("/getNotes", cors(), (req, res) => {
    Note.find({}, (error, result) => {
        if (!error) {
            res.send(result)
        } else console.log(error);
    })
})

app.post("/postNote", cors(), (req, res) => {
    const noteTitle = req.body.note.title;
    const noteContent = req.body.note.content;
    if (noteTitle.length !== 0 && noteContent.length !== 0) {
        const newNote = new Note({
            title: noteTitle,
            content: noteContent
        })
        newNote.save();
    }
})

app.delete("/delete/:noteID", cors(), (req, res) => {
    Note.findByIdAndDelete(req.params.noteID, (error, note) => {
        if (!error) {
            console.log(note);
        } else console.log(error);
    })
})

app.listen(4000, () => {
    console.log("Server Running successfully...");
})