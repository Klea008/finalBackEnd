import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     fullName: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     isAdmin: { type: Boolean, required: true, default: false },
     image: { type: String }
}, { timestamps: true });

export default mongoose.model("User", userSchema);