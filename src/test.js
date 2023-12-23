const express = require('express');
const router = express.Router();
const {collection, bookcollection} = require("./config");
// const {collection, bookcollection} = require("./config");
// router.get('/', (req, res, next) => {
//     res.send('Express router is working');
// });

router.get("/", (req, res, next) => {
    bookcollection.find()
        .then(docs => {
            res.render("test", { books: docs });
        })
        .catch(err => {
            console.log("Something went wrong with MongoDB (can't retrieve)", err);
            //res.status(500).send("Internal Server Error");
        });
});

router.post('/add', async (req, res, next) => {
   
    const title =  req.body.title;
    const author = req.body.author;
    const review =  req.body.review;

    console.log(title, author, review);

    //Dupa video:
    // const insertBook = new bookcollection ({
    //     title,
    //     author,
    //     review
    // });

    // insertBook.save((err) => {
    //     if(err){
    //         console.log("Something went wrong while saving data to database");
    //     }else{
    //         console.log("Data is recorder sucesfully!");
    //     }
    // });

    //Dupa mine:
    const dataBook = {
        title,
        author,
        review
    }
    //check if book already exists in db
    const existingBook = await bookcollection.findOne({title: dataBook.title});
    if(existingBook) {
        res.send("Book title already exists. Please choose a different title.");
    }else {  
        const admindata = await bookcollection.insertMany(dataBook);
        console.log(admindata);
        console.log("Data is recorder sucesfully!");
        res.redirect('/test');
    }

    //res.render("test");

});

module.exports = router;