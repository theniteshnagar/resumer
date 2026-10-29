import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

const router = Router();
const issueToken = (user) => jwt.sign({ sub: user._id.toString() }, env.jwtSecret, { expiresIn: "7d" });

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
      return res.status(400).json({ message: "Name, email, and a password of at least 8 characters are required" });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: "An account with this email already exists" });
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: issueToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: issueToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
});

export default router;
