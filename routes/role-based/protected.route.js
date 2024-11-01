import express from 'express';
import * as listController from '../../controllers/list.controller.js';
import * as reviewController from '../../controllers/reviews.controller.js';
import { protect } from '../../middleware/auth.js';

const protectedRouter = express.Router();
protectedRouter.use(protect);

// ******* USER ROUTES ******** 
router.put("/user/",  userController.updateUserProfile);
router.delete("/user/",  userController.deleteUserProfile);
router.put("/user/password", userController.changeUserPassword);

// ******* REVIEW ROUTES ******** 
router.get("/review/:bookId", reviewController.getAllBookReviews);
router.post("/review/:bookId", reviewController.createBookReview);
router.put("/review/:reviewId", reviewController.updateBookReview);
router.delete("/review/:reviewId",reviewController.deleteReview);

// ******* LISTS ROUTES ********
protectedRouter.post("/list/", listController.createList)
protectedRouter.delete("/list/",listController.deleteList)
protectedRouter.get("/list/", listController.getListsFromUser)
protectedRouter.get("/list/published",  listController.getPublicLists)

protectedRouter.get("/list/listItems", listController.getBooksFromList)
protectedRouter.post("/list/listItems",  listController.addBookToList)
protectedRouter.delete("/list/listItems", listController.deleteBookFromList)

export default protectedRouter