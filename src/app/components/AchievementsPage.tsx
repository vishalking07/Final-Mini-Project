import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Award, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Achievement {
  id: number; category: string; title: string; student: string;
  dept: string; award: string; desc: string; date: string;
  color: string; emoji: string; rank: string; isTeam: boolean;
}

const initAchievements: Achievement[] = [
  { id: 1, category: "Technical", title: "Smart India Hackathon 2025 – Grand Finale Winner", student: "Team CodeCraft (6 members, CSE)", dept: "CSE", award: "₹1,00,000 + Winner Trophy", desc: "Team CodeCraft from CSE 3rd year won the Smart India Hackathon 2025 Grand Finale under the Smart Education category, beating 500+ teams nationally.", date: "Dec 2025", color: "#5540DE", emoji: "🏆", rank: "1st Place", isTeam: true },
  { id: 2, category: "Academic", title: "University Rank Holder – Anna University Exams 2025", student: "Vishal S (21CS001)", dept: "CSE", award: "University Gold Medal", desc: "Secured 3rd rank in Anna University examinations among all CSE students in the affiliated colleges across Tamil Nadu.", date: "Nov 2025", color: "#D97706", emoji: "🥇", rank: "University 3rd Rank", isTeam: false },
  { id: 3, category: "Sports", title: "South Zone Inter-University Cricket Championship", student: "BIT Sathy Cricket Team", dept: "Sports", award: "Champions Trophy", desc: "BIT Sathy's cricket team won the South Zone Inter-University Championship defeating teams from 24 universities.", date: "Oct 2025", color: "#059669", emoji: "🏏", rank: "Champions", isTeam: true },
  { id: 4, category: "Cultural", title: "Anna University Culturals – Overall Championship", student: "BIT Sathy Cultural Team", dept: "Cultural Club", award: "Overall Trophy + ₹50,000", desc: "Won the Overall Championship at the Anna University Zonals 2025 held at PSG College of Technology, Coimbatore, defeating 35 colleges.", date: "Sep 2025", color: "#EC4899", emoji: "🎭", rank: "Overall Champions", isTeam: true },
  { id: 5, category: "Technical", title: "ICPC Asia Regional Contest 2025", student: "Arjun M, Rahul D, Kavya R", dept: "CSE/IT", award: "Regional Finalist Certificate", desc: "BIT Sathy's ICPC team qualified for the Asia Regional Contest, achieving a rank among the top 15% of participating teams.", date: "Nov 2025", color: "#0891B2", emoji: "💻", rank: "Asia Regional Finalist", isTeam: true },
  { id: 6, category: "Academic", title: "Best Research Paper Award – IEEE ICCNT 2025", student: "Dr. S Kavitha + 3 Students (AI&ML)", dept: "AI&ML", award: "Best Paper Certificate + ₹10,000", desc: "Research paper on 'Federated Learning for Healthcare Applications' won the Best Paper Award at the IEEE International Conference on Computing and Network Technologies.", date: "Aug 2025", color: "#7C3AED", emoji: "📄", rank: "Best Paper Award", isTeam: true },
  { id: 7, category: "Sports", title: "All India Inter-University Badminton Championship", student: "Priya K (21EC045)", dept: "ECE", award: "Bronze Medal", desc: "Won the Bronze Medal in Women's Singles category at the All India Inter-University Badminton Championship held in Delhi.", date: "Mar 2025", color: "#D97706", emoji: "🏸", rank: "3rd Place – National", isTeam: false },
  { id: 8, category: "Technical", title: "TATA Crucible Campus Quiz 2025", student: "Suresh P & Meena R (CSE)", dept: "CSE", award: "State Runner-Up + ₹25,000", desc: "The BIT Sathy team reached the national finals of the prestigious TATA Crucible Campus Quiz, winning the Tamil Nadu state runner-up position.", date: "Jul 2025", color: "#B45309", emoji: "🧠", rank: "State Runner-Up", isTeam: true },
  { id: 9, category: "Cultural", title: "IIT Bombay Mood Indigo – Classical Music 1st Place", student: "Karthik S (3rd Year CSE)", dept: "CSE", award: "1st Place + ₹15,000", desc: "Won 1st place in the Classical Music (Carnatic Vocal) competition at IIT Bombay's Mood Indigo – Asia's largest college cultural fest.", date: "Dec 2025", color: "#16A34A", emoji: "🎵", rank: "1st Place – National", isTeam: false },
  { id: 10, category: "Sports", title: "Tamil Nadu State Boxing Championship", student: "Aravind K (20MECH)", dept: "MECH", award: "Gold Medal – 60kg category", desc: "Won the Gold Medal in the 60kg weight category at the Tamil Nadu State Boxing Championship, representing BIT Sathy and Erode district.", date: "Sep 2025", color: "#DC2626", emoji: "🥊", rank: "State Gold Medalist", isTeam: false },
  { id: 11, category: "Academic", title: "ISRO Scholarship – Young Scientist Programme", student: "Divya M (3rd Year ECE)", dept: "ECE", award: "ISRO YSP Scholarship 2025", desc: "Selected for the prestigious ISRO Young Scientist Programme (YUVIKA) 2025, one of only 3 students from Tamil Nadu.", date: "Jun 2025", color: "#5540DE", emoji: "🚀", rank: "National Selection", isTeam: false },
  { id: 12, category: "Technical", title: "Google Solution Challenge 2025 – Top 100 Global", student: "Team InnovateBIT (4 members)", dept: "CSE/IT", award: "Top 100 Global + Google Swag", desc: "BIT Sathy's team reached the Top 100 Global teams in Google's Solution Challenge 2025, building an AI-powered agriculture advisory app for Indian farmers.", date: "May 2025", color: "#059669", emoji: "🌍", rank: "Top 100 Global", isTeam: true },
];

