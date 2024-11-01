import express from 'express';
import * as listController from '../controllers/list.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ******* PRIVATE ROUTES ******** ONLY FOR LOGGED IN USERS
router.post("/", protect, listController.createList)

router.delete("/", protect, listController.deleteList)
router.get("/", protect, listController.getListsFromUser)
router.get("/published/lists", listController.getPublicLists)

router.get("/listItems", protect, listController.getBooksFromList)
router.post("/listItems", protect, listController.addBookToList)
router.delete("/listItems", protect, listController.deleteBookFromList)

router.get("/listItems/:listId", protect, listController.fetchListItemsById)
router.get("/favourites", protect, listController.getFavouritesBooks)
router.get("/read", protect, listController.getReadBooks)
router.get("/bookmarks", protect, listController.getBookmarks)

router.put("/:listId/like", protect, listController.likeList);
router.put("/:listId/unlike", protect, listController.unlikeList);

export default router