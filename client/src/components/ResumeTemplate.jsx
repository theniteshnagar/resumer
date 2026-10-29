import { Mail, MapPin, Phone } from "lucide-react";
import { getCategory } from "../lib/categories";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(`${value}-01`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const Contact = ({ info }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
    {info.email && <span className="inline-flex items-center gap-1"><Mail size={13} />{info.email}</span>}
    {info.phone && <span className="inline-flex items-center gap-1"><Phone size={13} />{info.phone}</span>}
    {info.location && <span className="inline-flex items-center gap-1"><MapPin size={13} />{info.location}</span>}
    {info.linkedin && <span>{info.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>}
    {info.website && <span>{info.website.replace(/^https?:\/\/(www\.)?/, "")}</span>}
  </div>
);

const Section = ({ title, children, accent }) => (
  <section className="mb-6">
    <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>{title}</h2>
    {children}
  </section>
);

const ResumeTemplate = ({ data }) => {
  const category = getCategory(data.category);
  const info = data.personal_info || {};
  const accent = data.accent_color || category.accent;
  const isClinical = data.category === "doctor";
  const isEducation = data.category === "teacher";
  const isTechnical = data.category === "engineer" || data.category === "developer";

  const experience = (
    <Section title={isClinical ? "Clinical Experience" : isEducation ? "Teaching Experience" : "Experience"} accent={accent}>
      <div className="space-y-5">
        {(data.experience || []).map((item, index) => (
          <div key={item._id || index} className="border-l-2 pl-4" style={{ borderColor: `${accent}55` }}>
            <div className="flex flex-wrap justify-between gap-2">
              <div><h3 className="font-semibold text-slate-900">{item.position || "Position"}</h3><p className="text-sm font-medium text-slate-600">{item.company}</p></div>
              <span className="text-xs text-slate-500">{formatDate(item.start_date)} - {item.is_current ? "Present" : formatDate(item.end_date)}</span>
            </div>
            {item.description && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{item.description}</p>}
          </div>
        ))}
      </div>
    </Section>
  );

  const education = (
    <Section title={isClinical ? "Education & Training" : "Education"} accent={accent}>
      <div className="space-y-3">
        {(data.education || []).map((item, index) => <div key={item._id || index} className="flex justify-between gap-3 text-sm"><div><p className="font-semibold text-slate-900">{item.degree} {item.field && `in ${item.field}`}</p><p className="text-slate-600">{item.institution}</p>{item.gpa && <p className="text-xs text-slate-500">GPA: {item.gpa}</p>}</div><span className="text-xs text-slate-500">{formatDate(item.graduation_date)}</span></div>)}
      </div>
    </Section>
  );

  const skills = <Section title={isTechnical ? "Technical Skills" : "Skills"} accent={accent}><div className="flex flex-wrap gap-2">{(data.skills || []).map((skill, index) => <span key={`${skill}-${index}`} className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: `${accent}16`, color: accent }}>{skill}</span>)}</div></Section>;
  const projects = (data.project || []).length > 0 && <Section title={isTechnical ? "Selected Projects" : "Projects"} accent={accent}><div className="space-y-3">{data.project.map((item, index) => <div key={item._id || index}><h3 className="font-semibold text-slate-900">{item.name}</h3>{item.type && <p className="text-xs font-medium" style={{ color: accent }}>{item.type}</p>}<p className="text-sm leading-6 text-slate-600">{item.description}</p></div>)}</div></Section>;

  if (data.category === "other") {
    return <article className="mx-auto max-w-4xl bg-white p-8 text-slate-800 shadow-sm print:shadow-none"><header className="mb-8 border-b-2 pb-6" style={{ borderColor: accent }}><h1 className="text-3xl font-bold">{info.full_name || "Your Name"}</h1><p className="mt-1 text-sm font-medium" style={{ color: accent }}>{info.profession || "Professional"}</p><div className="mt-3"><Contact info={info} /></div></header>{data.professional_summary && <Section title="Profile" accent={accent}><p className="text-sm leading-6 text-slate-600">{data.professional_summary}</p></Section>}{experience}{projects}{education}{skills}</article>;
  }

  return <article className="mx-auto max-w-4xl bg-white text-slate-800 shadow-sm print:shadow-none"><header className="p-8" style={{ backgroundColor: data.category === "teacher" ? "#ecfdf5" : data.category === "doctor" ? "#ecfeff" : `${accent}12`, borderTop: `8px solid ${accent}` }}><h1 className="text-4xl font-bold tracking-tight">{info.full_name || "Your Name"}</h1><p className="mt-1 font-medium" style={{ color: accent }}>{info.profession || category.label}</p><div className="mt-4"><Contact info={info} /></div></header><div className="p-8">{data.professional_summary && <Section title={isClinical ? "Professional Profile" : "Summary"} accent={accent}><p className="text-sm leading-6 text-slate-600">{data.professional_summary}</p></Section>}{experience}{projects}{education}{skills}</div></article>;
};

export default ResumeTemplate;
