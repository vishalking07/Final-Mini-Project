import { useState } from "react";

const departments = [
  { id: 1, short: "CSE", name: "Computer Science & Engineering", icon: "💻", color: "#5540DE", hod: "Dr. K Muthukumar", students: 480, established: 2001, accreditation: "NBA Accredited", programs: ["B.E CSE", "M.E CSE", "Ph.D"], desc: "The CSE department is one of the flagship departments offering comprehensive programs in computing, software engineering, AI, and data science." },
  { id: 2, short: "ECE", name: "Electronics & Communication Engineering", icon: "📡", color: "#059669", hod: "Dr. S Annadurai", students: 360, established: 2001, accreditation: "NBA Accredited", programs: ["B.E ECE", "M.E VLSI", "Ph.D"], desc: "ECE department focuses on electronics, communication systems, VLSI design, embedded systems and wireless communications." },
  { id: 3, short: "EEE", name: "Electrical & Electronics Engineering", icon: "⚡", color: "#D97706", hod: "Dr. V Rajasekar", students: 240, established: 2001, accreditation: "NBA Accredited", programs: ["B.E EEE", "M.E Power Systems"], desc: "EEE department covers power systems, control systems, machines, and power electronics with state-of-the-art laboratories." },
  { id: 4, short: "MECH", name: "Mechanical Engineering", icon: "⚙️", color: "#DC2626", hod: "Dr. R Senthilkumar", students: 360, established: 2001, accreditation: "NBA Accredited", programs: ["B.E Mechanical", "M.E CAD/CAM", "Ph.D"], desc: "Mechanical engineering department covers design, manufacturing, thermal engineering, and production technology." },
  { id: 5, short: "CIVIL", name: "Civil Engineering", icon: "🏗️", color: "#7C3AED", hod: "Dr. P Murugesan", students: 240, established: 2001, accreditation: "NBA Accredited", programs: ["B.E Civil", "M.E Structural Engg"], desc: "Civil engineering department focuses on structural design, environmental engineering, transportation, and geotechnical engineering." },
  { id: 6, short: "IT", name: "Information Technology", icon: "🖥️", color: "#0891B2", hod: "Dr. N Krishnamurthy", students: 240, established: 2002, accreditation: "NBA Accredited", programs: ["B.Tech IT", "M.Tech IT"], desc: "IT department emphasizes software development, networking, cybersecurity, cloud computing, and information systems." },
  { id: 7, short: "AIML", name: "Artificial Intelligence & Machine Learning", icon: "🤖", color: "#EC4899", hod: "Dr. S Kavitha", students: 180, established: 2020, accreditation: "New Department", programs: ["B.E AI&ML"], desc: "A cutting-edge department offering specialization in artificial intelligence, machine learning, deep learning, and data science." },
  { id: 8, short: "AIDS", name: "Artificial Intelligence & Data Science", icon: "📊", color: "#F59E0B", hod: "Dr. M Priya", students: 180, established: 2021, accreditation: "New Department", programs: ["B.Tech AI&DS"], desc: "Focused on data science, big data analytics, AI-driven insights, and intelligent systems design." },
  { id: 9, short: "CHEM", name: "Chemical Engineering", icon: "⚗️", color: "#10B981", hod: "Dr. A Rajendran", students: 120, established: 2004, accreditation: "NBA Accredited", programs: ["B.E Chemical", "M.E Chemical"], desc: "Chemical engineering department covers process design, thermodynamics, reaction engineering, and industrial chemistry." },
  { id: 10, short: "BIO", name: "Biotechnology", icon: "🧬", color: "#6366F1", hod: "Dr. K Amutha", students: 120, established: 2004, accreditation: "Affiliated", programs: ["B.Tech Biotech", "M.Tech Biotech"], desc: "Biotechnology department integrates engineering principles with biological sciences, covering genetic engineering and bioinformatics." },
  { id: 11, short: "MCA", name: "Master of Computer Applications", icon: "🎓", color: "#8B5CF6", hod: "Dr. R Thirumalai", students: 60, established: 2003, accreditation: "Affiliated", programs: ["MCA (3 Years)"], desc: "MCA program provides in-depth knowledge of computer applications, software development, and IT management for graduates." },
  { id: 12, short: "MBA", name: "Master of Business Administration", icon: "💼", color: "#0D9488", hod: "Dr. S Saravanan", students: 120, established: 2005, accreditation: "Affiliated", programs: ["MBA (2 Years)"], desc: "MBA program focuses on business management, finance, marketing, human resources, and entrepreneurship." },
  { id: 13, short: "MATH", name: "Mathematics", icon: "📐", color: "#B45309", hod: "Dr. P Selvaraj", students: 0, established: 2001, accreditation: "Service Department", programs: ["M.Sc Mathematics", "Ph.D"], desc: "Mathematics department provides foundational mathematical education to all engineering students and offers postgraduate programs." },
  { id: 14, short: "PHY", name: "Physics & Chemistry", icon: "🔬", color: "#4B5563", hod: "Dr. M Sundaram", students: 0, established: 2001, accreditation: "Service Department", programs: ["M.Sc Physics", "M.Sc Chemistry"], desc: "Applied sciences department covering physics and chemistry as foundation sciences for engineering education." },
];

