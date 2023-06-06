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
  Author.find()
    .then((authorsFromDB) => {
      res.render("books/book-create", { authorsArr: authorsFromDB });
    })
    .catch((e) => {
      console.log("error displaying book create form", e);
      next(e);
    });
});

// CREATE: process form
router.post("/books/create", (req, res, next) => {
  const newBook = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    rating: req.body.rating,
  };

  Book.create(newBook)
    .then((newBook) => {
      res.redirect("/books");
    })
    .catch((e) => {
      console.log("error creating new book", e);
      next(e);
    });
});

router.get("/books/:booksId", (req, res, next) => {
  Book.findById(req.params.booksId)
  Author.find()
  .then()
  Book.findById(bookId)
  .catch()

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

router.get('/books/:bookId/edit', async (req, res, next) => {
  const { bookId } = req.params;

  try {
      const authors = await Author.find();
      const bookDetails = await Book.findById(bookId);

      res.render('books/book-edit.hbs', { book: bookDetails, authors: authors });

  } catch (e) {
      next(e);
  }

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
