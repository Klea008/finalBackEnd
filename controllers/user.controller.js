import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import { List } from "../models/list.model.js";

export const registerUser = async (req, res) => {
     const { fullName, email, password } = req.body;
     try {
          const userExists = await User.findOne({ email });
          if (userExists) {
               return res.status(400).json({ message: "User already exists" });
          }

          //hash password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const user = await User.create({
               fullName, email, password: hashedPassword, isAdmin: false,
          });

          // Create default lists
          const defaultLists = [
               { name: 'read', userId: user._id, description: "The books you have read", visibility: 'private', books: [] },
               { name: 'to read', userId: user._id, description: "The books you have to read", visibility: 'private', books: [] },
               { name: 'reading', userId: user._id, description: "The books you are currently reading", visibility: 'private', books: [] },
               { name: 'favourites', userId: user._id, description: "The books you have liked the most", visibility: 'private', books: [] }
          ];
          await List.insertMany(defaultLists);

          res.status(201).json({ message: "User created successfully", user });
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
};

export const loginUser = async (req, res) => {
     const { email, password } = req.body;
     try {
          const user = await User.findOne({ email });
          if (!user || !(await bcrypt.compare(password, user.password))) {
               return res.status(400).json({ message: "Invalid credentials" });
          } else {
               const token = generateToken(user);
               res
                    .cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' })
                    .status(200)
                    .json({ message: "Login successful", token, user });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
}

export const logout = (req, res) => {
     res
          .clearCookie('token')
          .status(200)
          .json({ message: "Logout successful" });
}

export const getUserProfile = async (req, res) => {
     try {
          const user = req.user;
          if (user) {
               res.status(200).json({ user });
          }
          else {
               res.status(404).json({ message: "User not found" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const updateUserProfile = async (req, res) => {
     const { fullName, email, password, isAdmin } = req.body;
     try {
          const user = req.user;
          if (user) {
               user.fullName = fullName || user.fullName;
               user.email = email || user.email;
               if (password) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    user.password = hashedPassword;
               }
               user.isAdmin = isAdmin || user.isAdmin;
               const updatedUser = await user.save();
               res.status(200).json({ message: "User updated successfully", user: updatedUser });
          }
          else {
               res.status(404).json({ message: "User not found" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const deleteUserProfile = async (req, res) => {
     try {
          const user = req.user;
          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          // Delete user's lists
          const lists = await List.find({ userId: user._id });
          for (const list of lists) {
               await List.findByIdAndDelete(list._id);
          }
          await User.findByIdAndDelete(user._id);
          res.status(200).json({ message: "User deleted successfully" });
          console.log(user);
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const changeUserPassword = async (req, res) => {
     const { oldPassword, newPassword } = req.body;
     try {
          const user = req.user;
          if (user) {
               const isMatch = await bcrypt.compare(oldPassword, user.password);
               if (isMatch) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(newPassword, salt);
                    user.password = hashedPassword;
                    const updatedUser = await user.save();
                    res.status(200).json({ message: "Password updated successfully", user: updatedUser });
               } else {
                    res.status(400).json({ message: "Old password is incorrect" });
               }
          }
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const getUserById = async (req, res) => {
     const { id } = req.params;
     try {
          const user = await User.findById(id);
          if (user) {
               res.status(200).json({ user });
          } else {
               res.status(404).json({ message: "User not found" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}


/******** ADMIN USERS CONTROLLERS ******** */

export const getUsers = async (req, res) => {
     try {
          const users = await User.find();
          res.status(200).json({ users });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const deleteUser = async (req, res) => {
     const { id } = req.params;
     try {
          const deletedUser = await User.findByIdAndDelete(id);
          res.status(200).json({ message: "User deleted successfully", user: deletedUser });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}