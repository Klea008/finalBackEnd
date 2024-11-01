import express from 'express';
import * as booksController from '../../controllers/book.controller.js';
import * as userController from '../../controllers/user.controller.js';

const publicRouter = express.Router();

// ******* USER ROUTES ********
publicRouter.post("/user/", userController.registerUser)
publicRouter.post("/user/login", userController.loginUser)
publicRouter.get("/user/logout", userController.logout)

// ******* BOOK ROUTES ********
publicRouter.get("/book/", booksController.getBooks);
publicRouter.get("/book/:id", booksController.getBookById);
publicRouter.get("/book/rated/top", booksController.getTopRatedBooks)
publicRouter.get("/book/random/all", booksController.getRandomBooks);

export default publicRouter;