const CATEGORIES = ["All", "Technical", "Academic", "Sports", "Cultural"];
const CAT_COLORS: Record<string, string> = { Technical: "#5540DE", Academic: "#D97706", Sports: "#059669", Cultural: "#EC4899" };

export function AchievementsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [achievements, setAchievements] = useState<Achievement[]>(initAchievements);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState({ category: "Technical", title: "", student: "", dept: "", award: "", desc: "", date: "", color: "#5540DE", emoji: "🏆", rank: "", isTeam: false });

  const filtered = achievements.filter(a =>
    (filter === "All" || a.category === filter) &&
    (!search || a.title.toLowerCase().includes(search.toLowerCase()) || a.student.toLowerCase().includes(search.toLowerCase()) || a.dept.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setEditing(null); setForm({ category: "Technical", title: "", student: "", dept: "", award: "", desc: "", date: "", color: "#5540DE", emoji: "🏆", rank: "", isTeam: false }); setShowModal(true); };
  const openEdit = (a: Achievement) => { setEditing(a); setForm({ category: a.category, title: a.title, student: a.student, dept: a.dept, award: a.award, desc: a.desc, date: a.date, color: a.color, emoji: a.emoji, rank: a.rank, isTeam: a.isTeam }); setShowModal(true); };
  const save = () => {
    if (!form.title.trim()) return;
    if (editing) setAchievements(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a));
    else setAchievements(prev => [...prev, { id: Date.now(), ...form }]);
    setShowModal(false);
  };
  const remove = (id: number) => setAchievements(prev => prev.filter(a => a.id !== id));

  const stats = CATEGORIES.slice(1).map(cat => ({ cat, count: achievements.filter(a => a.category === cat).length }));

  return (
    <div className="flex flex-col gap-6 pb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero */}
      <div className="rounded-[2.5rem] p-8 mb-4 relative overflow-hidden bento-card-strong shadow-2xl border-none" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
        <div className="relative z-10">
          <p className="text-indigo-200 text-[10px] mb-2 tracking-[0.2em] font-bold uppercase">Hall of Fame</p>
          <h2 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Achievements Wall 🏅</h2>
          <p className="text-indigo-100/90 text-sm font-medium">Celebrating BIT Sathy's excellence across academics, technology, sports, and culture.</p>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
      </div>

      {/* Category stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ cat, count }) => (
          <div key={cat} className="bento-card-strong rounded-[2.5rem] p-6 text-center shadow-lg border-none hover:-translate-y-1 transition-transform">
            <p className="text-3xl mb-1" style={{ fontWeight: 800, color: CAT_COLORS[cat] }}>{count}</p>
            <p className="text-gray-500 text-sm font-semibold">{cat}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search + Add */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[16rem] rounded-[1.5rem] px-5 py-3.5 bento-card shadow-sm border-none">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search achievements..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 font-medium" />
          </div>
          {isAdmin && (
            <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90" style={{ background: "#5540DE", fontWeight: 600 }}>
              <Plus size={14} /> Add Achievement
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-3.5 py-1.5 rounded-full text-xs transition-all"
              style={{ background: filter === cat ? (CAT_COLORS[cat] || "#5540DE") : "rgba(255,255,255,0.75)", color: filter === cat ? "white" : "#4B5563", fontWeight: filter === cat ? 600 : 500, border: filter === cat ? "none" : "1px solid rgba(255,255,255,0.6)", boxShadow: filter === cat ? "0 3px 10px rgba(85,64,222,0.3)" : "none" }}>
              {cat}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} achievements</span>
        </div>
      </div>

      {/* Top 3 spotlight */}
      {filter === "All" && !search && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
          {achievements.slice(0, 3).map((a, idx) => (
            <div key={a.id} className="bento-card-strong rounded-[2.5rem] overflow-hidden relative border-none transition-all hover:-translate-y-2 hover:shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${a.color}15, ${a.color}05)`, boxShadow: idx === 0 ? `0 12px 40px ${a.color}25` : `0 8px 32px ${a.color}10` }}>
              {idx === 0 && <div className="absolute top-4 right-5 text-3xl">👑</div>}
              <div className="p-7">
                <div className="text-5xl mb-4">{a.emoji}</div>
                <span className="text-xs px-3 py-1.5 rounded-full text-white mb-3 inline-block shadow-sm" style={{ background: a.color, fontWeight: 700 }}>{a.rank}</span>
                <h3 className="text-gray-800 text-lg mt-2" style={{ fontWeight: 800, lineHeight: 1.3 }}>{a.title}</h3>
                <p className="text-gray-500 text-sm mt-2 font-medium">{a.student}</p>
                <p className="text-gray-400 text-xs mt-1">{a.dept} · {a.date}</p>
                <div className="mt-4 rounded-[1.25rem] p-3.5" style={{ background: `${a.color}15` }}>
                  <p className="text-sm flex items-center gap-2" style={{ color: a.color, fontWeight: 700 }}><Award size={16} /> {a.award}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All achievements grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.slice(filter === "All" && !search ? 3 : 0).map(a => (
          <div key={a.id} className="bento-card rounded-[2.5rem] overflow-hidden group relative transition-all hover:-translate-y-2 hover:shadow-xl border-none"
            style={{ boxShadow: `0 8px 32px ${a.color}10` }}>
            <div className="h-2" style={{ background: `linear-gradient(90deg, ${a.color}, ${a.color}60)` }} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm" style={{ background: `${a.color}15` }}>{a.emoji}</div>
                  <div>
                    <span className="text-xs px-2.5 py-1 rounded-full text-white shadow-sm" style={{ background: CAT_COLORS[a.category] || "#5540DE", fontWeight: 600 }}>{a.category}</span>
                    <span className="ml-2 text-xs px-2.5 py-1 rounded-full shadow-sm" style={{ background: `${a.color}15`, color: a.color, fontWeight: 700 }}>{a.isTeam ? "Team" : "Individual"}</span>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(a)} className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center hover:bg-purple-100 transition-colors"><Pencil size={14} className="text-purple-600" /></button>
                    <button onClick={() => remove(a.id)} className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={14} className="text-red-500" /></button>
                  </div>
                )}
              </div>
              <h3 className="text-gray-800 text-base mb-1.5" style={{ fontWeight: 800, lineHeight: 1.4 }}>{a.title}</h3>
              <p className="text-gray-500 text-xs mb-3 font-medium">{a.student} — {a.dept}</p>
              <p className="text-gray-600 text-xs leading-relaxed mb-4">{a.desc}</p>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <span className="text-sm flex items-center gap-1" style={{ color: a.color, fontWeight: 700 }}>🏅 {a.rank}</span>
                <span className="text-gray-400 text-xs font-medium">{a.date}</span>
              </div>
              <div className="mt-3 rounded-2xl p-3" style={{ background: `${a.color}08`, border: `1px solid ${a.color}15` }}>
                <p className="text-xs text-gray-700 font-semibold flex items-center gap-1.5"><Award size={14} style={{ display: "inline", color: a.color }} /> {a.award}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-400 text-sm">No achievements found. Try adjusting your search.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" style={{ backgroundColor: "rgba(10, 5, 25, 0.65)", backdropFilter: "blur(12px)" }}>
          <div className="w-full max-w-md rounded-[2.5rem] p-8 bento-card-strong shadow-2xl border-none max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800 text-xl" style={{ fontWeight: 800 }}>{editing ? "Edit" : "Add"} Achievement</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              {[{ l: "Title *", k: "title" }, { l: "Student / Team", k: "student" }, { l: "Department", k: "dept" }, { l: "Rank / Position", k: "rank" }, { l: "Award / Prize", k: "award" }, { l: "Date (e.g. Dec 2025)", k: "date" }, { l: "Emoji", k: "emoji" }].map(({ l, k }) => (
                <div key={k}>
                  <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>{l}</label>
                  <input value={(form as Record<string, string | boolean>)[k] as string} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Description</label>
                <textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE] resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]">
                  {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={form.isTeam} onChange={e => setForm(p => ({ ...p, isTeam: e.target.checked }))}
                  className="w-4 h-4 rounded" style={{ accentColor: "#5540DE" }} />
                <label className="text-sm text-gray-700" style={{ fontWeight: 500 }}>Team Achievement</label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl text-white text-sm hover:opacity-90 flex items-center justify-center gap-1.5" style={{ background: "#5540DE", fontWeight: 600 }}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}