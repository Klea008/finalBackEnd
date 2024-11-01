import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
     title: { type: String, required: true },
     author: { type: String, required: true },
     description: { type: String, required: true },
     pages: { type: Number, required: true },
     image: { type: String, required: true, default: "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
     genre: { type: String, required: true },
     year: { type: Number, required: true },
     originalLanguage: { type: String },
     isbn: { type: String, required: true },
     numberOfReviews: { type: Number, default: 0 },
     rating: { type: Number, default: 0 },
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

export { Book }