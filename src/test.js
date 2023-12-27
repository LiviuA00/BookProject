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

//route to show update element
router.get('/edit/:id', async (req, res, next) => {
    //console.log(req.params.id);
    
    // bookcollection.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, docs) =>{
    //     if(err) {
    //         console.log("Can't retrive data and edit");
    //     }else{
    //         res.render("edit", {book: docs});
    //     }
    // });  
        
    try {
        const bookId = req.params.id;
        
        // Utilizează findOneAndUpdate cu promisiuni
        const updatedBook = await bookcollection.findOneAndUpdate(
            { _id: bookId },
            req.body,
            { new: true }
        );

        // Verifică dacă a fost găsit și actualizat un document
        if (updatedBook) {
            res.render("edit", { book: updatedBook });
        } else {
            console.log("Can't retrieve data and edit");
            res.status(404).send("Document not found");
        }
    } catch (err) {
        console.error('Eroare la editarea cărții:', err);
        res.status(500).send('Eroare internă a serverului');
    }

});

//route to update element
router.post("/edit/:id", async (req, res, next) => {
    try {
        const bookId = req.params.id;
        
        // Utilizează findByIdAndUpdate cu promisiuni
        const updatedBook = await bookcollection.findByIdAndUpdate(
            bookId,
            req.body,
            { new: true }
        );

        // Verifică dacă a fost găsit și actualizat un document
        if (updatedBook) {
            res.redirect("/test");
        } else {
            console.log("Can't update data");
            res.status(404).send("Document not found");
        }
    } catch (err) {
        console.error('Eroare la actualizarea cărții:', err);
        res.status(500).send('Eroare internă a serverului');
    }
});

//route to delete them
router.get("/delete/:id", async (req, res, next) => {
    try {
        const bookId = req.params.id;

        // Utilizează findByIdAndDelete cu promisiuni
        const deletedBook = await bookcollection.findByIdAndDelete(bookId);

        // Verifică dacă a fost găsit și șters un document
        if (deletedBook) {
            console.log("Deleted successfully.");
            res.redirect("/test");
        } else {
            console.log("Can't delete data");
            res.status(404).send("Document not found");
        }
    } catch (err) {
        console.error('Eroare la ștergerea cărții:', err);
        res.status(500).send('Eroare internă a serverului');
    }
});





module.exports = router;