import { Router } from "express";
import mongoose from "mongoose";
import Resume from "../models/Resume.js";

const router = Router();
const ownedQuery = (req, id) => ({ _id: id, userId: req.user._id });

router.get("/", async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ resumes });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, category = "other" } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Resume title is required" });
    const resume = await Resume.create({ userId: req.user._id, title: title.trim(), category });
    res.status(201).json({ resume });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid resume id" });
    const resume = await Resume.findOne(ownedQuery(req, req.params.id));
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ resume });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid resume id" });
    const allowed = ["title", "category", "personal_info", "professional_summary", "experience", "education", "project", "skills", "template", "accent_color", "public"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (updates.title !== undefined && !updates.title.trim()) return res.status(400).json({ message: "Resume title cannot be empty" });
    const resume = await Resume.findOneAndUpdate(ownedQuery(req, req.params.id), updates, { new: true, runValidators: true });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ resume });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid resume id" });
    const result = await Resume.deleteOne(ownedQuery(req, req.params.id));
    if (!result.deletedCount) return res.status(404).json({ message: "Resume not found" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
