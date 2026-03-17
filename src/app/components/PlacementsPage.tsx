import { useState, useEffect } from "react";
import {
  Plus, X, Trash2, Pencil, Save, Search, Building2, Trophy,
  Users, Calendar, CheckCircle2, Clock, Star, Briefcase,
  TrendingUp, GraduationCap, ChevronDown, ChevronUp, Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Drive, PlacedStudent, Company, ShortlistedStudent, DEPARTMENTS } from "./placementsData";

// ── helpers ──────────────────────────────────────────────────────────────────
const field = (label: string, children: React.ReactNode) => (
  <div>
    <label className="block text-xs mb-1" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>{label}</label>
    {children}
  </div>
);
const inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
    style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }} />
);
const sel = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => {
  const { children, ...rest } = props;
  return (
    <select {...rest} className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
      style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }}>
      {children}
    </select>
  );
};
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
    <div className="glass-card-strong rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-5" style={{ background: "linear-gradient(135deg,#5540DE,#2e2378)", borderRadius: "16px 16px 0 0" }}>
        <h3 className="text-white text-base" style={{ fontWeight: 700 }}>{title}</h3>
        <button onClick={onClose} className="text-white/70 hover:text-white"><X size={18} /></button>
      </div>
      <div className="p-5 flex flex-col gap-3">{children}</div>
    </div>
  </div>
);

