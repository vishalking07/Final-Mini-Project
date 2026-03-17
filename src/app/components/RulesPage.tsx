import { useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const initialSections = [
  { id: "attendance", title: "Attendance & Punctuality", icon: "📅", color: "#5540DE", rules: ["Minimum 75% attendance is mandatory to appear for end semester examinations.", "Students must arrive on time for all classes; latecomers may be marked absent.", "Leave applications must be submitted in advance through the BIP portal.", "Medical leave requires a valid doctor's certificate submitted within 3 days of return.", "Attendance is monitored biometrically; proxy attendance is a punishable offence."] },
  { id: "conduct", title: "Code of Conduct", icon: "⚖️", color: "#059669", rules: ["Students must maintain decorum and respect towards faculty, staff and fellow students.", "Use of mobile phones is strictly prohibited during class hours.", "Ragging in any form is a criminal offence and will lead to immediate expulsion.", "Students must wear ID cards within the campus premises at all times.", "Any form of harassment, discrimination or bullying will result in disciplinary action."] },
  { id: "dress", title: "Dress Code", icon: "👔", color: "#0891B2", rules: ["Boys: Light blue shirt and dark blue trousers on all working days.", "Girls: Light blue churidhar/salwar with dupatta on all working days.", "Formal shoes are mandatory; sandals and chappals are not permitted in classrooms.", "College uniform is mandatory for all examinations and official events.", "Neat and proper attire must be maintained at all times within the campus."] },
  { id: "hostel", title: "Hostel Rules", icon: "🏠", color: "#7C3AED", rules: ["Hostel in-time is 9:00 PM on weekdays and 10:00 PM on weekends.", "Permission from warden is mandatory for going out during weekends.", "No guests are allowed inside hostel rooms without prior approval.", "Students must maintain cleanliness in rooms and common areas.", "Ragging, consumption of alcohol or tobacco is strictly prohibited in hostel premises."] },
  { id: "academic", title: "Academic Integrity", icon: "📖", color: "#DC2626", rules: ["Plagiarism in assignments, projects or examinations is a serious offence.", "Malpractice during examinations will lead to cancellation of that paper.", "Assignments must be submitted on time; late submissions will attract penalty.", "All projects and papers must be the student's own original work.", "Academic misconduct will be reported to the university and may affect graduation."] },
  { id: "campus", title: "Campus Rules", icon: "🏫", color: "#B45309", rules: ["Students must not loiter in corridors during class hours.", "Littering on campus is prohibited; use designated dustbins.", "Library books must be returned on time to avoid fines.", "Students must park vehicles only in designated parking areas.", "Damage to college property will be recovered from the responsible student."] },
];

export function RulesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [open, setOpen] = useState<string | null>("attendance");
  const [sections, setSections] = useState(initialSections);
  const [editing, setEditing] = useState<string | null>(null);
  const [editRules, setEditRules] = useState<string[]>([]);

  const startEdit = (id: string) => {
    const s = sections.find(x => x.id === id);
    if (s) { setEditRules([...s.rules]); setEditing(id); }
  };
  const saveEdit = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, rules: editRules.filter(r => r.trim()) } : s));
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="rounded-[2.5rem] p-8 mb-2 relative overflow-hidden bento-card-strong shadow-2xl border-none" style={{ background: "linear-gradient(135deg,#5540DE 0%,#2e2378 100%)" }}>
        <div className="relative z-10">
          <p className="text-indigo-200 text-[10px] mb-2 tracking-[0.2em] font-bold uppercase">
            Student Guidelines
          </p>
          <h2 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Rules & Regulations</h2>
          <p className="text-indigo-100/90 text-sm font-medium">
            All students must adhere to these rules. Violations may lead to disciplinary action.
            {isAdmin && <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-xs shadow-sm inline-block mt-2 sm:mt-0">Admin: click Edit to modify rules</span>}
          </p>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
      </div>

      <div className="bento-card rounded-[2rem] p-6 flex items-start gap-4 mb-2 shadow-sm" style={{ border: "1px solid rgba(255,160,0,0.35)", background: "rgba(255,200,100,0.15)" }}>
        <span className="text-2xl mt-0.5">⚠️</span>
        <p className="text-amber-800 text-sm leading-relaxed font-medium">Violation of any rules may lead to disciplinary action including suspension or expulsion from the institution.</p>
      </div>

      {sections.map(sec => (
        <div key={sec.id} className="bento-card-strong rounded-[2.5rem] overflow-hidden border-none hover:shadow-xl transition-all shadow-md">
          <div className="flex items-center justify-between p-6">
            <button className="flex items-center gap-4 flex-1 text-left" onClick={() => setOpen(open === sec.id ? null : sec.id)}>
              <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-2xl shadow-sm" style={{ backgroundColor: `${sec.color}15` }}>{sec.icon}</div>
              <span className="text-gray-800 text-lg" style={{ fontWeight: 700 }}>{sec.title}</span>
              <span className="px-3 py-1 rounded-full text-white text-xs shadow-sm ml-2" style={{ backgroundColor: sec.color, fontWeight: 600 }}>{sec.rules.length} rules</span>
            </button>
            <div className="flex items-center gap-2">
              {isAdmin && editing !== sec.id && (
                <button onClick={() => { setOpen(sec.id); startEdit(sec.id); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs hover:opacity-90"
                  style={{ background: `${sec.color}15`, color: sec.color, fontWeight: 600 }}>
                  <Pencil size={11} /> Edit
                </button>
              )}
              <button onClick={() => setOpen(open === sec.id ? null : sec.id)} style={{ color: sec.color }}>
                {open === sec.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>

          {open === sec.id && (
            <div className="px-5 pb-5">
              <div className="w-full h-px bg-gray-100 mb-4" />
              {editing !== sec.id ? (
                <ol className="flex flex-col gap-3">
                  {sec.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5" style={{ backgroundColor: sec.color, fontWeight: 600 }}>{i + 1}</span>
                      <p className="text-gray-600 text-sm leading-relaxed">{rule}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="flex flex-col gap-3">
                  {editRules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-2" style={{ backgroundColor: sec.color, fontWeight: 600 }}>{i + 1}</span>
                      <textarea value={rule} onChange={e => { const r = [...editRules]; r[i] = e.target.value; setEditRules(r); }}
                        rows={2} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE] resize-none" />
                      <button onClick={() => setEditRules(prev => prev.filter((_, idx) => idx !== i))} className="mt-2 text-red-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => setEditRules(prev => [...prev, ""])} className="flex items-center gap-2 text-sm mt-1 hover:opacity-80" style={{ color: sec.color, fontWeight: 600 }}>
                    <Plus size={14} /> Add Rule
                  </button>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">
                      <X size={13} /> Cancel
                    </button>
                    <button onClick={() => saveEdit(sec.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm hover:opacity-90" style={{ background: sec.color, fontWeight: 600 }}>
                      <Save size={13} /> Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}