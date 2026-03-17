import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, Clock, CalendarDays, Search, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Exam {
  id: number;
  date: string;
  day: string;
  subject: string;
  code: string;
  dept: string;
  time: string;
  duration: string;
  hall: string;
  color: string;
}

const ODD_EXAMS: Exam[] = [
  { id: 101, date: "Nov 10, 2025", day: "Mon", subject: "Engineering Mathematics III", code: "MA3351", dept: "All Depts", time: "10:00 AM", duration: "3 hrs", hall: "Main Block – Halls 1–4", color: "#5540DE" },
  { id: 102, date: "Nov 11, 2025", day: "Tue", subject: "Physics for Engineers", code: "PH3251", dept: "CSE / IT / ECE", time: "10:00 AM", duration: "3 hrs", hall: "Block B – Hall 1–2", color: "#059669" },
  { id: 103, date: "Nov 13, 2025", day: "Thu", subject: "Data Structures & Algorithms", code: "CS3361", dept: "CSE / IT", time: "10:00 AM", duration: "3 hrs", hall: "Block A – Hall 3", color: "#0891B2" },
  { id: 104, date: "Nov 14, 2025", day: "Fri", subject: "Digital Electronics", code: "EC3361", dept: "ECE / EEE", time: "10:00 AM", duration: "3 hrs", hall: "Block A – Hall 1", color: "#DC2626" },
  { id: 105, date: "Nov 17, 2025", day: "Mon", subject: "Mechanics of Solids", code: "ME3351", dept: "MECH / CIVIL", time: "10:00 AM", duration: "3 hrs", hall: "Block C – Hall 2", color: "#7C3AED" },
  { id: 106, date: "Nov 18, 2025", day: "Tue", subject: "Computer Organization", code: "CS3362", dept: "CSE / IT", time: "10:00 AM", duration: "3 hrs", hall: "Block A – Hall 2", color: "#D97706" },
  { id: 107, date: "Nov 20, 2025", day: "Thu", subject: "Object Oriented Programming (Java)", code: "CS3363", dept: "CSE / IT", time: "10:00 AM", duration: "3 hrs", hall: "CS Lab Block", color: "#0D9488" },
  { id: 108, date: "Nov 21, 2025", day: "Fri", subject: "Environmental Science & Engineering", code: "GE3351", dept: "All Depts", time: "10:00 AM", duration: "3 hrs", hall: "Main Block – Halls 1–5", color: "#16A34A" },
];

const EVEN_EXAMS: Exam[] = [
  { id: 201, date: "Apr 7, 2026", day: "Tue", subject: "Engineering Mathematics IV", code: "MA4351", dept: "All Depts", time: "10:00 AM", duration: "3 hrs", hall: "Main Block – Halls 1–5", color: "#5540DE" },
  { id: 202, date: "Apr 8, 2026", day: "Wed", subject: "Computer Networks", code: "CS4361", dept: "CSE / IT", time: "10:00 AM", duration: "3 hrs", hall: "Block A – Hall 1–2", color: "#059669" },
  { id: 203, date: "Apr 9, 2026", day: "Thu", subject: "Database Management Systems", code: "CS4362", dept: "CSE / IT", time: "10:00 AM", duration: "3 hrs", hall: "Block A – Hall 3", color: "#0891B2" },
  { id: 204, date: "Apr 10, 2026", day: "Fri", subject: "Microprocessors & Microcontrollers", code: "EC4361", dept: "ECE / EEE", time: "10:00 AM", duration: "3 hrs", hall: "Block B – Hall 1", color: "#DC2626" },
  { id: 205, date: "Apr 14, 2026", day: "Tue", subject: "Operating Systems", code: "CS4363", dept: "CSE / IT", time: "10:00 AM", duration: "3 hrs", hall: "Block A – Hall 1", color: "#7C3AED" },
  { id: 206, date: "Apr 15, 2026", day: "Wed", subject: "Software Engineering", code: "CS4364", dept: "CSE / IT", time: "10:00 AM", duration: "3 hrs", hall: "Block A – Hall 2", color: "#D97706" },
  { id: 207, date: "Apr 17, 2026", day: "Fri", subject: "Artificial Intelligence", code: "CS4365", dept: "CSE", time: "10:00 AM", duration: "3 hrs", hall: "CS Lab Block", color: "#EC4899" },
  { id: 208, date: "Apr 21, 2026", day: "Tue", subject: "Engineering Economics", code: "GE4351", dept: "All Depts", time: "10:00 AM", duration: "3 hrs", hall: "Main Block – Halls 1–5", color: "#16A34A" },
  { id: 209, date: "Apr 22, 2026", day: "Wed", subject: "Thermal Engineering", code: "ME4361", dept: "MECH", time: "10:00 AM", duration: "3 hrs", hall: "Block C – Hall 1", color: "#B45309" },
];

