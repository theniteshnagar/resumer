export const categories = [
  { id: "engineer", label: "Engineer", description: "Technical, project-focused resume", accent: "#2563eb", template: "modern" },
  { id: "teacher", label: "Teacher", description: "Education and classroom impact", accent: "#059669", template: "classic" },
  { id: "doctor", label: "Doctor", description: "Clinical experience and credentials", accent: "#0891b2", template: "minimal" },
  { id: "developer", label: "Developer", description: "Skills and shipped projects", accent: "#7c3aed", template: "modern" },
  { id: "other", label: "Other", description: "Flexible professional layout", accent: "#4f46e5", template: "minimal" },
];

export const getCategory = (id) => categories.find((category) => category.id === id) || categories.at(-1);

export const emptyResume = (title = "Untitled Resume") => ({
  title,
  category: "other",
  personal_info: { full_name: "", email: "", phone: "", location: "", linkedin: "", website: "", profession: "" },
  professional_summary: "",
  experience: [],
  education: [],
  project: [],
  skills: [],
  template: "minimal",
  accent_color: "#4f46e5",
  public: false,
});
