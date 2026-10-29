import { useEffect, useState } from "react";
import { FilePenLine, Pencil, Plus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resumeApi } from "../lib/api";
import { categories } from "../lib/categories";

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("other");
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    resumeApi.list().then((items) => { if (active) setResumes(items); }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);

  const createResume = async (event) => {
    event.preventDefault();
    try {
      const resume = await resumeApi.create({ title, category });
      setModal(null); setTitle(""); navigate(`/app/builder/${resume._id}`);
    } catch (err) { setError(err.message); }
  };
  const updateTitle = async (event) => {
    event.preventDefault();
    try { const updated = await resumeApi.update(modal.id, { title }); setResumes((items) => items.map((item) => item._id === updated._id ? updated : item)); setModal(null); } catch (err) { setError(err.message); }
  };
  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try { await resumeApi.remove(id); setResumes((items) => items.filter((item) => item._id !== id)); } catch (err) { setError(err.message); }
  };

  return <main className="mx-auto max-w-7xl px-4 py-8">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-indigo-600">Your workspace</p><h1 className="text-3xl font-semibold text-slate-900">Build a resume that fits your next role.</h1><p className="mt-2 text-slate-500">Choose a profession and make every section relevant.</p></div><button onClick={() => setModal({ type: "create" })} className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"><Plus size={18} /> New resume</button></div>
    {error && <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}<button onClick={() => setError("")}><X size={16} /></button></div>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {resumes.map((resume) => { const detail = categories.find((item) => item.id === resume.category) || categories.at(-1); return <div key={resume._id} className="group relative flex min-h-52 flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: `${detail.accent}40` }}><div><div className="mb-5 flex items-center justify-between"><span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${detail.accent}15`, color: detail.accent }}>{detail.label}</span><FilePenLine size={20} style={{ color: detail.accent }} /></div><h2 className="font-semibold text-slate-900">{resume.title}</h2><p className="mt-1 text-xs text-slate-500">{resume.updatedAt ? `Updated ${new Date(resume.updatedAt).toLocaleDateString()}` : "Demo resume"}</p></div><div className="flex items-center justify-between"><button onClick={() => navigate(`/app/builder/${resume._id}`)} className="text-sm font-medium text-indigo-600">Open builder →</button><div className="flex gap-1 opacity-0 transition group-hover:opacity-100"><button aria-label="Rename resume" onClick={() => { setTitle(resume.title); setModal({ type: "edit", id: resume._id }); }} className="rounded p-2 hover:bg-slate-100"><Pencil size={15} /></button><button aria-label="Delete resume" onClick={() => deleteResume(resume._id)} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button></div></div></div>; })}
      {!resumes.length && <div className="rounded-2xl border border-dashed p-8 text-slate-500 sm:col-span-2 lg:col-span-4">No resumes yet. Create your first one to get started.</div>}
    </div>
    {modal && <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/50 p-4" onClick={() => setModal(null)}><form onSubmit={modal.type === "create" ? createResume : updateTitle} onClick={(event) => event.stopPropagation()} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><button type="button" onClick={() => setModal(null)} className="absolute right-4 top-4 text-slate-400"><X size={18} /></button><h2 className="mb-5 text-xl font-semibold">{modal.type === "create" ? "Create a resume" : "Rename resume"}</h2><label className="mb-4 block text-sm font-medium text-slate-700">Resume title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Frontend Engineer Resume" className="mt-2 w-full px-4 py-3" required /></label>{modal.type === "create" && <label className="mb-5 block text-sm font-medium text-slate-700">Profession category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3">{categories.map((item) => <option key={item.id} value={item.id}>{item.label} — {item.description}</option>)}</select></label>}<button className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700">{modal.type === "create" ? "Create resume" : "Save title"}</button></form></div>}
  </main>;
};

export default Dashboard;