const SUPP_EXAMS: Exam[] = [
  { id: 301, date: "May 12, 2026", day: "Tue", subject: "Engineering Mathematics I (Arrear)", code: "MA1151", dept: "All Depts", time: "2:00 PM", duration: "3 hrs", hall: "Block D – Hall 1", color: "#5540DE" },
  { id: 302, date: "May 13, 2026", day: "Wed", subject: "Engineering Physics (Arrear)", code: "PH1151", dept: "All Depts", time: "2:00 PM", duration: "3 hrs", hall: "Block D – Hall 2", color: "#DC2626" },
  { id: 303, date: "May 15, 2026", day: "Fri", subject: "C Programming (Arrear)", code: "CS1151", dept: "CSE / IT / ECE", time: "2:00 PM", duration: "3 hrs", hall: "CS Lab Block", color: "#0891B2" },
  { id: 304, date: "May 18, 2026", day: "Mon", subject: "Digital Electronics (Arrear)", code: "EC2151", dept: "ECE / EEE", time: "2:00 PM", duration: "3 hrs", hall: "Block B – Hall 1", color: "#059669" },
];

type TabKey = "odd" | "even" | "supplementary";
const TABS: { key: TabKey; label: string; emoji: string; exams: Exam[] }[] = [
  { key: "odd", label: "Odd Semester 2025", emoji: "📘", exams: ODD_EXAMS },
  { key: "even", label: "Even Semester 2026", emoji: "📗", exams: EVEN_EXAMS },
  { key: "supplementary", label: "Supplementary 2026", emoji: "📙", exams: SUPP_EXAMS },
];

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const nextExam = new Date("Apr 7, 2026 10:00:00");
    const tick = () => {
      const diff = nextExam.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
      {([["days", timeLeft.days], ["hrs", timeLeft.hours], ["min", timeLeft.minutes], ["sec", timeLeft.seconds]] as [string, number][]).map(([label, val]) => (
        <div key={label} className="rounded-2xl px-3 py-2 text-center min-w-[58px]"
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.25)" }}>
          <p className="text-white text-2xl" style={{ fontWeight: 800, lineHeight: 1 }}>{String(val).padStart(2, "0")}</p>
          <p className="text-white/65 text-xs mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

export function ExamTimetablePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState<TabKey>("even");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [examsMap, setExamsMap] = useState<Record<TabKey, Exam[]>>({
    odd: ODD_EXAMS, even: EVEN_EXAMS, supplementary: SUPP_EXAMS,
  });
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [form, setForm] = useState({ date: "", day: "Mon", subject: "", code: "", dept: "", time: "10:00 AM", duration: "3 hrs", hall: "", color: "#5540DE" });

  const exams = examsMap[activeTab];
  const filtered = exams.filter(e =>
    !search || e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.code.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditingExam(null); setForm({ date: "", day: "Mon", subject: "", code: "", dept: "", time: "10:00 AM", duration: "3 hrs", hall: "", color: "#5540DE" }); setShowModal(true); };
  const openEdit = (e: Exam) => { setEditingExam(e); setForm({ date: e.date, day: e.day, subject: e.subject, code: e.code, dept: e.dept, time: e.time, duration: e.duration, hall: e.hall, color: e.color }); setShowModal(true); };
  const save = () => {
    if (!form.subject.trim() || !form.date.trim()) return;
    setExamsMap(prev => {
      const list = prev[activeTab];
      if (editingExam) return { ...prev, [activeTab]: list.map(e => e.id === editingExam.id ? { ...e, ...form } : e) };
      return { ...prev, [activeTab]: [...list, { id: Date.now(), ...form }] };
    });
    setShowModal(false);
  };
  const remove = (id: number) => setExamsMap(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(e => e.id !== id) }));

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const COLORS = ["#5540DE", "#059669", "#DC2626", "#0891B2", "#7C3AED", "#D97706", "#EC4899", "#16A34A", "#B45309"];

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Hero with countdown */}
      <div className="rounded-[2.5rem] p-8 mb-8 relative overflow-hidden bento-card-strong border-none shadow-2xl"
        style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
          <div>
            <p className="text-indigo-200 text-xs mb-2 tracking-[0.2em] font-bold uppercase">Anna University</p>
            <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Exam Timetable 📋</h1>
            <p className="text-indigo-100/90 text-sm font-medium">Official BIT Sathy semester examination schedule</p>
          </div>
          <div className="bento-card rounded-[2rem] p-5 shadow-inner" style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-white/80 text-xs mb-3 text-center sm:text-left tracking-wider font-bold">⏳ NEXT EXAM COUNTDOWN</p>
            <Countdown />
            <p className="text-white/60 text-[11px] mt-3 text-center sm:text-left font-semibold">Even Semester — Apr 7, 2026</p>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl z-0" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all"
            style={{ background: activeTab === t.key ? "#5540DE" : "rgba(255,255,255,0.75)", color: activeTab === t.key ? "white" : "#374151", fontWeight: activeTab === t.key ? 700 : 500, boxShadow: activeTab === t.key ? "0 4px 14px rgba(85,64,222,0.3)" : "0 2px 8px rgba(0,0,0,0.04)", border: activeTab === t.key ? "none" : "1px solid rgba(255,255,255,0.6)" }}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-52 rounded-[1.5rem] px-5 py-3 bento-card shadow-sm transition-all focus-within:shadow-md">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subject or code..."
            className="flex-1 bg-transparent outline-none text-sm font-medium text-[var(--foreground)] placeholder-gray-400" />
        </div>
        {isAdmin && (
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90"
            style={{ background: "#5540DE", fontWeight: 600 }}>
            <Plus size={14} /> Add Exam
          </button>
        )}
        <span className="text-sm text-gray-400">{filtered.length} exams</span>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total Exams", v: exams.length, c: "#5540DE", bg: "#EEF2FF", e: "📋" },
          { l: "Duration", v: "3 Hours", c: "#059669", bg: "#ECFDF5", e: "⏱️" },
          { l: "Session", v: "10 AM", c: "#0891B2", bg: "#E0F2FE", e: "🕙" },
          { l: "Reporting", v: "9:30 AM", c: "#D97706", bg: "#FFFBEB", e: "⚡" },
        ].map(s => (
          <div key={s.l} className="bento-card-strong rounded-[2rem] p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-xl shrink-0 shadow-sm" style={{ background: s.bg }}>{s.e}</div>
            <div>
              <p className="text-xl" style={{ fontWeight: 800, color: s.c }}>{s.v}</p>
              <p className="text-[var(--muted-foreground)] text-xs font-semibold">{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Exam Cards */}
      <div className="flex flex-col gap-4">
        {filtered.map((exam, idx) => (
          <div key={exam.id}
            className="bento-card-strong rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all duration-300 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: exam.color }} />
            <div className="flex items-center gap-5 p-5 pl-7 cursor-pointer" onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)}>
              {/* Day/Date block */}
              <div className="w-14 shrink-0 text-center rounded-xl py-2"
                style={{ background: `${exam.color}15`, border: `2px solid ${exam.color}30` }}>
                <p className="text-xs" style={{ color: exam.color, fontWeight: 700 }}>{exam.day}</p>
                <p className="text-lg" style={{ color: exam.color, fontWeight: 800, lineHeight: 1.2 }}>{exam.date.split(" ")[1]?.replace(",", "")}</p>
                <p className="text-xs" style={{ color: exam.color, opacity: 0.7 }}>{exam.date.split(" ")[0]}</p>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1.5">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full text-white shadow-sm" style={{ background: exam.color, fontWeight: 700 }}>{exam.code}</span>
                  <span className="text-[var(--muted-foreground)] text-xs font-semibold">{exam.dept}</span>
                </div>
                <p className="text-[var(--foreground)] text-base" style={{ fontWeight: 800 }}>{exam.subject}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[var(--muted-foreground)] text-xs flex items-center gap-1 font-medium"><Clock size={12} /> {exam.time}</span>
                  <span className="text-[var(--muted-foreground)] text-xs flex items-center gap-1 font-medium"><BookOpen size={12} /> {exam.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAdmin && (
                  <div className="flex gap-1">
                    <button onClick={e => { e.stopPropagation(); openEdit(exam); }}
                      className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center hover:bg-purple-100">
                      <Pencil size={13} className="text-purple-600" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); remove(exam.id); }}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100">
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>
                )}
                {expandedId === exam.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>

            {expandedId === exam.id && (
              <div className="px-5 pb-4 pt-0">
                <div className="h-px bg-gray-100 mb-3" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { l: "📅 Full Date", v: exam.date },
                    { l: "⏰ Session", v: exam.time },
                    { l: "⏱️ Duration", v: exam.duration },
                    { l: "🏛️ Exam Hall", v: exam.hall },
                    { l: "📚 Department", v: exam.dept },
                    { l: "📋 Subject Code", v: exam.code },
                  ].map(d => (
                    <div key={d.l} className="rounded-[1.25rem] p-4 flex flex-col gap-1 bento-card shadow-sm" style={{ background: "var(--surface-inset)" }}>
                      <p className="text-[var(--muted-foreground)] text-[11px] uppercase tracking-wider font-bold">{d.l}</p>
                      <p className="text-[var(--foreground)] text-sm" style={{ fontWeight: 700 }}>{d.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400 text-sm">No exams found for your search.</p>
          </div>
        )}
      </div>

      {/* Important Note */}
      <div className="mt-8 bento-card-strong rounded-[2.5rem] p-7 flex items-start gap-5 shadow-xl"
        style={{ border: "1px solid rgba(245,158,11,0.3)" }}>
        <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-2xl bg-amber-100 shrink-0">⚠️</div>
        <div>
          <p className="text-amber-800 text-base" style={{ fontWeight: 800 }}>Important Instructions</p>
          <ul className="text-amber-700/90 text-sm mt-2 space-y-1.5 font-medium">
            <li>• Students must report to the exam hall by <strong className="font-extrabold text-amber-900">9:30 AM</strong> (30 min before exam starts)</li>
            <li>• Carry Hall Ticket + College ID – entry denied without both documents</li>
            <li>• No electronic devices allowed inside the exam hall</li>
            <li>• Download your Hall Ticket from the <strong className="font-extrabold text-amber-900">BIP Portal</strong> (bip.bitsathy.ac.in)</li>
          </ul>
        </div>
      </div>

      {/* Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
          <div className="w-full max-w-lg rounded-[2.5rem] bento-card-strong p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <h3 className="text-[var(--foreground)] text-xl" style={{ fontWeight: 800 }}>{editingExam ? "Edit Exam" : "Add Exam"}</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Subject Name *", k: "subject", span: true },
                { l: "Subject Code", k: "code" },
                { l: "Date (e.g. Apr 7, 2026)", k: "date" },
                { l: "Department", k: "dept" },
                { l: "Time", k: "time" },
                { l: "Duration", k: "duration" },
                { l: "Exam Hall", k: "hall", span: true },
              ].map(({ l, k, span }) => (
                <div key={k} className={span ? "col-span-2" : ""}>
                  <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>{l}</label>
                  <input value={(form as Record<string, string>)[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Day</label>
                <select value={form.day} onChange={e => setForm(p => ({ ...p, day: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]">
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1.5" style={{ fontWeight: 600 }}>Color</label>
                <div className="flex gap-1.5 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                      className="w-6 h-6 rounded-full hover:scale-110 transition-transform"
                      style={{ backgroundColor: c, outline: form.color === c ? `3px solid ${c}` : "none", outlineOffset: "2px" }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl text-white text-sm hover:opacity-90 flex items-center justify-center gap-1.5" style={{ background: "#5540DE", fontWeight: 600 }}>
                <Save size={14} /> {editingExam ? "Update" : "Add Exam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}