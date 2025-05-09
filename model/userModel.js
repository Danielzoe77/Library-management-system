const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    trim: true,
    minLength: 3,
    required: true,
  },
  password: {
    type: String,
    required: [true, "please add a password"],
    minLength: [8, "password should be at least 8 characters"],
    maxLength: [15, "password should not be more than 15 characters"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
      "Password should contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    ],
    select: false,
  },
  photoURL: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  //encrypt password b4 saving to db
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(this.password, salt);
  this.password = hashpassword;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
