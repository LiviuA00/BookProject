const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://0.0.0.0/BookProject");

connect.then(() => {
    console.log("Database connected Successfully");
})
.catch((error) => {
    console.error("Database cannot be connected:", error);
});


const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//model
const collection = new mongoose.model("users", LoginSchema);

//module.exports = collection;


const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    }
});

const bookcollection = new mongoose.model("books", BookSchema);

module.exports = {
    collection: collection,
    bookcollection: bookcollection,
};