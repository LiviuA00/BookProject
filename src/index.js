const express = require("express");
const testRoute = require('./test');
const path = require("path");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser')
const {collection, bookcollection} = require("./config");
const session = require('express-session');//nou

const app = express();
//convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.use(express.static("public"))



app.use('/test', testRoute);

app.get("/", (req, res) => {
    res.render("login");  
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

//admin/user
app.use(
    session({
      secret: 'secretul-tau',
      resave: false,
      saveUninitialized: true,
    })
  );

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
        res.render("login");
        
    }

});

const verificaPermisiuni = (permisiuneNecesara) => {
    return async (req, res, next) => {
        const utilizator = req.session.user;
        console.log(utilizator);
        if (utilizator && utilizator.role === permisiuneNecesara) {
            next(); // Permisiuni acordate, permite accesul la ruta următoare
        } else {
            res.status(403).json({ mesaj: 'Acces interzis' });
        }
    };
};

//Login admin / user
app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check) {
            res.send("user name not found");
        }
        //compare the hash password from the database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        // if(isPasswordMatch) {
        //     res.render("home");
        // }else {
        //     req.send("wrong password");
        // }
        if (isPasswordMatch) {
            // Verifică dacă utilizatorul este admin și setează informațiile în sesiune
            if (check.role === 'admin') {
                req.session.user = {
                    name: check.name,
                    role: check.role
                };
                bookcollection.find()
                    .then(docs => {
                         res.render("test", { books: docs });
                    })
                    .catch(err => {
                        console.log("Something went wrong with MongoDB (can't retrieve)", err);
                        //res.status(500).send("Internal Server Error");
                    });
                //res.render("test");
                // res.render("home");
                //home
            }else  if (check.role === 'utilizator') {
                req.session.user = {
                    name: check.name,
                    role: check.role
                };
                bookcollection.find()
                    .then(docs => {
                         res.render("testuser", { books: docs });
                    })
                    .catch(err => {
                        console.log("Something went wrong with MongoDB (can't retrieve)", err);
                        //res.status(500).send("Internal Server Error");
                    });
            }
            else {
                res.status(403).json({ mesaj: 'Acces interzis' });
            }
        } else {
            res.send("wrong password");
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
    
    res.render("books");
    //res.send(existingBook);

});




const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})

