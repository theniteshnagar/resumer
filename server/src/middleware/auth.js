import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select("_id name email");
    if (!user) return res.status(401).json({ message: "User account not found" });
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    next(error);
  }
};
