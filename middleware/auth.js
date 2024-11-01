import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const generateToken = (user) => {
     return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
          expiresIn: "30d",
     })
}

export const protect2 = async (req, res, next) => {
     let token;
     if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
     ) {
          try {
               token = req.headers.authorization.split(" ")[1];
               const decoded = jwt.verify(token, process.env.JWT_SECRET);
               req.user = await User.findById(decoded.id);
               next();
          } catch (error) {
               console.error(error);
               res.status(401);
               throw new Error("Not authorized, token failed");
          }
     }
     if (!token) {
          res.status(401);
          throw new Error("Not authorized, no token");
     }
};

export const protect = async (req, res, next) => {
     const token = req.cookies.token;
     if (!token) {
          return res
               .status(401)
               .json({ message: "No Token" })
     }
     try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id);
          next();

     } catch (error) {
          res
               .status(401)
               .json({ error, message: "Invalid token" })
     }
}

export const admin = (req, res, next) => {
     if (req.user && req.user.isAdmin) {
          next();
     } else {
          res.status(401);
          throw new Error("Not authorized as an admin");
     }
};