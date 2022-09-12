const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mern-todo");

const itemsSchema = mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemsSchema);

app.get("/all-items", cors(), (req, res) => {
    let items = [];
    Item.find({}, (error, result) => {
        if (!error) {
           result.map(item => items.push({id: item._id, name: item.name}))
           res.send(items);
        } else console.log(error);
    })
})

app.post("/postName", cors(), (req, res) => {
    const newItem = req.body.postName;
    if (newItem.length !== 0) {
        const addItem = new Item({
            name: newItem
        })
        addItem.save();
    }
})

app.delete("/delete/:id", cors(), (req, res) => {
    Item.findByIdAndDelete(req.params.id, (error, item) => {
        if (!error) {
            console.log(item);
        } else console.log(item);
    })
})

app.listen(4000, () => {
    console.log("Server Running successfully");
})