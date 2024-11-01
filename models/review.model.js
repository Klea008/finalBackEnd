import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
     bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
     userName: { type: String, required: true },
     userImage: { type: String },
     rating: { type: Number, required: true },
     comment: { type: String }
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);

export { Review } 