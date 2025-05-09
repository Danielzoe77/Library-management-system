const Book = require("../model/bookModel");
const User = require("../model/userModel");

// Admin: Add a book
const addBookByAdmin = async (req, res) => {
  console.log("addBookByAdmin called");

  try {
    const { title, author, isbn, image, totalCopies } = req.body;

    // Ensure a valid number of total copies
    if (totalCopies <= 0) {
      return res
        .status(400)
        .json({ message: "Total copies must be at least 1" });
    }

    // Create the new book with availableCopies initialized to totalCopies
    const newBook = new Book({
      title,
      author,
      isbn,
      image,
      availableCopies: totalCopies,
      totalCopies: totalCopies,
    });

    await newBook.save();

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (err) {
    res.status(500).json({ message: "Error adding book", error: err.message });
  }
};

// Admin: Get all books
const getAllBooksByAdmin = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

// Admin: Delete a book
const deleteBookByAdmin = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book does not exist" });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: err.message });
  }
};

// Admin: Update a book
const updateBookByAdmin = async (req, res) => {
  try {
    const { title, author, availableCopies, totalCopies } = req.body;

    const bookId = req.params.id;
    const existingBook = await Book.findById(bookId);

    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check for duplicate title + author (excluding current book)
    if (title && author) {
      const duplicate = await Book.findOne({
        title,
        author,
        _id: { $ne: bookId },
      });
      if (duplicate) {
        return res
          .status(400)
          .json({
            message: "A book with the same title and author already exists",
          });
      }
    }

    // Use either new values or existing values to validate copy logic
    const newTotalCopies =
      totalCopies !== undefined ? totalCopies : existingBook.totalCopies;
    const newAvailableCopies =
      availableCopies !== undefined
        ? availableCopies
        : existingBook.availableCopies;

    if (newAvailableCopies > newTotalCopies) {
      return res
        .status(400)
        .json({ message: "Available copies cannot exceed total copies" });
    }

    // Proceed with the update
    const updated = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
    });

    res.status(200).json({ message: "Book updated", book: updated });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating book", error: err.message });
  }
};

// User: Borrow a book
const borrowABookByUser = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res
        .status(400)
        .json({ message: "No available copies of the book" });
    }

    // Prevent logic error: availableCopies must never exceed totalCopies
    if (book.availableCopies > book.totalCopies) {
      return res.status(400).json({
        message:
          "Invalid book state: available copies exceed total copies. Please contact admin.",
      });
    }

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    const user = await User.findById(req.user._id);
    user.borrowedBooks.push(book._id);
    await user.save();

    res.status(200).json({ message: "Book borrowed successfully", book });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error borrowing book", error: err.message });
  }
};

// User: Return a book
const returnABookByUser = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }

    const user = await User.findById(req.user._id);

    // Check if the book is in the user's borrowedBooks
    const hasBorrowed = user.borrowedBooks.includes(book._id);
    if (!hasBorrowed) {
      return res
        .status(400)
        .json({
          message: "You have not borrowed this book or already returned it",
        });
    }

    // Increase available copies
    book.availableCopies += 1;
    await book.save();

    // Remove the book from user's borrowedBooks
    user.borrowedBooks.pull(book._id);
    await user.save();

    res.status(200).json({ message: "Book returned successfully", book });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error returning book", error: err.message });
  }
};

// User: Get all books they borrowed
const getAllBooksByAUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "borrowedBooks",
      select: "-totalCopies -availableCopies -__v",
    });

    res.status(200).json({ borrowedBooks: user.borrowedBooks });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user books" });
  }
};

// Admin: Get all borrowed books across all users
const getAllBorrowedBooksByAdmin = async (req, res) => {
  try {
    const users = await User.find({
      borrowedBooks: { $exists: true, $not: { $size: 0 } },
    }).populate("borrowedBooks", "-__v"); // Optionally exclude __v field

    // Map each borrowed book with the user email who borrowed it
    const borrowedWithUser = users.flatMap((user) =>
      user.borrowedBooks.map((book) => ({
        book,
        borrowedBy: user.email,
      }))
    );

    res.status(200).json({ borrowedBooks: borrowedWithUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching borrowed books" });
  }
};

module.exports = {
  addBookByAdmin,
  getAllBooksByAdmin,
  deleteBookByAdmin,
  updateBookByAdmin,
  borrowABookByUser,
  returnABookByUser,
  getAllBooksByAUser,
  getAllBorrowedBooksByAdmin,
};
