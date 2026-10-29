import mongoose from "mongoose";

const personalInfoSchema = new mongoose.Schema(
  {
    full_name: { type: String, trim: true, maxlength: 120, default: "" },
    email: { type: String, trim: true, maxlength: 160, default: "" },
    phone: { type: String, trim: true, maxlength: 40, default: "" },
    location: { type: String, trim: true, maxlength: 120, default: "" },
    linkedin: { type: String, trim: true, maxlength: 240, default: "" },
    website: { type: String, trim: true, maxlength: 240, default: "" },
    profession: { type: String, trim: true, maxlength: 120, default: "" },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, trim: true, maxlength: 160, default: "" },
    position: { type: String, trim: true, maxlength: 160, default: "" },
    start_date: { type: String, trim: true, maxlength: 20, default: "" },
    end_date: { type: String, trim: true, maxlength: 20, default: "" },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    is_current: { type: Boolean, default: false },
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, trim: true, maxlength: 180, default: "" },
    degree: { type: String, trim: true, maxlength: 120, default: "" },
    field: { type: String, trim: true, maxlength: 120, default: "" },
    graduation_date: { type: String, trim: true, maxlength: 20, default: "" },
    gpa: { type: String, trim: true, maxlength: 30, default: "" },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 160, default: "" },
    type: { type: String, trim: true, maxlength: 120, default: "" },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
  },
  { _id: true }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    category: {
      type: String,
      enum: ["engineer", "teacher", "doctor", "developer", "other"],
      default: "other",
    },
    personal_info: { type: personalInfoSchema, default: () => ({}) },
    professional_summary: { type: String, trim: true, maxlength: 3000, default: "" },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    project: { type: [projectSchema], default: [] },
    skills: { type: [String], default: [] },
    template: { type: String, enum: ["classic", "minimal", "modern"], default: "classic" },
    accent_color: { type: String, default: "#4f46e5" },
    public: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Resume", resumeSchema);
