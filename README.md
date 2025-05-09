# 📚 Library Management System API

This is a simple RESTful API for managing a library system built using **Node.js**, **Express.js**, and **MongoDB**. It supports features like user authentication, role-based access (Admin/User), book borrowing/returning, and API documentation with Swagger.

---

## ✨ Features

### 👤 User Features

- User **registration** and **login**
- **JWT token** issued upon successful login
- Users can:
  - Borrow a book (only if copies are available)
  - Return a borrowed book
  - View their own borrowed books

### 👑 Admin Features

- Admins can:
  - Add a new book
  - View all books
  - Update book details
  - Delete a book
  - View all borrowed books across users
  - Promote other users to admin

### 🔐 Authentication

- Token-based authentication using **JWT**
- Admin and user roles enforced via middleware
- Protected routes for sensitive operations

### 📄 Documentation

- Full API documentation available using **Swagger UI**

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository

git clone <https://github.com/Danielzoe77/Library-management-system.git>
cd library-api  

### 2. Install Dependencies

npm install

### 3. Configure Environment Variables

 PORT=3003
MONGO_URI=your_mongo_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret

### 4. Run the Server

npm start
"start": "nodemon index.js"

### 📑 Swagger Documentation

<http://localhost:3003/api-docs>
