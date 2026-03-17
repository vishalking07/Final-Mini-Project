import { useState } from "react";
import { Mail, Search, ExternalLink, ChevronDown, ChevronUp, BookOpen, Briefcase } from "lucide-react";

const PHOTOS = {
  male1: "https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  male2: "https://images.unsplash.com/photo-1581125119293-4803aa54b372?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  male3: "https://images.unsplash.com/photo-1769636929231-3cd7f853d038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  female1: "https://images.unsplash.com/photo-1758685848602-09e52ef9c7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  female2: "https://images.unsplash.com/photo-1770235622504-3851a96ac6ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  female3: "https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
};

const faculties = [
  { id: 1, name: "Dr. K Muthukumar", dept: "CSE", role: "Professor & HoD", qual: "Ph.D – IIT Madras", exp: "22 years", email: "muthukumar@bitsathy.ac.in", specialization: "Machine Learning, Data Mining", color: "#5540DE", photo: PHOTOS.male1, isHoD: true },
  { id: 2, name: "Dr. S Annadurai", dept: "ECE", role: "Professor & HoD", qual: "Ph.D – NIT Trichy", exp: "20 years", email: "annadurai@bitsathy.ac.in", specialization: "VLSI Design, Embedded Systems", color: "#059669", photo: PHOTOS.male2, isHoD: true },
  { id: 3, name: "Dr. V Rajasekar", dept: "EEE", role: "Professor & HoD", qual: "Ph.D – Anna University", exp: "18 years", email: "rajasekar@bitsathy.ac.in", specialization: "Power Systems, Renewable Energy", color: "#D97706", photo: null, isHoD: true },
  { id: 4, name: "Dr. R Senthilkumar", dept: "MECH", role: "Professor & HoD", qual: "Ph.D – IIT Delhi", exp: "19 years", email: "senthilkumar@bitsathy.ac.in", specialization: "CAD/CAM, Manufacturing", color: "#DC2626", photo: PHOTOS.male3, isHoD: true },
  { id: 5, name: "Dr. P Murugesan", dept: "CIVIL", role: "Professor & HoD", qual: "Ph.D – Anna University", exp: "21 years", email: "murugesan@bitsathy.ac.in", specialization: "Structural Engineering, GIS", color: "#7C3AED", photo: null, isHoD: true },
  { id: 6, name: "Dr. N Krishnamurthy", dept: "IT", role: "Professor & HoD", qual: "Ph.D – VIT", exp: "15 years", email: "krishnamurthy@bitsathy.ac.in", specialization: "Cybersecurity, Cloud Computing", color: "#0891B2", photo: null, isHoD: true },
  { id: 7, name: "Dr. S Kavitha", dept: "AI&ML", role: "Assoc. Prof. & HoD", qual: "Ph.D – PSG Tech", exp: "12 years", email: "kavitha@bitsathy.ac.in", specialization: "Deep Learning, NLP", color: "#EC4899", photo: PHOTOS.female1, isHoD: true },
  { id: 8, name: "Dr. M Priya", dept: "AI&DS", role: "Assoc. Prof. & HoD", qual: "Ph.D – Coimbatore Institute", exp: "11 years", email: "priya@bitsathy.ac.in", specialization: "Big Data, Data Analytics", color: "#F59E0B", photo: PHOTOS.female3, isHoD: true },
  { id: 9, name: "Mr. K Sundaramurthy", dept: "CSE", role: "Assistant Professor", qual: "M.E CSE – Anna University", exp: "8 years", email: "sundaramurthy@bitsathy.ac.in", specialization: "Web Technologies, DBMS", color: "#5540DE", photo: null, isHoD: false },
  { id: 10, name: "Ms. R Dharani", dept: "ECE", role: "Assistant Professor", qual: "M.E Communication – NIT Trichy", exp: "6 years", email: "dharani@bitsathy.ac.in", specialization: "Signal Processing, IoT", color: "#059669", photo: PHOTOS.female2, isHoD: false },
  { id: 11, name: "Mr. P Vetriselvan", dept: "MECH", role: "Assistant Professor", qual: "M.E CAD/CAM", exp: "9 years", email: "vetriselvan@bitsathy.ac.in", specialization: "Thermal Engineering, Fluid Mechanics", color: "#DC2626", photo: null, isHoD: false },
  { id: 12, name: "Ms. G Saranya", dept: "IT", role: "Assistant Professor", qual: "M.Tech IT – VIT", exp: "7 years", email: "saranya@bitsathy.ac.in", specialization: "Mobile Computing, Software Engineering", color: "#0891B2", photo: null, isHoD: false },
];