// ── Status config ─────────────────────────────────────────────────────────────
const SL_CFG = {
  shortlisted: { label: "Shortlisted", bg: "rgba(245,158,11,0.12)", color: "#D97706" },
  selected: { label: "Selected ✓", bg: "rgba(5,150,105,0.12)", color: "#059669" },
  rejected: { label: "Rejected", bg: "rgba(220,38,38,0.12)", color: "#DC2626" },
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════════════════════════════════════════════
function AdminPlacements() {
  const [tab, setTab] = useState<"drives" | "shortlist" | "placed" | "companies">("drives");
  const [drives, setDrives] = useState<Drive[]>(() => {
    const s = localStorage.getItem("bit_placements_drives");
    return s ? JSON.parse(s) : [];
  });
  const [placed, setPlaced] = useState<PlacedStudent[]>(() => {
    const s = localStorage.getItem("bit_placements_placed");
    return s ? JSON.parse(s) : [];
  });
  const [companies, setCompanies] = useState<Company[]>(() => {
    const s = localStorage.getItem("bit_placements_companies");
    return s ? JSON.parse(s) : [];
  });
  const [shortlisted, setShortlisted] = useState<ShortlistedStudent[]>(() => {
    const s = localStorage.getItem("bit_placements_shortlisted");
    return s ? JSON.parse(s) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { localStorage.setItem("bit_placements_drives", JSON.stringify(drives)); }, [drives]);
  useEffect(() => { localStorage.setItem("bit_placements_placed", JSON.stringify(placed)); }, [placed]);
  useEffect(() => { localStorage.setItem("bit_placements_companies", JSON.stringify(companies)); }, [companies]);
  useEffect(() => { localStorage.setItem("bit_placements_shortlisted", JSON.stringify(shortlisted)); }, [shortlisted]);

  // modal state
  const [driveModal, setDriveModal] = useState<Drive | null | "new">(null);
  const [placedModal, setPlacedModal] = useState<PlacedStudent | null | "new">(null);
  const [companyModal, setCompanyModal] = useState<Company | null | "new">(null);
  const [slModal, setSlModal] = useState<ShortlistedStudent | null | "new">(null);
  const [search, setSearch] = useState("");

  // Drive form
  const DRIVE_BLANK: Omit<Drive, "id"> = { company: "", color: "#5540DE", date: "", ctc: "", minCGPA: 7, branches: ["CSE"], roles: ["Software Engineer"], rounds: ["Online Test", "Technical Interview", "HR"], deadline: "", registeredCount: 0 };
  const [df, setDf] = useState<Omit<Drive, "id">>(DRIVE_BLANK);
  const saveDrive = () => {
    if (!df.company || !df.date) return;
    if (driveModal === "new") {
      setDrives(p => [...p, { id: Date.now(), ...df }]);
    } else {
      const id = (driveModal as Drive).id;
      setDrives(p => p.map(d => d.id === id ? { ...d, ...df } : d));
    }
    setDriveModal(null);
  };
  const delDrive = (id: number) => {
    setDrives(p => p.filter(d => d.id !== id));
  };

  // Placed form
  const PL_BLANK: Omit<PlacedStudent, "id"> = { name: "", rollNo: "", dept: "CSE", company: "", companyColor: "#5540DE", package: 0, role: "", year: 2025, photo: "" };
  const [pf, setPf] = useState<Omit<PlacedStudent, "id">>(PL_BLANK);
  const savePlaced = () => {
    if (!pf.name || !pf.company) return;
    if (placedModal === "new") {
      setPlaced(p => [...p, { id: Date.now(), ...pf }]);
    } else {
      const id = (placedModal as PlacedStudent).id;
      setPlaced(p => p.map(s => s.id === id ? { ...s, ...pf } : s));
    }
    setPlacedModal(null);
  };
  const delPlaced = (id: number) => {
    setPlaced(p => p.filter(s => s.id !== id));
  };

  // Company form
  const CO_BLANK: Omit<Company, "id"> = { name: "", initials: "", color: "#5540DE", sector: "", ctcRange: "", hired: 0, status: "partner", desc: "" };
  const [cf, setCf] = useState<Omit<Company, "id">>(CO_BLANK);
  const saveCompany = () => {
    if (!cf.name) return;
    if (companyModal === "new") {
      setCompanies(p => [...p, { id: Date.now(), ...cf }]);
    } else {
      const id = (companyModal as Company).id;
      setCompanies(p => p.map(c => c.id === id ? { ...c, ...cf } : c));
    }
    setCompanyModal(null);
  };
  const delCompany = (id: number) => {
    setCompanies(p => p.filter(c => c.id !== id));
  };

  // Shortlist form
  const SL_BLANK: Omit<ShortlistedStudent, "id"> = { name: "", rollNo: "", dept: "CSE", company: "", round: "Online Test", status: "shortlisted" };
  const [slf, setSlf] = useState<Omit<ShortlistedStudent, "id">>(SL_BLANK);
  const saveShortlist = () => {
    if (!slf.name || !slf.company) return;
    if (slModal === "new") {
      setShortlisted(p => [...p, { id: Date.now(), ...slf }]);
    } else {
      const id = (slModal as ShortlistedStudent).id;
      setShortlisted(p => p.map(s => s.id === id ? { ...s, ...slf } : s));
    }
    setSlModal(null);
  };
  const delShortlist = (id: number) => {
    setShortlisted(p => p.filter(s => s.id !== id));
  };

  const TABS = [
    { id: "drives" as const, label: "📅 Upcoming Drives", count: drives.length },
    { id: "shortlist" as const, label: "⭐ Shortlisted", count: shortlisted.filter(s => s.status === "shortlisted").length },
    { id: "placed" as const, label: "🏆 Placed Students", count: placed.length },
    { id: "companies" as const, label: "🏢 Companies", count: companies.length },
  ];

  const statCards = [
    { label: "Placed", value: placed.length, color: "#5540DE", icon: GraduationCap },
    { label: "Highest CTC", value: `${Math.max(...placed.map(p => p.package))} LPA`, color: "#D97706", icon: TrendingUp },
    { label: "Active Drives", value: drives.length, color: "#059669", icon: Briefcase },
    { label: "Partner Companies", value: companies.filter(c => c.status === "partner").length, color: "#0891B2", icon: Building2 },
  ];

  const filt = (list: any[]) => !search ? list : list.filter(i => (i.name || i.company || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1400px] mx-auto pb-10">
      {/* Hero */}
      <div className="rounded-[2.5rem] p-8 mb-8 relative overflow-hidden bento-card-strong border-none shadow-2xl" style={{ background: "linear-gradient(135deg,#1a0a3a,#2d1060)" }}>
        <div className="relative z-10">
          <p className="text-purple-300 text-[10px] mb-2 tracking-[0.2em] font-bold uppercase">Admin · Placement Cell</p>
          <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Placements Management</h1>
          <p className="text-indigo-100/90 text-sm max-w-xl font-medium">Manage drives, shortlisted students, placed alumni, and partner companies.</p>
          <div className="flex gap-6 mt-6">
            {statCards.map(s => (
              <div key={s.label}>
                <p className="text-2xl" style={{ fontWeight: 800, color: s.color }}>{s.value}</p>
                <p className="text-white/80 text-xs" style={{ fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all"
            style={{ background: tab === t.id ? "#5540DE" : "var(--glass-bg)", color: tab === t.id ? "white" : "var(--foreground)", fontWeight: tab === t.id ? 700 : 500, border: `1px solid ${tab === t.id ? "transparent" : "var(--glass-border)"}`, boxShadow: tab === t.id ? "0 4px 14px rgba(85,64,222,0.35)" : "none" }}>
            {t.label} <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: tab === t.id ? "rgba(255,255,255,0.2)" : "var(--glass-border)" }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-2.5 flex-1 max-w-xs">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="bg-transparent outline-none text-sm flex-1" />
        </div>
        {tab === "drives" && <button onClick={() => { setDf(DRIVE_BLANK); setDriveModal("new"); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm" style={{ background: "#5540DE", fontWeight: 600 }}><Plus size={14} />Add Drive</button>}
        {tab === "placed" && <button onClick={() => { setPf(PL_BLANK); setPlacedModal("new"); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm" style={{ background: "#D97706", fontWeight: 600 }}><Plus size={14} />Add Placed Student</button>}
        {tab === "companies" && <button onClick={() => { setCf(CO_BLANK); setCompanyModal("new"); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm" style={{ background: "#059669", fontWeight: 600 }}><Plus size={14} />Add Company</button>}
        {tab === "shortlist" && <button onClick={() => { setSlf(SL_BLANK); setSlModal("new"); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm" style={{ background: "#D97706", fontWeight: 600 }}><Plus size={14} />Add Student</button>}
      </div>

      {/* ─── DRIVES TAB ─────────────────────────────────────────────────────── */}
      {tab === "drives" && (
        <div className="flex flex-col gap-5">
          {(filt(drives) as Drive[]).map(d => (
            <div key={d.id} className="bento-card-strong rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="h-1.5" style={{ background: d.color }} />
              <div className="p-7 flex items-start gap-5">
                <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-white shrink-0 shadow-sm" style={{ background: d.color }}><Briefcase size={24} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-base" style={{ fontWeight: 700, color: "var(--foreground)" }}>{d.company}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <span className="flex items-center gap-1"><Calendar size={11} />{d.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />Deadline: {d.deadline}</span>
                    <span className="flex items-center gap-1"><Users size={11} />{d.registeredCount} registered</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ background: d.color, fontWeight: 600 }}>{d.ctc}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(85,64,222,0.1)", color: "#5540DE", fontWeight: 600 }}>CGPA ≥ {d.minCGPA}</span>
                    {d.branches.map(b => <span key={b} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "var(--surface-inset)", color: "var(--muted-foreground)" }}>{b}</span>)}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setDf({ company: d.company, color: d.color, date: d.date, ctc: d.ctc, minCGPA: d.minCGPA, branches: d.branches, roles: d.roles, rounds: d.rounds, deadline: d.deadline, registeredCount: d.registeredCount }); setDriveModal(d); }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(85,64,222,0.1)" }}><Pencil size={13} style={{ color: "#5540DE" }} /></button>
                  <button onClick={() => delDrive(d.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(220,38,38,0.1)" }}><Trash2 size={13} style={{ color: "#DC2626" }} /></button>
                </div>
              </div>
            </div>
          ))}
          {drives.length === 0 && <Empty icon={<Briefcase size={36} />} msg="No drives yet. Add the first one!" />}
        </div>
      )}

      {/* ─── SHORTLIST TAB ──────────────────────────────────────────────────── */}
      {tab === "shortlist" && (
        <div className="flex flex-col gap-4">
          {(filt(shortlisted) as ShortlistedStudent[]).map(s => {
            const cfg = SL_CFG[s.status];
            return (
              <div key={s.id} className="bento-card rounded-[2rem] p-5 flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-white shadow-sm shrink-0" style={{ background: "linear-gradient(135deg,#5540DE,#7c6de8)", fontWeight: 800 }}>{s.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm" style={{ fontWeight: 700, color: "var(--foreground)" }}>{s.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--surface-inset)", color: "var(--muted-foreground)" }}>{s.rollNo}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{s.dept} · {s.company} · Round: {s.round}</p>
                </div>
                <div className="flex gap-1">
                  <select value={s.status} onChange={(e) => {
                    const status = e.target.value as ShortlistedStudent["status"];
                    setShortlisted(p => p.map(x => x.id === s.id ? { ...x, status } : x));
                  }}
                    className="text-xs rounded-lg px-2 py-1 outline-none" style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }}>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button onClick={() => { setSlf({ name: s.name, rollNo: s.rollNo, dept: s.dept, company: s.company, round: s.round, status: s.status }); setSlModal(s); }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(85,64,222,0.1)" }}><Pencil size={13} style={{ color: "#5540DE" }} /></button>
                  <button onClick={() => delShortlist(s.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(220,38,38,0.1)" }}><Trash2 size={13} style={{ color: "#DC2626" }} /></button>
                </div>
              </div>
            );
          })}
          {shortlisted.length === 0 && <Empty icon={<Star size={36} />} msg="No shortlisted students yet." />}
        </div>
      )}

      {/* ─── PLACED TAB ─────────────────────────────────────────────────────── */}
      {tab === "placed" && (
        <div>
          {/* Top 3 showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {placed.slice(0, 3).map((s, i) => (
              <div key={s.id} className="bento-card-strong rounded-[2.5rem] overflow-hidden relative group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
                {i === 0 && <div className="absolute top-3 right-3 z-10 text-2xl">👑</div>}
                <div className="h-32 relative overflow-hidden">
                  {s.photo ? <img src={s.photo} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white shadow-inner" style={{ background: `linear-gradient(135deg,${s.companyColor},${s.companyColor}88)` }}>{s.name[0]}</div>}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 70%)" }} />
                  <span className="absolute bottom-3 left-3 text-white text-[11px] px-3 py-1 rounded-full shadow-sm" style={{ background: ["#D97706", "#6B7280", "#B45309"][i], fontWeight: 800 }}>#{i + 1} Ranker</span>
                </div>
                <div className="p-4">
                  <p className="text-sm" style={{ fontWeight: 700, color: "var(--foreground)" }}>{s.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{s.dept} · {s.year}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}><div className="w-4 h-4 rounded flex items-center justify-center text-white text-[9px]" style={{ background: s.companyColor, fontWeight: 700 }}>{s.company[0]}</div>{s.company}</span>
                    <span className="text-white text-xs px-2.5 py-1 rounded-lg" style={{ background: `linear-gradient(135deg,${s.companyColor},${s.companyColor}cc)`, fontWeight: 800 }}>₹{s.package} LPA</span>
                  </div>
                  <div className="flex gap-1 mt-3">
                    <button onClick={() => { setPf({ name: s.name, rollNo: s.rollNo, dept: s.dept, company: s.company, companyColor: s.companyColor, package: s.package, role: s.role, year: s.year, photo: s.photo }); setPlacedModal(s); }} className="flex-1 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1" style={{ background: "rgba(85,64,222,0.1)", color: "#5540DE", fontWeight: 600 }}><Pencil size={11} />Edit</button>
                    <button onClick={() => delPlaced(s.id)} className="py-1.5 px-2 rounded-lg" style={{ background: "rgba(220,38,38,0.1)" }}><Trash2 size={13} style={{ color: "#DC2626" }} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Rest list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {placed.slice(3).map(s => (
              <div key={s.id} className="bento-card rounded-[2rem] p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                {s.photo ? <img src={s.photo} alt={s.name} className="w-14 h-14 rounded-[1.25rem] object-cover shrink-0 shadow-sm" /> : <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-white text-xl shrink-0 shadow-sm" style={{ background: `linear-gradient(135deg,${s.companyColor},${s.companyColor}88)`, fontWeight: 800 }}>{s.name[0]}</div>}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ fontWeight: 700, color: "var(--foreground)" }}>{s.name}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.dept} · {s.company}</p>
                  <span className="text-white text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: s.companyColor, fontWeight: 700 }}>₹{s.package} LPA</span>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => { setPf({ name: s.name, rollNo: s.rollNo, dept: s.dept, company: s.company, companyColor: s.companyColor, package: s.package, role: s.role, year: s.year, photo: s.photo }); setPlacedModal(s); }} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(85,64,222,0.1)" }}><Pencil size={12} style={{ color: "#5540DE" }} /></button>
                  <button onClick={() => delPlaced(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(220,38,38,0.1)" }}><Trash2 size={12} style={{ color: "#DC2626" }} /></button>
                </div>
              </div>
            ))}
          </div>
          {placed.length === 0 && <Empty icon={<Trophy size={36} />} msg="No placed students yet. Add the first one!" />}
        </div>
      )}

      {/* ─── COMPANIES TAB ──────────────────────────────────────────────────── */}
      {tab === "companies" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(filt(companies) as Company[]).map(c => (
            <div key={c.id} className="bento-card-strong rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <div className="h-1.5" style={{ background: `linear-gradient(90deg,${c.color},${c.color}55)` }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-white text-sm shrink-0 shadow-sm" style={{ background: `linear-gradient(135deg,${c.color},${c.color}cc)`, fontWeight: 800 }}>{c.initials}</div>
                  <span className={`text-[10px] px-2 py-1 rounded-full ${c.status === "partner" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"}`} style={{ fontWeight: 600 }}>{c.status === "partner" ? "✓ Partner" : "◷ Upcoming"}</span>
                </div>
                <p className="text-sm" style={{ fontWeight: 700, color: "var(--foreground)" }}>{c.name}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{c.sector}</p>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{c.desc}</p>
                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <div><p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>CTC Range</p><p className="text-xs" style={{ fontWeight: 700, color: "var(--foreground)" }}>{c.ctcRange}</p></div>
                  <div className="text-right"><p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Hired</p><p className="text-sm" style={{ fontWeight: 700, color: c.color }}>{c.hired}+</p></div>
                </div>
                {c.visitDate && <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "#D97706", fontWeight: 600 }}><Calendar size={11} />{c.visitDate}</p>}
                <div className="flex gap-1.5 mt-3">
                  <button onClick={() => { setCf({ name: c.name, initials: c.initials, color: c.color, sector: c.sector, ctcRange: c.ctcRange, hired: c.hired, status: c.status, visitDate: c.visitDate, desc: c.desc }); setCompanyModal(c); }} className="flex-1 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1" style={{ background: "rgba(85,64,222,0.1)", color: "#5540DE", fontWeight: 600 }}><Pencil size={11} />Edit</button>
                  <button onClick={() => delCompany(c.id)} className="py-1.5 px-2 rounded-lg" style={{ background: "rgba(220,38,38,0.1)" }}><Trash2 size={12} style={{ color: "#DC2626" }} /></button>
                </div>
              </div>
            </div>
          ))}
          {companies.length === 0 && <Empty icon={<Building2 size={36} />} msg="No companies yet." />}
        </div>
      )}

      {/* ─── MODALS ─────────────────────────────────────────────────────────── */}
      {driveModal && (
        <Modal title={driveModal === "new" ? "Add Upcoming Drive" : "Edit Drive"} onClose={() => setDriveModal(null)}>
          {field("Company Name *", inp({ value: df.company, onChange: e => setDf(p => ({ ...p, company: e.target.value })), placeholder: "e.g. Zoho Corporation" }))}
          <div className="grid grid-cols-2 gap-3">
            {field("Drive Date *", inp({ type: "date", value: df.date, onChange: e => setDf(p => ({ ...p, date: e.target.value })) }))}
            {field("Registration Deadline *", inp({ type: "date", value: df.deadline, onChange: e => setDf(p => ({ ...p, deadline: e.target.value })) }))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("CTC Range", inp({ value: df.ctc, onChange: e => setDf(p => ({ ...p, ctc: e.target.value })), placeholder: "e.g. 10–22 LPA" }))}
            {field("Min CGPA", inp({ type: "number", step: "0.1", min: "0", max: "10", value: df.minCGPA, onChange: e => setDf(p => ({ ...p, minCGPA: parseFloat(e.target.value) || 0 })) }))}
          </div>
          {field("Eligible Branches (comma separated)", inp({ value: df.branches.join(", "), onChange: e => setDf(p => ({ ...p, branches: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })), placeholder: "CSE, IT, ECE" }))}
          {field("Roles (comma separated)", inp({ value: df.roles.join(", "), onChange: e => setDf(p => ({ ...p, roles: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })), placeholder: "Software Engineer, Analyst" }))}
          {field("Selection Rounds (comma separated)", inp({ value: df.rounds.join(", "), onChange: e => setDf(p => ({ ...p, rounds: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })) }))}
          {field("Brand Color", inp({ type: "color", value: df.color, onChange: e => setDf(p => ({ ...p, color: e.target.value })) }))}
          <div className="flex gap-3 mt-2">
            <button onClick={() => setDriveModal(null)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: "var(--surface-inset)", color: "var(--foreground)" }}>Cancel</button>
            <button onClick={saveDrive} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm hover:opacity-90" style={{ background: "#5540DE", fontWeight: 600 }}><Save size={14} />Save Drive</button>
          </div>
        </Modal>
      )}

      {placedModal && (
        <Modal title={placedModal === "new" ? "Add Placed Student" : "Edit Placed Student"} onClose={() => setPlacedModal(null)}>
          <div className="grid grid-cols-2 gap-3">
            {field("Full Name *", inp({ value: pf.name, onChange: e => setPf(p => ({ ...p, name: e.target.value })), placeholder: "e.g. Arun Kumar S" }))}
            {field("Roll No", inp({ value: pf.rollNo, onChange: e => setPf(p => ({ ...p, rollNo: e.target.value })), placeholder: "20CS001" }))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Department", sel({ value: pf.dept, onChange: e => setPf(p => ({ ...p, dept: e.target.value })), children: DEPARTMENTS.map(d => <option key={d}>{d}</option>) }))}
            {field("Year", inp({ type: "number", value: pf.year, onChange: e => setPf(p => ({ ...p, year: parseInt(e.target.value) || 2025 })) }))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Company *", inp({ value: pf.company, onChange: e => setPf(p => ({ ...p, company: e.target.value })), placeholder: "e.g. Google" }))}
            {field("Package (LPA)", inp({ type: "number", step: "0.1", value: pf.package, onChange: e => setPf(p => ({ ...p, package: parseFloat(e.target.value) || 0 })) }))}
          </div>
          {field("Role / Designation", inp({ value: pf.role, onChange: e => setPf(p => ({ ...p, role: e.target.value })), placeholder: "Software Engineer L3" }))}
          {field("Photo URL (optional)", inp({ value: pf.photo, onChange: e => setPf(p => ({ ...p, photo: e.target.value })), placeholder: "https://..." }))}
          {field("Company Brand Color", inp({ type: "color", value: pf.companyColor, onChange: e => setPf(p => ({ ...p, companyColor: e.target.value })) }))}
          <div className="flex gap-3 mt-2">
            <button onClick={() => setPlacedModal(null)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: "var(--surface-inset)", color: "var(--foreground)" }}>Cancel</button>
            <button onClick={savePlaced} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm hover:opacity-90" style={{ background: "#D97706", fontWeight: 600 }}><Save size={14} />Save</button>
          </div>
        </Modal>
      )}

      {companyModal && (
        <Modal title={companyModal === "new" ? "Add Company" : "Edit Company"} onClose={() => setCompanyModal(null)}>
          <div className="grid grid-cols-2 gap-3">
            {field("Company Name *", inp({ value: cf.name, onChange: e => setCf(p => ({ ...p, name: e.target.value })), placeholder: "e.g. Zoho" }))}
            {field("Initials (3 chars)", inp({ value: cf.initials, onChange: e => setCf(p => ({ ...p, initials: e.target.value.toUpperCase().slice(0, 3) })), placeholder: "ZHO", maxLength: 3 }))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Sector", inp({ value: cf.sector, onChange: e => setCf(p => ({ ...p, sector: e.target.value })), placeholder: "e.g. SaaS Product" }))}
            {field("CTC Range", inp({ value: cf.ctcRange, onChange: e => setCf(p => ({ ...p, ctcRange: e.target.value })), placeholder: "8–20 LPA" }))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Total Hired", inp({ type: "number", value: cf.hired, onChange: e => setCf(p => ({ ...p, hired: parseInt(e.target.value) || 0 })) }))}
            {field("Status", sel({ value: cf.status, onChange: e => setCf(p => ({ ...p, status: e.target.value as "partner" | "upcoming" })), children: [<option key="p" value="partner">Partner</option>, <option key="u" value="upcoming">Upcoming</option>] }))}
          </div>
          {cf.status === "upcoming" && field("Visit Date", inp({ value: cf.visitDate || "", onChange: e => setCf(p => ({ ...p, visitDate: e.target.value })), placeholder: "Mar 25, 2026" }))}
          {field("Description", inp({ value: cf.desc, onChange: e => setCf(p => ({ ...p, desc: e.target.value })), placeholder: "Brief description…" }))}
          {field("Brand Color", inp({ type: "color", value: cf.color, onChange: e => setCf(p => ({ ...p, color: e.target.value })) }))}
          <div className="flex gap-3 mt-2">
            <button onClick={() => setCompanyModal(null)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: "var(--surface-inset)", color: "var(--foreground)" }}>Cancel</button>
            <button onClick={saveCompany} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm hover:opacity-90" style={{ background: "#059669", fontWeight: 600 }}><Save size={14} />Save Company</button>
          </div>
        </Modal>
      )}

      {slModal && (
        <Modal title={slModal === "new" ? "Add Shortlisted Student" : "Edit Student"} onClose={() => setSlModal(null)}>
          <div className="grid grid-cols-2 gap-3">
            {field("Full Name *", inp({ value: slf.name, onChange: e => setSlf(p => ({ ...p, name: e.target.value })), placeholder: "e.g. Vishal S" }))}
            {field("Roll No *", inp({ value: slf.rollNo, onChange: e => setSlf(p => ({ ...p, rollNo: e.target.value })), placeholder: "21CS001" }))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Department", sel({ value: slf.dept, onChange: e => setSlf(p => ({ ...p, dept: e.target.value })), children: DEPARTMENTS.map(d => <option key={d}>{d}</option>) }))}
            {field("Company *", inp({ value: slf.company, onChange: e => setSlf(p => ({ ...p, company: e.target.value })), placeholder: "e.g. Zoho" }))}
          </div>
          {field("Current Round", inp({ value: slf.round, onChange: e => setSlf(p => ({ ...p, round: e.target.value })), placeholder: "Technical Interview" }))}
          {field("Status", sel({ value: slf.status, onChange: e => setSlf(p => ({ ...p, status: e.target.value as ShortlistedStudent["status"] })), children: [<option key="s" value="shortlisted">Shortlisted</option>, <option key="sel" value="selected">Selected</option>, <option key="r" value="rejected">Rejected</option>] }))}
          <div className="flex gap-3 mt-2">
            <button onClick={() => setSlModal(null)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: "var(--surface-inset)", color: "var(--foreground)" }}>Cancel</button>
            <button onClick={saveShortlist} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm hover:opacity-90" style={{ background: "#D97706", fontWeight: 600 }}><Save size={14} />Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT VIEW
// ══════════════════════════════════════════════════════════════════════════════
function StudentPlacements() {
  const { user } = useAuth();
  const [drives, setDrives] = useState<Drive[]>(() => {
    const s = localStorage.getItem("bit_placements_drives");
    return s ? JSON.parse(s) : [];
  });
  const [placed, setPlaced] = useState<PlacedStudent[]>(() => {
    const s = localStorage.getItem("bit_placements_placed");
    return s ? JSON.parse(s) : [];
  });
  const [companies, setCompanies] = useState<Company[]>(() => {
    const s = localStorage.getItem("bit_placements_companies");
    return s ? JSON.parse(s) : [];
  });
  const [shortlisted, setShortlisted] = useState<ShortlistedStudent[]>(() => {
    const s = localStorage.getItem("bit_placements_shortlisted");
    return s ? JSON.parse(s) : [];
  });
  const [expanded, setExpanded] = useState<number | null>(null);

  const myRecord = shortlisted.find(s => s.rollNo?.toLowerCase() === (user?.rollNo || "21CS001").toLowerCase());

  return (
    <div className="max-w-[1200px] mx-auto pb-10 flex flex-col gap-8">
      {/* Hero */}
      <div className="rounded-[2.5rem] p-8 relative overflow-hidden bento-card-strong border-none shadow-2xl" style={{ background: "linear-gradient(135deg,#5540DE,#2e2378)" }}>
        <div className="relative z-10">
          <p className="text-indigo-200 text-xs mb-2 tracking-widest uppercase" style={{ fontWeight: 700 }}>BIT Sathy · Placement Cell</p>
          <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Placements 🎯</h1>
          <p className="text-indigo-100/90 text-sm">Track upcoming drives, top placements, and partner companies.</p>
          <div className="flex gap-4 mt-6">
            {[{ v: `${placed.length}+`, l: "Placed" }, { v: `${Math.max(...placed.map(p => p.package))} LPA`, l: "Highest" }, { v: `${companies.filter(c => c.status === "partner").length}`, l: "Partners" }, { v: `${drives.length}`, l: "Active Drives" }].map(s => (
              <div key={s.l} className="rounded-[1rem] px-4 py-2 text-center shadow-sm" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
                <p className="text-white text-base" style={{ fontWeight: 800 }}>{s.v}</p>
                <p className="text-white/80" style={{ fontSize: "11px", fontWeight: 600 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-white/5 blur-xl" />
        <div className="absolute right-24 -bottom-16 w-32 h-32 rounded-full bg-white/10 blur-xl" />
      </div>

      {/* My Status Banner */}
      {myRecord && (
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: myRecord.status === "selected" ? "linear-gradient(135deg,rgba(5,150,105,0.12),rgba(5,150,105,0.05))" : "linear-gradient(135deg,rgba(217,119,6,0.12),rgba(217,119,6,0.05))", border: `1px solid ${myRecord.status === "selected" ? "rgba(5,150,105,0.3)" : "rgba(217,119,6,0.3)"}` }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: myRecord.status === "selected" ? "#059669" : "#D97706" }}>
            {myRecord.status === "selected" ? <CheckCircle2 size={22} /> : <Star size={22} />}
          </div>
          <div>
            <p className="text-sm" style={{ fontWeight: 700, color: "var(--foreground)" }}>
              {myRecord.status === "selected" ? `🎉 Congratulations! You're selected at ${myRecord.company}!` : `⭐ You're shortlisted at ${myRecord.company}!`}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Current Round: {myRecord.round}</p>
          </div>
        </div>
      )}

      {/* Upcoming Drives */}
      <div>
        <h2 className="text-base mb-4 flex items-center gap-2" style={{ fontWeight: 700, color: "var(--foreground)" }}>
          <span className="w-1 h-5 rounded-full inline-block" style={{ background: "#5540DE" }} /> Upcoming Drives
        </h2>
        <div className="flex flex-col gap-4">
          {drives.map(d => (
            <div key={d.id} className="bento-card-strong rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="p-6 cursor-pointer" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-white shrink-0 shadow-sm" style={{ background: d.color }}><Briefcase size={24} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm" style={{ fontWeight: 700, color: "var(--foreground)" }}>{d.company}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: d.color, fontWeight: 600 }}>{d.ctc}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <span className="flex items-center gap-1"><Calendar size={11} />{d.date}</span>
                      <span className="flex items-center gap-1 text-red-500"><Clock size={11} />Deadline: {d.deadline}</span>
                      <span className="flex items-center gap-1"><Users size={11} />{d.registeredCount} registered</span>
                    </div>
                  </div>
                  {expanded === d.id ? <ChevronUp size={16} style={{ color: "var(--muted-foreground)" }} /> : <ChevronDown size={16} style={{ color: "var(--muted-foreground)" }} />}
                </div>
              </div>
              {expanded === d.id && (
                <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <div><p className="text-xs mb-1.5" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>Roles</p>{d.roles.map(r => <span key={r} className="inline-block mr-1 mb-1 text-xs px-2 py-0.5 rounded-full text-white" style={{ background: d.color, fontWeight: 600 }}>{r}</span>)}</div>
                  <div><p className="text-xs mb-1.5" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>Eligibility</p><p className="text-xs mb-1" style={{ color: "var(--foreground)" }}>Min CGPA: <strong>{d.minCGPA}</strong></p>{d.branches.map(b => <span key={b} className="inline-block mr-1 mb-1 text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(85,64,222,0.1)", color: "#5540DE", fontWeight: 600 }}>{b}</span>)}</div>
                  <div><p className="text-xs mb-1.5" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>Rounds</p>{d.rounds.map((r, i) => <div key={r} className="flex items-center gap-2 mb-1"><div className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: d.color, fontSize: "9px", fontWeight: 700 }}>{i + 1}</div><span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{r}</span></div>)}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Placements */}
      <div>
        <h2 className="text-base mb-4 flex items-center gap-2" style={{ fontWeight: 700, color: "var(--foreground)" }}>
          <span className="w-1.5 h-6 rounded-full inline-block" style={{ background: "#D97706" }} /> 🏆 High Package Achievers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {placed.slice(0, 3).map((s, i) => (
            <div key={s.id} className="bento-card-strong rounded-[2.5rem] overflow-hidden relative group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              {i === 0 && <div className="absolute top-3 right-3 z-10 text-2xl">👑</div>}
              <div className="h-28 relative overflow-hidden">
                {s.photo ? <img src={s.photo} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white shadow-inner" style={{ background: `linear-gradient(135deg,${s.companyColor},${s.companyColor}88)` }}>{s.name[0]}</div>}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 70%)" }} />
                <span className="absolute bottom-3 left-3 text-white text-[11px] px-3 py-1 rounded-full shadow-sm" style={{ background: ["#D97706", "#6B7280", "#B45309"][i], fontWeight: 800 }}>#{i + 1}</span>
              </div>
              <div className="p-4">
                <p className="text-sm" style={{ fontWeight: 700, color: "var(--foreground)" }}>{s.name}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.dept}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.company}</span>
                  <span className="text-white text-xs px-2.5 py-1 rounded-lg" style={{ background: `linear-gradient(135deg,${s.companyColor},${s.companyColor}cc)`, fontWeight: 800 }}>₹{s.package} LPA</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {placed.slice(3).map(s => (
            <div key={s.id} className="bento-card rounded-[2rem] p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              {s.photo ? <img src={s.photo} alt={s.name} className="w-14 h-14 rounded-[1.25rem] object-cover shrink-0 shadow-sm" /> : <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-white text-xl shrink-0 shadow-sm" style={{ background: `linear-gradient(135deg,${s.companyColor},${s.companyColor}88)`, fontWeight: 800 }}>{s.name[0]}</div>}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ fontWeight: 700, color: "var(--foreground)" }}>{s.name}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.dept}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.company}</span>
                  <span className="text-white text-[10px] px-2 py-0.5 rounded-full" style={{ background: s.companyColor, fontWeight: 700 }}>₹{s.package} LPA</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Companies */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base flex items-center gap-2" style={{ fontWeight: 700, color: "var(--foreground)" }}>
            <span className="w-1.5 h-6 rounded-full inline-block" style={{ background: "#059669" }} /> Partner Companies
          </h2>
          <div className="flex gap-2">
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(5,150,105,0.1)", color: "#059669", fontWeight: 600 }}>● {companies.filter(c => c.status === "partner").length} Active</span>
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(217,119,6,0.1)", color: "#D97706", fontWeight: 600 }}>◷ {companies.filter(c => c.status === "upcoming").length} Upcoming</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {companies.map(c => (
            <div key={c.id} className="bento-card-strong rounded-[2.5rem] p-6 flex flex-col items-center gap-3 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-white text-sm shadow-sm" style={{ background: `linear-gradient(135deg,${c.color},${c.color}cc)`, fontWeight: 800 }}>{c.initials}</div>
              <p className="text-xs" style={{ fontWeight: 700, color: "var(--foreground)" }}>{c.name}</p>
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{c.ctcRange}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === "partner" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"}`} style={{ fontWeight: 600 }}>
                {c.status === "partner" ? "✓ Partner" : "Upcoming"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Empty state helper ────────────────────────────────────────────────────────
function Empty({ icon, msg }: { icon: React.ReactNode; msg: string }) {
  return (
    <div className="glass-card rounded-2xl py-16 text-center col-span-full" style={{ color: "var(--muted-foreground)" }}>
      <div className="flex justify-center mb-3 opacity-30">{icon}</div>
      <p className="text-sm">{msg}</p>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function PlacementsPage() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminPlacements /> : <StudentPlacements />;
}