export function DepartmentsPage() {
  const [selected, setSelected] = useState<typeof departments[0] | null>(null);

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="rounded-[2.5rem] p-8 mb-4 relative overflow-hidden bento-card-strong shadow-2xl border-none" style={{ background: "linear-gradient(135deg,#5540DE 0%,#2e2378 100%)" }}>
        <div className="relative z-10">
          <p className="text-indigo-200 text-[10px] mb-2 tracking-[0.2em] uppercase font-bold">Academic Schools</p>
          <h2 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Departments</h2>
          <p className="text-indigo-100/90 text-sm font-medium">BIT Sathy offers 14+ departments across engineering, technology, science, and management.</p>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {departments.map(dept => (
          <button key={dept.id} onClick={() => setSelected(selected?.id === dept.id ? null : dept)}
            className="bento-card rounded-[2rem] p-6 text-left transition-all hover:shadow-xl hover:-translate-y-2 border-none"
            style={{
              background: selected?.id === dept.id ? `linear-gradient(135deg,${dept.color},${dept.color}cc)` : "var(--glass-bg)",
              boxShadow: selected?.id === dept.id ? `0 12px 32px ${dept.color}40` : "0 4px 16px rgba(85,64,222,0.06)",
            }}>
            <div className="text-2xl mb-2">{dept.icon}</div>
            <p className="text-xs mb-0.5" style={{ fontWeight: 700, color: selected?.id === dept.id ? "rgba(255,255,255,0.8)" : dept.color }}>{dept.short}</p>
            <p className="text-sm leading-tight" style={{ fontWeight: 600, color: selected?.id === dept.id ? "white" : "#1F2937" }}>{dept.name}</p>
            {dept.students > 0 && <p className="text-xs mt-1" style={{ color: selected?.id === dept.id ? "rgba(255,255,255,0.7)" : "#6B7280" }}>{dept.students} students</p>}
          </button>
        ))}
      </div>

      {selected && (
        <div className="bento-card-strong rounded-[2.5rem] p-8 mt-4 border-none shadow-2xl" style={{ border: `2px solid ${selected.color}20` }}>
          <div className="flex items-start gap-5 mb-5">
            <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl shrink-0 shadow-sm" style={{ backgroundColor: `${selected.color}15` }}>{selected.icon}</div>
            <div className="flex-1">
              <h3 className="text-gray-800 text-lg" style={{ fontWeight: 700 }}>{selected.name}</h3>
              <p className="text-sm mt-0.5" style={{ color: selected.color }}>HOD: {selected.hod}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: selected.color }}>{selected.accreditation}</span>
                <span className="text-gray-500 text-xs">Est. {selected.established}</span>
                {selected.students > 0 && <span className="text-gray-500 text-xs">{selected.students} students enrolled</span>}
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{selected.desc}</p>
          <div>
            <p className="text-gray-700 text-sm mb-2" style={{ fontWeight: 600 }}>Programs Offered</p>
            <div className="flex gap-2 flex-wrap">
              {selected.programs.map(p => (
                <span key={p} className="px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: selected.color }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}