const departments = ["All", "CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AI&ML", "AI&DS"];

function getInitials(name: string) {
  return name.split(" ").filter(n => !["Dr.", "Mr.", "Ms."].includes(n)).slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function FacultyCard({ faculty }: { faculty: typeof faculties[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bento-card rounded-[2.5rem] overflow-hidden group transition-all hover:-translate-y-2 hover:shadow-xl border-none"
      style={{ boxShadow: `0 8px 32px ${faculty.color}18` }}>
      {/* Top bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${faculty.color}, ${faculty.color}60)` }} />

      <div className="flex flex-row items-start gap-4 p-4">
        {/* Photo */}
        <div className="shrink-0">
          {faculty.photo ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden" style={{ border: `2px solid ${faculty.color}30`, boxShadow: `0 4px 12px ${faculty.color}25` }}>
              <img src={faculty.photo} alt={faculty.name} className="w-full h-full object-cover object-top" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-base"
              style={{ background: `linear-gradient(135deg, ${faculty.color}, ${faculty.color}aa)`, fontWeight: 700, boxShadow: `0 4px 12px ${faculty.color}30` }}>
              {getInitials(faculty.name)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm leading-tight" style={{ fontWeight: 700, color: "var(--foreground)" }}>{faculty.name}</h3>
              <p className="text-xs mt-0.5" style={{ color: faculty.color, fontWeight: 500 }}>{faculty.role}</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] text-white shrink-0" style={{ background: faculty.color, fontWeight: 600 }}>
              {faculty.dept}
            </span>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
              <BookOpen size={11} /><span>{faculty.qual}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
              <Briefcase size={11} /><span>{faculty.exp} experience</span>
            </div>
          </div>

          {/* Expandable specialization */}
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] mt-2 transition-colors"
            style={{ color: faculty.color, fontWeight: 600 }}>
            {expanded ? <><ChevronUp size={11} /> Less</> : <><ChevronDown size={11} /> Specialization</>}
          </button>
          {expanded && (
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{faculty.specialization}</p>
          )}

          {/* Email */}
          <a href={`mailto:${faculty.email}`}
            className="flex items-center gap-1.5 mt-2 text-[11px] truncate"
            style={{ color: faculty.color, fontWeight: 500 }}>
            <Mail size={11} /><span className="truncate">{faculty.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function HoDCard({ faculty }: { faculty: typeof faculties[0] }) {
  return (
    <div className="bento-card-strong rounded-[2.5rem] overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all border-none"
      style={{ boxShadow: `0 12px 40px ${faculty.color}25` }}>

      {/* Gradient header */}
      <div className="relative p-5 pb-16" style={{ background: `linear-gradient(135deg, ${faculty.color}22, ${faculty.color}06)` }}>
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2.5 py-1 rounded-full text-xs text-white" style={{ background: faculty.color, fontWeight: 600 }}>
              {faculty.dept}
            </span>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: `${faculty.color}15`, color: faculty.color, fontWeight: 600 }}>HoD</span>
        </div>
      </div>

      {/* Content with photo overlap */}
      <div className="px-5 pb-5 -mt-12">
        <div className="flex items-end gap-4 mb-4">
          {faculty.photo ? (
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0"
              style={{ border: `3px solid var(--glass-bg-strong)`, boxShadow: `0 6px 20px ${faculty.color}30` }}>
              <img src={faculty.photo} alt={faculty.name} className="w-full h-full object-cover object-top" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xl shrink-0"
              style={{ background: `linear-gradient(135deg, ${faculty.color}, ${faculty.color}88)`, fontWeight: 700, boxShadow: `0 6px 20px ${faculty.color}30` }}>
              {getInitials(faculty.name)}
            </div>
          )}
          <div className="pb-1 flex-1 min-w-0">
            <h3 className="text-sm leading-tight" style={{ fontWeight: 700, color: "var(--foreground)" }}>{faculty.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: faculty.color, fontWeight: 500 }}>{faculty.role}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { icon: BookOpen, label: faculty.qual },
            { icon: Briefcase, label: faculty.exp + " experience" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <item.icon size={12} style={{ color: faculty.color, flexShrink: 0 }} />
              <span>{item.label}</span>
            </div>
          ))}

          <p className="text-xs mt-1 leading-snug p-3 rounded-2xl" style={{ color: "var(--muted-foreground)", background: "var(--surface-inset)" }}>
            🔬 {faculty.specialization}
          </p>

          <a href={`mailto:${faculty.email}`}
            className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl text-xs transition-all"
            style={{ background: `${faculty.color}10`, color: faculty.color, border: `1px solid ${faculty.color}20`, fontWeight: 500 }}>
            <Mail size={12} /><span className="truncate">{faculty.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function FacultiesPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showType, setShowType] = useState<"all" | "hod" | "staff">("all");

  const filtered = faculties.filter(f =>
    (filter === "All" || f.dept === filter) &&
    (showType === "all" || (showType === "hod" ? f.isHoD : !f.isHoD)) &&
    (f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.dept.toLowerCase().includes(search.toLowerCase()) ||
      f.specialization.toLowerCase().includes(search.toLowerCase()))
  );

  const hods = filtered.filter(f => f.isHoD);
  const staff = filtered.filter(f => !f.isHoD);

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="rounded-[2.5rem] p-8 relative overflow-hidden bento-card-strong shadow-2xl border-none" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
        <div className="relative z-10">
          <p className="text-indigo-200 text-[10px] mb-2 tracking-[0.2em] uppercase font-bold">Academic Faculty</p>
          <h2 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Faculty Directory</h2>
          <p className="text-indigo-100/90 text-sm font-medium">
            Meet our distinguished faculty — experts, researchers and mentors shaping future engineers.
          </p>
          <div className="flex gap-6 mt-6">
            {[
              { label: "Total Faculty", value: faculties.length + "+" },
              { label: "HoDs", value: faculties.filter(f => f.isHoD).length },
              { label: "Departments", value: departments.length - 1 },
            ].map(s => (
              <div key={s.label}>
                <p className="text-white text-2xl" style={{ fontWeight: 800 }}>{s.value}</p>
                <p className="text-indigo-200/80 text-xs font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl z-0" />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-52 bento-card rounded-[1.5rem] shadow-sm">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, dept or specialization…"
              className="w-full rounded-[1.5rem] pl-12 pr-5 py-3 text-sm outline-none bg-transparent font-medium"
              style={{ color: "var(--foreground)" }} />
          </div>
          {/* Type filter */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            {([["all", "All"], ["hod", "HoDs"], ["staff", "Staff"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setShowType(k)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{ background: showType === k ? "#5540DE" : "transparent", color: showType === k ? "white" : "var(--muted-foreground)", fontWeight: showType === k ? 600 : 500 }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {departments.map(d => (
            <button key={d} onClick={() => setFilter(d)}
              className="px-3.5 py-1.5 rounded-full text-xs transition-all"
              style={{
                background: filter === d ? "#5540DE" : "var(--glass-bg)",
                color: filter === d ? "white" : "var(--muted-foreground)",
                fontWeight: filter === d ? 600 : 500,
                border: filter === d ? "none" : "1px solid var(--glass-border)",
                boxShadow: filter === d ? "0 3px 10px rgba(85,64,222,0.3)" : "none",
              }}>
              {d}
            </button>
          ))}
          <span className="text-xs ml-auto" style={{ color: "var(--muted-foreground)", fontWeight: 500 }}>
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </span>
        </div>
      </div>

      {/* HoD Section */}
      {hods.length > 0 && (showType === "all" || showType === "hod") && (
        <div className="mt-4">
          <h3 className="text-lg mb-6 flex items-center gap-3" style={{ fontWeight: 800, color: "var(--foreground)" }}>
            <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs shadow-sm bg-gradient-to-br from-[#5540DE] to-[#3a28ab]">H</span>
            Heads of Department
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hods.map(f => <HoDCard key={f.id} faculty={f} />)}
          </div>
        </div>
      )}

      {/* Other Faculty Section */}
      {staff.length > 0 && (showType === "all" || showType === "staff") && (
        <div className="mt-4">
          <h3 className="text-lg mb-6 flex items-center gap-3" style={{ fontWeight: 800, color: "var(--foreground)" }}>
            <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs shadow-sm bg-gradient-to-br from-[#059669] to-[#047857]">F</span>
            Faculty Members
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {staff.map(f => <FacultyCard key={f.id} faculty={f} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-sm" style={{ fontWeight: 500, color: "var(--muted-foreground)" }}>No faculty found matching your search.</p>
          <button onClick={() => { setSearch(""); setFilter("All"); setShowType("all"); }} className="mt-3 text-[#5540DE] text-xs" style={{ fontWeight: 600 }}>
            Clear filters →
          </button>
        </div>
      )}
    </div>
  );
}