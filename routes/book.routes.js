const express = require('express');
const router = express.Router();

const Book = require('../models/Book.model');




// GET /books
router.get("/books", (req, res, next) => {

    Book.find()
        .then( (booksFromDB) => {

            const data = {
                books: booksFromDB
            }

            res.render("books/books-list", data);
        })
        .catch( e => {
            console.log("error getting list of books from DB", e);
            next(e);
        });

});

router.get("/books/:booksId", (req, res, next) => {
  Book.findById(req.params.booksId)
    .then((booksFromDB) => {
      const data = {
        books: booksFromDB
        
      }
      res.render("books/books-details", booksFromDB)
     
    })
    .catch((e) => {
      console.log("error getting list of books from DB", e);
      next(e);
    });
});







module.exports = router
