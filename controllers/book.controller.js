import { Book } from '../models/book.model.js';
import mongoose from 'mongoose';

/******* PUBLIC ROUTES *********/

//TODO: ADD THE SORTING
export const getBooks = async (req, res) => {
     try {
          const { genre, pages, year, rating, search } = req.query;

          let query = {
               ...(genre && { genre }),
               ...(pages && { pages }),
               ...(year && { year }),
               ...(rating && { rating }),
               ...(search && { title: { $regex: search, $options: "i" } })
          }

          const page = Number(req.query.page) || 1;
          const limit = Number(req.query.limit) || 1;
          const skip = (page - 1) * limit;

          const books = await Book.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

          const count = await Book.countDocuments(query);

          if (!books) {
               res.status(404).json({ message: "No books found" });
          }

          const pagination = {
               currentPage: page,
               totalPages: Math.ceil(count / limit),
               totalBooks: count
          }

          res.json({
               books,
               pagination
          })
     } catch (error) {
          res.status(500).json({ error, message: "Internal server error" })
          console.error(error)
     }
}

export const getBookById = async (req, res) => {
     const { id } = req.params
     try {
          const book = await Book.findById(id);
          if (book) {
               res.status(200).json({ message: "Book has been retrieved", book });
          } else {
               res.status(404).json({ message: "Book not found" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal server error" })
          console.error(error)
     }
}

export const getTopRatedBooks = async (req, res) => {
     try {
          const topRatedBooks = await Book.find().sort({ rating: -1 });
          res.status(200).json({ message: "Top rated books have been retrieved", topRatedBooks });

     } catch (error) {
          res.status(500).json({ message: "Internal server error" })
          console.error(error)
     }
}

// TO SUGGEST OTHER BOOKS ON THE BOOK DETAILS PAGE
export const getRandomBooks = async (req, res) => {
     const { genre, id } = req.params;  // Extract genre and id from query parameters

     // Check if the id is a valid ObjectId
     if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid book ID format" });
     }

     try {
          const objectId = new mongoose.Types.ObjectId(id);  // Convert id to ObjectId

          const randomBooks = await Book.aggregate([
               { $match: { genre: genre, _id: { $ne: objectId } } },  // Exclude the book with the provided ObjectId
               { $sample: { size: 4 } }  // Randomly sample 4 books
          ]);

          res.status(200).json({ message: "Random books have been retrieved", randomBooks });
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
}

export const getGenres = async (req, res) => {
     try {
          const genres = await Book.distinct('genre');

          if (!genres.length) {
               return res.json({ message: "No genres found in the database" });
          }

          return res.json({ genres });

     } catch (error) {
          return res.status(500).json({ error, message: "Internal Server Error" });
     }
};

export const getAuthors = async (req, res) => {
     try {
          const authors = await Book.distinct('author');

          if (!authors.length) {
               return res.json({ message: "No author found in the database" });
          }

          return res.json({ authors });

     } catch (error) {
          return res.status(500).json({ error, message: "Internal Server Error" });
     }
};


/*********** ADMIN BOOKS CONTROLLERS *************/

// ADD MANY BOOKS AT ONCE
export const importBooks = async (req, res) => {
     try {
          const books = await Book.insertMany(req.body);
          res.status(201).json({ message: "Books imported successfully", books });
     } catch (error) {
          res.status(500).json({ message: "Internal server error" })
          console.error(error)
     }
}

export const createBook = async (req, res) => {
     const { title, author, description, image, pages, year, originalLanguage, genre, isbn } = req.body;
     if (!title || !author || !description || !pages || !year || !genre || !isbn) {
          return res.status(400).json({ message: "Please fill all the fields" });
     }
     try {
          const book = await Book.findOne({ title });
          if (book) {
               return res.status(400).json({ message: "Book already exists" });
          }

          const newBook = new Book({
               title, author, description, image, pages, year, originalLanguage, genre, isbn
          });
          const createdBook = await newBook.save();
          res.status(201).json({ message: "Book created successfully", createdBook });
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
}

export const updateBook = async (req, res) => {
     const { id } = req.params
     const { title, author, description, image, pages, year, originalLanguage } = req.body;
     try {
          const book = await Book.findById(id);
          if (book) {
               book.title = title || book.title;
               book.author = author || book.author;
               book.description = description || book.description;
               book.image = image || book.image;
               book.pages = pages || book.pages;
               book.year = year || book.year;
               book.originalLanguage = originalLanguage || book.originalLanguage;
               const updatedBook = await book.save();
               res.status(200).json({ message: "Book updated successfully", updatedBook });
          } else {
               res.status(404).json({ message: "Book not found" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal server error" })
          console.error(error)
     }
}

export const deleteBook = async (req, res) => {
     const { id } = req.params
     try {
          const deletedBook = await Book.findByIdAndDelete(id);
          if (deletedBook) {
               res.status(200).json({ deletedBook });
          } else {
               res.status(404).json({ message: "Book not found" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
}

export const deleteAllBooks = async (req, res) => {
     try {
          const deletedBooks = await Book.deleteMany();
          res.status(200).json({ message: "All books deleted successfully", deletedBooks });
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
};

export const deleteManyBooks = async (req, res) => {
     const { ids } = req.body; 

     try {
          const result = await Book.deleteMany({ _id: { $in: ids } });

          if (result.deletedCount === 0) {
               return res.status(404).json({ message: 'No books found to delete' });
          }

          res.json({ message: `${result.deletedCount} books deleted successfully` });
     } catch (error) {
          res.status(500).json({ message: 'Internal Server Error', error });
     }
};