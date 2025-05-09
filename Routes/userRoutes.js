const express = require('express');
const router = express.Router();
const  userController = require('../controllers/userController');
// const verifyJWT = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users only by admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */

router.get('/', verifyAdmin, userController.getAllUsers);



/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */

router.post('/', userController.createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID only by admin
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */

router.delete('/:id', verifyAdmin, userController.deleteUser);

//veryfy jwt not realy needed
// router.get('/admin/:email',verifyJWT,  userController.getAdmin);


/**
 * @swagger
 * /users/admin/{id}:
 *   patch:
 *     summary: Promote a user to admin only by admin
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User promoted to admin
 */

router.patch('/admin/:id',verifyAdmin, userController.makeUserAdmin);



module.exports = router;