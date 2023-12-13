const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const {collection, bookcollection} = require("./config");


const app = express();
//convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

//Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    //check if user already exists in db
    const existingUser = await collection.findOne({name: data.name});
    if(existingUser) {
        res.send("User name already exists. Please choose a different user name.");
    }else {
        //hash password in db
        const saltRounds = 10; //number of salt round for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; //replace the hash password with original password

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

});

//Login user
app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check) {
            res.send("user name not found");
        }
        //compare the hash password from the database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch) {
            res.render("home");
        }else {
            req.send("wrong password");
        }
    }catch {
        res.send("wrong details");
    }
})

//Insert Book
app.post("/addbook", async (req, res) => {
    
    const dataBook = {
        title: req.body.booktitle,
        author: req.body.author,
        review: req.body.review
    }

    //check if book already exists in db
    const existingBook = await bookcollection.findOne({title: dataBook.title});
    if(existingBook) {
        res.send("Book title already exists. Please choose a different title.");
    }else {
        
        const admindata = await bookcollection.insertMany(dataBook);
        console.log(admindata);
    }

});

//Show Books
app.get("/books", async (req, res) => {
    const existingBook = await bookcollection.findOne({});
    res.send(existingBook);
    res.render("books");

});





const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})