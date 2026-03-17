import { useState, useEffect } from "react";
import {
    Users, Search, Filter, Plus, Pencil, Trash2, Eye, X, Save,
    GraduationCap, Mail, Phone, BookOpen, User, ChevronDown,
} from "lucide-react";
import { AuthUser } from "../context/AuthContext";

const DEPARTMENTS = [
    "All Departments",
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Information Technology",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical & Electronics Engineering",
];
const YEARS = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];
const SECTIONS = ["All Sections", "A", "B", "C", "D"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

type ModalMode = "view" | "edit" | "add" | null;

const emptyForm = (): Partial<AuthUser> => ({
    name: "", email: "", rollNo: "", department: DEPARTMENTS[1],
    year: "1st Year", section: "A", phone: "", dob: "", bloodGroup: "O+", address: "",
});

import { INITIAL_USERS } from "../context/AuthContext";

export function AdminStudentsPage() {
    const [students, setStudents] = useState<AuthUser[]>(() => {
        const saved = localStorage.getItem("bit_students");
        if (saved) return JSON.parse(saved);
        return INITIAL_USERS.filter(u => u.role === "student");
    });
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All Departments");
    const [yearFilter, setYearFilter] = useState("All Years");
    const [secFilter, setSecFilter] = useState("All Sections");
    const [modal, setModal] = useState<ModalMode>(null);
    const [selected, setSelected] = useState<AuthUser | null>(null);
    const [form, setForm] = useState<Partial<AuthUser>>(emptyForm());
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem("bit_students", JSON.stringify(students));
    }, [students]);

    const filtered = students.filter((s) => {
        const q = search.toLowerCase();
        const matchSearch = !q || s.name.toLowerCase().includes(q) || (s.rollNo || "").toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
        const matchDept = deptFilter === "All Departments" || s.department === deptFilter;
        const matchYear = yearFilter === "All Years" || s.year === yearFilter;
        const matchSec = secFilter === "All Sections" || s.section === secFilter;
        return matchSearch && matchDept && matchYear && matchSec;
    });

    const openView = (s: AuthUser) => { setSelected(s); setModal("view"); };
    const openEdit = (s: AuthUser) => { setSelected(s); setForm({ ...s }); setModal("edit"); };
    const openAdd = () => { setSelected(null); setForm(emptyForm()); setModal("add"); };
    const closeModal = () => { setModal(null); setSelected(null); };

    const saveStudent = () => {
        if (!form.name?.trim() || !form.rollNo?.trim()) return;

        if (modal === "add") {
            setStudents(prev => [...prev, { ...form, id: Date.now().toString(), role: "student" } as AuthUser]);
        } else if (modal === "edit" && selected) {
            setStudents(prev => prev.map(s => s.id === selected.id ? { ...s, ...form } as AuthUser : s));
        }
        closeModal();
    };

    const deleteStudent = (id: string) => {
        setStudents(prev => prev.filter(s => s.id !== id));
        setDeleteConfirm(null);
    };

    const Field = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) => (
        <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EEF2FF", color: "#5540DE" }}>{icon}</div>
            <div><p className="text-gray-400 text-xs">{label}</p><p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{value || "—"}</p></div>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="rounded-[2.5rem] p-8 mb-8 relative overflow-hidden bento-card-strong border-none shadow-2xl" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
                <div className="relative z-10">
                    <p className="text-indigo-200 text-xs mb-2 tracking-[0.2em] font-bold uppercase">Administration</p>
                    <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Student Management</h1>
                    <p className="text-indigo-100/90 text-sm font-medium">View, add, edit and manage all enrolled students across departments.</p>
                </div>
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl z-0" />
                <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl z-0" />
            </div>

            {/* Controls */}
            <div className="bento-card-strong rounded-[2.5rem] p-6 mb-8 flex flex-wrap gap-5 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, roll no, email…"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#5540DE] bg-white/60"
                        style={{ fontFamily: "'Poppins', sans-serif" }} />
                </div>
                {/* Filters */}
                {[
                    { value: deptFilter, set: setDeptFilter, opts: DEPARTMENTS, icon: <GraduationCap size={13} /> },
                    { value: yearFilter, set: setYearFilter, opts: YEARS, icon: <BookOpen size={13} /> },
                    { value: secFilter, set: setSecFilter, opts: SECTIONS, icon: <Filter size={13} /> },
                ].map((f, i) => (
                    <div key={i} className="relative">
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{f.icon}</div>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select value={f.value} onChange={e => f.set(e.target.value)}
                            className="pl-7 pr-7 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none appearance-none focus:border-[#5540DE] bg-white/60"
                            style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                ))}
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-gray-400 text-xs">{filtered.length} student{filtered.length !== 1 ? "s" : ""}</span>
                    <button onClick={openAdd}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
                        style={{ background: "#5540DE", fontWeight: 600 }}>
                        <Plus size={14} /> Add Student
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bento-card rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ background: "var(--surface-inset)", borderBottom: "1px solid var(--bento-border)" }}>
                                {["#", "Student", "Roll No", "Department", "Year / Section", "Contact", "Actions"].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-gray-600 text-xs" style={{ fontWeight: 700 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-16 text-center text-gray-500 text-sm">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                                            <p>Loading students...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-16 text-center text-gray-400 text-sm"><div className="text-4xl mb-3">🔍</div>No students found matching your filters.</td></tr>
                            ) : (
                                filtered.map((s, idx) => (
                                    <tr key={s.id} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs shrink-0" style={{ fontWeight: 700 }}>
                                                    {s.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{s.name}</p>
                                                    <p className="text-gray-400 text-xs">{s.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full text-indigo-700 bg-indigo-50 border border-indigo-100" style={{ fontWeight: 600 }}>{s.rollNo}</span></td>
                                        <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px] truncate">{s.department}</td>
                                        <td className="px-4 py-3"><div><p className="text-gray-700 text-xs" style={{ fontWeight: 600 }}>{s.year}</p><p className="text-gray-400 text-xs">Section {s.section}</p></div></td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{s.phone || "—"}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => openView(s)} className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors" title="View"><Eye size={13} className="text-blue-600" /></button>
                                                <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center hover:bg-purple-100 transition-colors" title="Edit"><Pencil size={13} className="text-purple-600" /></button>
                                                <button onClick={() => setDeleteConfirm(s.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors" title="Delete"><Trash2 size={13} className="text-red-500" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {modal === "view" && selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
                    <div className="w-full max-w-md rounded-[2.5rem] bento-card-strong overflow-hidden shadow-2xl">
                        <div className="p-6 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#5540DE,#2e2378)" }}>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg" style={{ fontWeight: 800 }}>{selected.name.charAt(0)}</div>
                                <div><p className="text-white text-base" style={{ fontWeight: 700 }}>{selected.name}</p><p className="text-white/70 text-xs">{selected.rollNo} · {selected.department}</p></div>
                            </div>
                            <button onClick={closeModal} className="text-white/60 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-5">
                            <Field icon={<Mail size={13} />} label="Email" value={selected.email} />
                            <Field icon={<Phone size={13} />} label="Phone" value={selected.phone} />
                            <Field icon={<BookOpen size={13} />} label="Year & Section" value={`${selected.year} · Section ${selected.section}`} />
                            <Field icon={<User size={13} />} label="Blood Group" value={selected.bloodGroup} />
                            <Field icon={<GraduationCap size={13} />} label="Date of Birth" value={selected.dob ? new Date(selected.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : undefined} />
                            <Field icon={<User size={13} />} label="Address" value={selected.address} />
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Modal */}
            {(modal === "add" || modal === "edit") && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
                    <div className="w-full max-w-lg rounded-[2.5rem] bento-card-strong overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 flex items-center justify-between border-b border-border">
                            <h3 className="text-gray-800 text-xl" style={{ fontWeight: 800 }}>{modal === "add" ? "Add New Student" : "Edit Student"}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="p-5 overflow-y-auto flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { l: "Full Name *", k: "name", ph: "e.g. Vishal S" },
                                    { l: "Roll Number *", k: "rollNo", ph: "e.g. 24CS001" },
                                    { l: "Email", k: "email", ph: "roll@bitsathy.ac.in" },
                                    { l: "Phone", k: "phone", ph: "+91 XXXXX XXXXX" },
                                    { l: "Date of Birth", k: "dob", ph: "", type: "date" },
                                    { l: "Address", k: "address", ph: "City, Tamil Nadu" },
                                ].map(f => (
                                    <div key={f.k}>
                                        <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>{f.l}</label>
                                        <input type={f.type || "text"} value={(form as Record<string, string>)[f.k] || ""} placeholder={f.ph}
                                            onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]" />
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Department</label>
                                    <select value={form.department || ""} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5540DE]">
                                        {DEPARTMENTS.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Year</label>
                                    <select value={form.year || ""} onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5540DE]">
                                        {YEARS.slice(1).map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Section</label>
                                    <select value={form.section || ""} onChange={e => setForm(p => ({ ...p, section: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5540DE]">
                                        {SECTIONS.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Blood Group</label>
                                <div className="flex gap-2 flex-wrap">
                                    {BLOOD_GROUPS.map(bg => (
                                        <button key={bg} type="button" onClick={() => setForm(p => ({ ...p, bloodGroup: bg }))}
                                            className="px-2.5 py-1 rounded-lg text-xs transition-all"
                                            style={{ background: form.bloodGroup === bg ? "#5540DE" : "rgba(85,64,222,0.06)", color: form.bloodGroup === bg ? "white" : "#5540DE", fontWeight: 600, border: `1px solid ${form.bloodGroup === bg ? "#5540DE" : "rgba(85,64,222,0.2)"}` }}>
                                            {bg}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border flex gap-3">
                            <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
                            <button onClick={saveStudent} className="flex-1 py-2.5 rounded-xl text-white text-sm hover:opacity-90 flex items-center justify-center gap-1.5" style={{ background: "#5540DE", fontWeight: 600 }}>
                                <Save size={14} /> {modal === "add" ? "Add Student" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
                    <div className="w-80 rounded-[2.5rem] bento-card-strong shadow-2xl p-8 text-center border-red-500/20">
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5"><Trash2 size={24} className="text-red-500" /></div>
                        <h3 className="text-gray-800 text-lg mb-2" style={{ fontWeight: 800 }}>Remove Student?</h3>
                        <p className="text-gray-500 text-sm mb-6 font-medium">This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
                            <button onClick={() => deleteStudent(deleteConfirm)} className="flex-1 py-2.5 rounded-xl text-white text-sm" style={{ background: "#DC2626", fontWeight: 600 }}>Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
