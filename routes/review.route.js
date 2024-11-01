import express from 'express';
import * as reviewController from '../controllers/reviews.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ******* PRIVATE ROUTES ******** ONLY FOR LOGGED IN USERS
router.get("/:bookId",  reviewController.getAllBookReviews);
router.post("/:bookId", protect, reviewController.createBookReview);
router.put("/:reviewId", protect, reviewController.updateBookReview);
router.delete("/:reviewId", protect, reviewController.deleteReview);

export default router