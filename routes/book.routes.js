const express = require("express");
const router = express.Router();

const Book = require("../models/Book.model");
const Author = require("../models/Author.model");

// GET /books
router.get("/books", (req, res, next) => {
  Book.find()
    .populate("author")
    .then((booksFromDB) => {
      const data = {
        books: booksFromDB,
      };

      res.render("books/books-list", data);
    })
    .catch((e) => {
      console.log("error getting list of books from DB", e);
      next(e);
    });
});

router.get("/books/create", (req, res, next) => {
  res.render("books/book-create");
});

router.post("/books/create", (req, res, next) => {
  const newBook = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    rating: req.body.rating,
  };

  Book.create(newBook)
    .then((newBook) => {
      res.send("your book was created sir");
    })
    .catch((e) => {
      console.log("error creating new book", e);
      next(e);
    });
  res.redirect("/books");
});

router.get("/books/:booksId", (req, res, next) => {
  Book.findById(req.params.booksId)
    .populate("author")
    .then((booksFromDB) => {
      const data = {
        books: booksFromDB,
      };
      res.render("books/books-details", booksFromDB);
    })
    .catch((e) => {
      console.log("error getting list of books from DB", e);
      next(e);
    });
});

// router.get("/books/:bookId", (req, res, next) => {
//   const id = req.params.bookId;

//   Book.findById(id)
//       .then( bookFromDB => {
//           res.render("books/book-details", bookFromDB);
//       })
//       .catch( e => {
//           console.log("error getting book details from DB", e);
//           next(e);
//       });
// });

router.get("/books/:bookId/edit", (req, res, next) => {
  const { bookId } = req.params;

  Book.findById(bookId)
    .populate("author")
    .then((bookToEdit) => {
      // console.log(bookToEdit);
      res.render("books/book-edit.hbs", { book: bookToEdit });
    })
    .catch((error) => next(error));
});

router.post("/books/:bookId/edit", (req, res, next) => {
  const { bookId } = req.params;
  const { title, description, author, rating } = req.body;

  Book.findByIdAndUpdate(
    bookId,
    { title, description, author, rating },
    { new: true }
  )
    .then((updatedBook) => res.redirect(`/books/${updatedBook.id}`))
    .catch((error) => next(error));
});

router.post("/books/:bookId/delete", (req, res, next) => {
  const { bookId } = req.params;

  Book.findByIdAndDelete(bookId)
    .then(() => res.redirect("/books"))
    .catch((error) => next(error));
});

module.exports = router;
