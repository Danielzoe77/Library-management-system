const express = require('express');
const router = express.Router();
const {
  addBookByAdmin,
  getAllBooksByAdmin,
  deleteBookByAdmin,
  updateBookByAdmin,
  borrowABookByUser,
  returnABookByUser,
  getAllBooksByAUser,
  getAllBorrowedBooksByAdmin
} = require('../controllers/bookController');

const verifyAdmin = require('../middleware/verifyAdmin');
const verifyUser = require('../middleware/verifyUser'); 


/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Admin and User Book Operations
 */


// Admin Routes

/**
 * @swagger
 * /books/admin:
 *   post:
 *     summary: Add a book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               totalCopies:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book added successfully
 */
router.post('/admin', verifyAdmin, addBookByAdmin);


/**
 * @swagger
 * /books/admin:
 *   get:
 *     summary: Get all books (Admin only)
 *     operationId: admin
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/admin', verifyAdmin, getAllBooksByAdmin);


/**
 * @swagger
 * /books/admin/book/{id}:
 *   delete:
 *     summary: Delete a book (Admin only)
 *     operationId: admin_book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */
router.delete('/admin/book/:id', verifyAdmin, deleteBookByAdmin);


/**
 * @swagger
 * /books/admin/book/{id}:
 *   patch:
 *     summary: Update a book (Admin only)
 *     operationId: admin_update_book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 */
router.patch('/admin/book/:id', verifyAdmin, updateBookByAdmin);

/**
 * @swagger
 * /books/admin/borrowed:
 *   get:
 *     summary: Get all borrowed books (Admin only)
 *     operationId: admin_borrowed
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of borrowed books
 */
router.get('/admin/borrowed', verifyAdmin, getAllBorrowedBooksByAdmin);

// User Routes

/**
 * @swagger
 * /books/user/borrow/{bookId}:
 *   post:
 *     summary: Borrow a book (User only)
 *     operationId: user_borrow
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 */
router.post('/user/borrow/:bookId', verifyUser, borrowABookByUser);

/**
 * @swagger
 * /books/user/return/{bookId}:
 *   post:
 *     summary: Return a book (User only)
 *     operationId: user_return
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 */
router.post('/user/return/:bookId', verifyUser, returnABookByUser);

/**
 * @swagger
 * /books/user/borrowed:
 *   get:
 *     summary: Get all books borrowed by the user
 *     operationId: user_borrowed 
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of borrowed books for the user
 */
router.get('/user/borrowed', verifyUser, getAllBooksByAUser);

module.exports = router;
