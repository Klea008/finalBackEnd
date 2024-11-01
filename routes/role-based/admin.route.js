import express from 'express';
import * as booksController from '../../controllers/book.controller.js';
import * as userController from '../../controllers/user.controller.js';
import { protect, admin } from '../../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.use(protect, admin);

// ******* USER FEATURES ******** 
adminRouter.get("/user/", userController.getUsers)
adminRouter.delete("/user/:id", userController.deleteUser)

// ******* BOOK FEATURES ******** 
adminRouter.put("/books/:id", booksController.updateBook)
adminRouter.delete("/books/:id", booksController.deleteBook)
adminRouter.delete("/books/", booksController.deleteAllBooks)
adminRouter.post("/books/",  booksController.createBook)
adminRouter.post("/books/import", booksController.importBooks)

export default adminRouter;