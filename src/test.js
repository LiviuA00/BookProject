const express = require('express');
const router = express.Router();
// const {collection, bookcollection} = require("./config");
// router.get('/', (req, res, next) => {
//     res.send('Express router is working');
// });

router.get("/", (req, res, next) => {
    res.render("test");
   
});

router.post('/add', (req, res, next) => {
   
    const title =  req.body.title;
    const author = req.body.author;
    const review =  req.body.review;

    console.log(title, author, review);
    res.render("test");

});

module.exports = router;