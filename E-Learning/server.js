const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(__dirname));

app.use(session({
    secret: "",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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
const multerFilter = (req, file, callback) => {
    if (file.mimetype.split("/")[1] === "pdf" ||
        file.mimetype.split("/")[1] === "png" ||
        file.mimetype.split("/")[1] === "jpg" ||
        file.mimetype.split("/")[1] === "jpeg"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Invalid File type!!"), false);
    }
};

const upload = multer({ storage: Storage, fileFilter: multerFilter })

const booksSchema = mongoose.Schema({
    title: String,
    type: String,
    description: String,
    coverPic: { data: String, contentType: String },
    file: { data: String, contentType: String }
})

const personSchema = new mongoose.Schema({
    email: String,
    password: String,
    likedBooks: [String],
    bookmarks: [String]
})

personSchema.plugin(passportLocalMongoose);
personSchema.plugin(findOrCreate);

const Book = mongoose.model("Book", booksSchema);
const Person = mongoose.model("Person", personSchema);

passport.use(Person.createStrategy());

passport.serializeUser((user, done) => { done(null, user.id) });

passport.deserializeUser((id, done) => {
    Person.findById(id, (error, user) => { done(error, user) });
});

app.get("/", (req, res) => { res.render("Landing-pg") })

app.get("/login", (req, res) => { res.render("login") })

app.get("/sign-up", (req, res) => { res.render("sign-up") })

app.get("/about", (req, res) => { res.render("about") })

app.get("/contact", (req, res) => { res.render("contact") })

app.get("/upload", (req, res) => { res.render("upload") })

app.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        Book.find({}, (error, result) => {
            if (!error) {
                res.render("home", {book: result})
            } else console.log(error);
        })
    } else res.redirect('/login')
})

app.post("/upload", upload.fields([{ name: "coverPic" }, { name: "bookFile" }]) ,(req, res) => {
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
    const file = path.join(__dirname, `/uploads/${ req.params.fileName }`)
    res.download(file);
})

app.get("/likebook/:bookID", (req, res) => {
    Person.findById(req.user.id, (error, foundUser) => {
        if (error) console.log(error);
        else {
            if (!foundUser.likedBooks.includes(req.params.bookID)) {
                foundUser.likedBooks.push(req.params.bookID);
            } else foundUser.likedBooks.remove(req.params.bookID);
            foundUser.save(() => { res.redirect("/home") });
        }
    })
})

app.get("/:categoryName", (req, res) => {
    Book.find({ type: req.params.categoryName }, (error, result) => {
        if (!error) {
            res.render("home", { book: result })
        } else console.log(error);
    })
})

app.post("/register", (req, res) => {
    Person.register({username: req.body.username}, req.body.password, (error, person) => {
        if (error) {
            console.log(error);
            res.redirect('/sign-up')
        } else passport.authenticate('local')(req, res, () => { res.redirect('/home') });
    })
});

app.post('/login', (req, res) => {
    const user = new Person({ username: req.body.username, password: req.body.password });
    req.logIn(user, (error) => {
        if (error) {
            console.log(error);
            res.redirect('/login');
        }
        else passport.authenticate('local')(req, res, () => { res.redirect('/home') });
    })
});

app.get('/user/logout', (req, res) => {
    req.logOut((error) => {
        if (error) console.log(error);
        res.redirect("/");
    });
})

app.listen(3000, () => {
    console.log("Server is runing");
})