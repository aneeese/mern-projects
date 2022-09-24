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
        callback(null, path.join(__dirname, "/uploads/"))
    },
    // add back the extension
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

// Multer Filter
const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "pdf" ||
        file.mimetype.split("/")[1] === "png" ||
        file.mimetype.split("/")[1] === "jpg" ||
        file.mimetype.split("/")[1] === "jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid File type!!"), false);
    }
};

const upload = multer({ storage: Storage, fileFilter: multerFilter })

const booksSchema = mongoose.Schema({
    title: String,
    type: String,
    description: String,
    coverPic: {data: String, contentType: String},
    file: {data: String, contentType: String}
})

const Book = mongoose.model("Book", booksSchema);

app.get("/", (req, res) => {
    res.render("Landing-pg");
})

app.get("/home", (req, res) => {
    Book.find({}, (error, result) => {
        if (!error) {
            res.render("Home", {book: result})
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
        coverPic: { data: req.files.coverPic[0].originalname, contentType: req.files.coverPic[0].mimetype },
        file: { data: req.files.bookFile[0].originalname, contentType: req.files.bookFile[0].mimetype }
    })
    book.save(() => { res.redirect("/home") });
})

app.get("/download/:fileName", (req, res) => {
    const file = path.join(__dirname, `/uploads/${req.params.fileName}`)
    res.download(file);
})
app.listen(3000, () => {
    console.log("Server is runing");
})