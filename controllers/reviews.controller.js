import { Review } from "../models/review.model.js";
import { Book } from "../models/book.model.js";

export const getAllBookReviews = async (req, res) => {
     const { bookId } = req.params;
     try {
          const page = Number(req.query.pageNumber) || 1;
          const limit = Number(req.query.limit) || 5;
          const skip = (page - 1) * limit;

          const reviews = await Review
               .find({ bookId })
               .sort({ createdAt: -1 })
               .skip(skip)
               .limit(limit);

          const count = await Review.countDocuments({ bookId });

          if (reviews) {
               res.json({
                    message: "All reviews have been retrieved",
                    reviews,
                    page,
                    pages: Math.ceil(count / limit),
                    totalReviews: count
               })
          }
          else {
               res.status(404).json({ message: "No reviews found" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
}

export const createBookReview = async (req, res) => {
     const { bookId } = req.params;
     const { rating, comment } = req.body;
     const user = req.user;

     try {
          // Find the book by ID
          const book = await Book.findById(bookId);
          if (!book) {
               return res.status(404).json({ message: "Book not found" });
          }

          // Check if the user has already reviewed the book
          const existingReview = await Review.findOne({ userId: user._id, bookId });
          if (existingReview) {
               return res.status(400).json({ message: "You have already reviewed this book" });
          }

          // Create a new review
          const newReview = new Review({
               userId: user._id,
               userName: user.fullName,
               rating,
               comment,
               bookId
          });

          // Save the new review
          await newReview.save();

          // Calculate the new average rating
          const reviews = await Review.find({ bookId });
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRating / reviews.length;

          // Update the book with the new average rating and number of reviews
          book.rating = averageRating;
          book.numberOfReviews = reviews.length;
          await book.save();

          res.status(201).json({
               message: "Review created successfully",
               review: newReview
          });

     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
};

export const updateBookReview = async (req, res) => {
     const { reviewId } = req.params
     const user = req.user
     const { rating, comment } = req.body
     try {
          const review = await Review.findOne({ userId: user._id, _id: reviewId });
          if (!review) {
               return res.status(404).json({ message: "Review not found" });
          }

          // Update the review
          await Review.updateOne({ userId: user._id, _id: reviewId }, req.body);

          // Calculate the new average rating
          const reviews = await Review.find({ bookId: review.bookId });
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRating / reviews.length;

          // Update the book with the new average rating and number of reviews
          const book = await Book.findById(review.bookId);
          book.rating = averageRating;
          book.numberOfReviews = reviews.length;
          await book.save();

          res.status(200).json({ message: "Review updated successfully" });

     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
}

export const deleteReview = async (req, res) => {
     const { reviewId } = req.params;
     const user = req.user;
     try {
          const review = await Review.findOne({ userId: user._id, _id: reviewId });
          if (!review) {
               return res.status(404).json({ message: "Review not found" });
          }

          // Delete the review
          await Review.deleteOne({ userId: user._id, _id: reviewId });

          // Calculate the new average rating
          const reviews = await Review.find({ bookId: review.bookId });
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRating / reviews.length;

          // Update the book with the new average rating and number of reviews
          const book = await Book.findById(review.bookId);
          book.rating = averageRating || 0;
          book.numberOfReviews = reviews.length;
          await book.save();

          res.status(200).json({ message: "Review deleted successfully" });

     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
}