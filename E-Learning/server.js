const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(__dirname));

mongoose.connect("mongodb://localhost:27017/book-app");

// define storage for the files
const Storage = multer.diskStorage({
    // destination for files
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname + "/uploads/"))
        //callback(null, "./uploads")
    },
    // add back the extension
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({ storage: Storage })

const booksSchema = mongoose.Schema({
    title: String,
    type: String,
    description: String,
    coverPic: Buffer,
    file: Buffer
})

const Book = mongoose.model("Book", booksSchema);

app.get("/", (req, res) => {
    res.render("Landing-pg");
})

app.get("/home", (req, res) => {
    Book.find({}, (error, result) => {
        if (!error) {
            res.render("Home", {book: result[0]})
        } else console.log(error);
    })
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/contact", (req, res) => {
    res.render("contact")
})

app.get("/upload", (req, res) => {
    res.render("upload")
})

app.post("/upload", upload.fields([{name: "coverPic"}, {name: "bookFile"}]) ,(req, res) => {
    const book = new Book({
        title: req.body.title,
        type: req.body.category,
        description: req.body.description,
        coverPic: fs.readFileSync(path.join(__dirname + "/uploads/") + req.body.coverPic),
        file: fs.readFileSync(path.join(__dirname + "/uploads/") + req.body.bookFile)
    })
    book.save(() => { res.redirect("/home") });
})

app.get("/download", (req, res) => {
    const file = "D:/Visual Studio/Reactjs/E-Learning/views/Fundamentals_of_Computer_Programming_wit.pdf";
    res.download(file);
})
app.listen(3000, () => {
    console.log("Server is runing");
})