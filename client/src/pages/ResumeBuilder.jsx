import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Save, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ResumeTemplate from "../components/ResumeTemplate";
import { resumeApi } from "../lib/api";
import { categories, emptyResume, getCategory } from "../lib/categories";

const fields = ["personal", "summary", "experience", "education", "projects", "skills"];
const labels = { personal: "Personal info", summary: "Summary", experience: "Experience", education: "Education", projects: "Projects", skills: "Skills" };
const inputClass = "mt-1 w-full px-3 py-2 text-sm";
const parseSkills = (value) => [...new Set(value.split(/[,\n]/).map((skill) => skill.trim()).filter(Boolean))];

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(emptyResume());
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [skillsText, setSkillsText] = useState("");

  useEffect(() => {
    resumeApi.get(resumeId).then((resume) => {
      setData(resume);
      setSkillsText((resume.skills || []).join(", "));
    }).catch((error) => setStatus(error.message)).finally(() => setLoading(false));
  }, [resumeId]);
  const update = (path, value) => setData((current) => { const next = structuredClone(current); const keys = path.split("."); let target = next; keys.slice(0, -1).forEach((key) => { target = target[key]; }); target[keys.at(-1)] = value; return next; });
  const save = async () => {
    try {
      const saved = await resumeApi.update(resumeId, { ...data, skills: parseSkills(skillsText) });
      setData(saved);
      setSkillsText((saved.skills || []).join(", "));
      setStatus("Saved");
    } catch (error) {
      setStatus(error.message);
    }
  };
  const commitSkills = () => {
    const skills = parseSkills(skillsText);
    setSkillsText(skills.join(", "));
    update("skills", skills);
  };
  const updateCategory = (value) => { const item = getCategory(value); setData((current) => ({ ...current, category: value, template: item.template, accent_color: item.accent })); };
  const addItem = (key, value) => setData((current) => ({ ...current, [key]: [...(current[key] || []), value] }));
  const removeItem = (key, index) => setData((current) => ({ ...current, [key]: current[key].filter((_, itemIndex) => itemIndex !== index) }));
  const section = fields[active];

  if (loading) return <div className="p-10 text-center text-slate-500">Loading resume...</div>;
  return <main className="mx-auto max-w-[1500px] px-4 py-6"><div className="mb-5 flex items-center justify-between"><Link to="/app" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Dashboard</Link><div className="flex items-center gap-3"><span className={`text-xs ${status === "Saved" ? "text-emerald-600" : "text-slate-500"}`}>{status}</span><button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"><Save size={16} /> Save</button><button onClick={() => navigate(`/view/${resumeId}`)} className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700">Preview</button></div></div><div className="grid gap-6 lg:grid-cols-[minmax(340px,470px)_1fr]"><section className="rounded-2xl border bg-white p-5 shadow-sm"><div className="mb-5 flex gap-1 overflow-x-auto border-b pb-3">{fields.map((item, index) => <button key={item} onClick={() => setActive(index)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium ${index === active ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}>{index + 1}. {labels[item]}</button>)}</div>{section === "personal" && <div className="space-y-3"><label className="block text-sm">Full name<input value={data.personal_info.full_name} onChange={(e) => update("personal_info.full_name", e.target.value)} className={inputClass} /></label><label className="block text-sm">Profession<input value={data.personal_info.profession} onChange={(e) => update("personal_info.profession", e.target.value)} className={inputClass} /></label><div className="grid gap-3 sm:grid-cols-2">{["email", "phone", "location", "linkedin", "website"].map((key) => <label key={key} className="block text-sm capitalize">{key}<input value={data.personal_info[key]} onChange={(e) => update(`personal_info.${key}`, e.target.value)} className={inputClass} /></label>)}</div></div>}{section === "summary" && <label className="block text-sm">Professional summary<textarea rows="9" value={data.professional_summary} onChange={(e) => update("professional_summary", e.target.value)} className={inputClass} placeholder="Summarize your strengths and impact..." /></label>}{section === "experience" && <ArrayEditor items={data.experience} type="experience" onAdd={(item) => addItem("experience", item)} onRemove={(index) => removeItem("experience", index)} onChange={(index, key, value) => update(`experience.${index}.${key}`, value)} />}{section === "education" && <ArrayEditor items={data.education} type="education" onAdd={(item) => addItem("education", item)} onRemove={(index) => removeItem("education", index)} onChange={(index, key, value) => update(`education.${index}.${key}`, value)} />}{section === "projects" && <ArrayEditor items={data.project} type="project" onAdd={(item) => addItem("project", item)} onRemove={(index) => removeItem("project", index)} onChange={(index, key, value) => update(`project.${index}.${key}`, value)} />}{section === "skills" && <div><label className="block text-sm">Skills <span className="font-normal text-slate-400">  (comma or line separated)</span><textarea rows="6" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} onBlur={commitSkills} className={inputClass} placeholder="React, Node.js, MongoDB" /></label><div className="mt-3 flex flex-wrap gap-2">{parseSkills(skillsText).map((skill) => <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700">{skill}</span>)}</div><label className="mt-4 block text-sm">Profession category<select value={data.category} onChange={(e) => updateCategory(e.target.value)} className={inputClass}>{categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></div>}<div className="mt-6 flex justify-between border-t pt-4"><button disabled={active === 0} onClick={() => setActive((value) => value - 1)} className="inline-flex items-center gap-1 text-sm text-slate-500 disabled:opacity-40"><ChevronLeft size={16} /> Previous</button><button onClick={() => setActive((value) => Math.min(fields.length - 1, value + 1))} className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600">Next <ChevronRight size={16} /></button></div></section><section className="min-w-0 overflow-auto rounded-2xl border bg-slate-100 p-3 sm:p-8"><ResumeTemplate data={data} /></section></div></main>;
};

const defaults = { experience: { company: "", position: "", start_date: "", end_date: "", description: "", is_current: false }, education: { institution: "", degree: "", field: "", graduation_date: "", gpa: "" }, project: { name: "", type: "", description: "" } };
const keys = { experience: ["company", "position", "start_date", "end_date", "description"], education: ["institution", "degree", "field", "graduation_date", "gpa"], project: ["name", "type", "description"] };
const ArrayEditor = ({ items, type, onAdd, onRemove, onChange }) => <div className="space-y-4">{items.map((item, index) => <div key={item._id || index} className="rounded-xl border p-4"><div className="mb-3 flex justify-between"><span className="text-sm font-semibold">#{index + 1}</span><button onClick={() => onRemove(index)} className="text-red-500"><Trash2 size={16} /></button></div><div className="grid gap-3 sm:grid-cols-2">{keys[type].map((key) => <label key={key} className={`block text-sm capitalize ${key === "description" ? "sm:col-span-2" : ""}`}>{key.replace("_", " ")}{key === "description" ? <textarea rows="3" value={item[key]} onChange={(e) => onChange(index, key, e.target.value)} className={inputClass} /> : <input type={key.includes("date") ? "month" : "text"} value={item[key]} onChange={(e) => onChange(index, key, e.target.value)} className={inputClass} />}</label>)}</div>{type === "experience" && <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={item.is_current} onChange={(e) => onChange(index, "is_current", e.target.checked)} /> Current role</label>}</div>)}<button onClick={() => onAdd({ ...defaults[type] })} className="inline-flex items-center gap-2 rounded-lg border border-dashed px-4 py-2 text-sm font-medium text-indigo-600"><Plus size={16} /> Add {type}</button></div>;

export default ResumeBuilder;
