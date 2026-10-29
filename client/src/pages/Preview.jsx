import { ArrowLeft, Download, Pencil } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ResumeTemplate from "../components/ResumeTemplate";
import { resumeApi } from "../lib/api";

const Preview = () => {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { resumeApi.get(resumeId).then(setResume).catch((err) => setError(err.message)); }, [resumeId]);
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!resume) return <div className="p-10 text-center text-slate-500">Loading preview...</div>;
  return <main className="min-h-screen bg-slate-100 px-4 py-6"><div className="print:hidden mx-auto mb-5 flex max-w-5xl justify-between"><Link to="/app" className="inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={16} /> Dashboard</Link><div className="flex gap-2"><Link to={`/app/builder/${resumeId}`} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm"><Pencil size={15} /> Edit</Link><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"><Download size={15} /> Download PDF</button></div></div><ResumeTemplate data={resume} /></main>;
};

export default Preview;
