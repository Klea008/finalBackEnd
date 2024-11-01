import { List } from "../models/list.model.js";

export const getPublicLists = async (req, res) => {
     try {
          const lists = await List.find({ visibility: 'public' });
          res.status(200).json({ lists });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const getListsFromUser = async (req, res) => {
     const user = req.user;
     try {
          const lists = await List.find({ userId: user._id });
          res.status(200).json({ lists });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const getListsFromUserParams = async (req, res) => {
     const { userId } = req.params;
     try {
          const lists = await List.find({ userId: userId });
          res.status(200).json({ lists });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const fetchListItemsById = async (req, res) => {
     const { listId } = req.params;
     try {
          const lists = await List.findById(listId);
          res.status(200).json({ lists });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const deleteList = async (req, res) => {
     const user = req.user;
     const { listName } = req.body;
     try {
          const list = await List.findOne({ name: listName, userId: user._id });
          if (!list) {
               return res.status(404).json({ message: "List not found", list });
          }

          if (listName === "favourites" || listName === "reading" || listName === "read" || listName === "to read") {
               return res.status(400).json({ message: "You can't delete this list" });
          }
          const deletedList = await List.findOneAndDelete({ name: listName, userId: user._id });
          res.status(200).json({ message: "List deleted successfully", deletedList });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const createList = async (req, res) => {
     const user = req.user;
     const { name, description, visibility } = req.body;
     try {
          const existingList = await List.findOne({ name, userId: user._id });
          if (existingList) {
               return res.status(400).json({ message: "List already exists" });
          }
          const list = await List.create({ name, userId: user._id, description, visibility });
          res.status(201).json({ message: "List created successfully", list });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

// ********* BOOKS IN LISTS *********

export const getBooksFromList = async (req, res) => {
     const user = req.user;
     const { listId } = req.body;
     try {
          const list = await List.findOne({ _id: listId, userId: user._id });
          res.status(200).json({ list });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const getFavouritesBooks = async (req, res) => {
     const user = req.user;
     try {
          const list = await List.findOne({ name: "favourites", userId: user._id });
          res.status(200).json({ list });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const getReadBooks = async (req, res) => {
     const user = req.user;
     try {
          const list = await List.findOne({ name: "read", userId: user._id });
          res.status(200).json({ list });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const getBookmarks = async (req, res) => {
     const user = req.user;
     try {
          const list = await List.findOne({ name: "to read", userId: user._id });
          res.status(200).json({ list });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const addBookToList = async (req, res) => {
     const user = req.user;
     const { bookId, listName } = req.body;

     try {
          // Check if the book is already in the list
          const isAdded = await List.findOne({ name: listName, userId: user._id, books: bookId });
          if (isAdded) {
               return res.status(400).json({ message: "Book already added to this list" });
          }

          // Add the book to the list
          const addition = await List.findOneAndUpdate(
               { name: listName, userId: user._id },
               { $push: { books: bookId } },
               { new: true }
          );

          res.status(200).json({
               message: "Book added to List successfully",
               list: addition
          });

     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const deleteBookFromList = async (req, res) => {
     const user = req.user;
     const { bookId, listName } = req.body;

     try {
          // Check if the book is already in the list
          const isDeleted = await List.findOne({ name: listName, userId: user._id, books: bookId });
          if (!isDeleted) {
               return res.status(400).json({ message: "Book not found in this list" });
          }

          // Delete the book from the list
          const deletion = await List.findOneAndUpdate(
               { name: listName, userId: user._id },
               { $pull: { books: bookId } },
               { new: true }
          );

          res.status(200).json({
               message: "Book deleted from List successfully",
               list: deletion
          });

     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const likeList = async (req, res) => {
     const user = req.user; 
     const { listId } = req.params;

     try {
          const list = await List.findOne({ _id: listId, visibility: 'public' });

          if (!list) {
               return res.status(404).json({ message: "List not found" });
          }

          if (list.userId.toString() === user._id.toString()) {
               return res.status(400).json({ message: "You cannot like your own list" });
          }

          if (list.likes.includes(user._id)) {
               return res.status(400).json({ message: "You have already liked this list" });
          }

          // Add the user to the list's likes
          list.likes.push(user._id);
          list.likesCount += 1;

          await list.save();

          res.status(200).json({ message: "List liked successfully", likesCount: list.likesCount });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
};

export const unlikeList = async (req, res) => {
     const user = req.user; 
     const { listId } = req.params;

     try {
          const list = await List.findOne({ _id: listId });

          if (!list) {
               return res.status(404).json({ message: "List not found" });
          }

          if (!list.likes.includes(user._id)) {
               return res.status(400).json({ message: "You have not liked this list" });
          }

          list.likes = list.likes.filter(id => id.toString() !== user._id.toString());
          list.likesCount -= 1;

          await list.save();

          res.status(200).json({ message: "List unliked successfully", likesCount: list.likesCount });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.error(error);
     }
};    