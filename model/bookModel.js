const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please enter a title"],
      minLength: [3, "Title should be at least 3 characters"],
    },
    author: String,
    image: String, // Image URL or filename
    isbn: String,
    availableCopies: {
      type: Number,
      default: 1,
      min: [0, "Available copies cannot be negative"],
    },
    totalCopies: {
      type: Number,
      required: true,
      min: [1, "Total copies must be at least 1"],
    },
  },
  { timestamps: true }
);

// Hook to automatically set availableCopies to 0 when totalCopies is 1
bookSchema.pre("save", function (next) {
  if (this.totalCopies === 1) {
    this.availableCopies = 0; // Make sure no copies are available when totalCopies is 1
  }
  next();
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
