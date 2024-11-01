import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     visibility: { type: String, required: true, default: 'private', enum: ['private', 'public'] },
     name: { type: String, required: true, unique: true },
     description: { type: String },
     books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the list
     likesCount: { type: Number, default: 0 } // Total number of likes
}, { timestamps: true });

const List = mongoose.model("List", listSchema);

export { List };
