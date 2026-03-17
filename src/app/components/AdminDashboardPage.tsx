import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
    Users, GraduationCap, CalendarDays, HeadphonesIcon,
    BookOpen, Trophy, FileText, Bell, Settings, ChevronRight,
    TrendingUp, Clock, CheckCircle2, AlertCircle, Plus,
    Building2, Award, Shield,
} from "lucide-react";

const STAT_CARDS = [
    { label: "Total Students", value: "1,248", change: "+12 this semester", icon: Users, color: "#5540DE", bg: "#EEF2FF" },
    { label: "Departments", value: "14", change: "UG & PG Programs", icon: Building2, color: "#059669", bg: "#ECFDF5" },
    { label: "Active Events", value: "8", change: "3 upcoming this week", icon: CalendarDays, color: "#0891B2", bg: "#E0F2FE" },
    { label: "Open Tickets", value: "5", change: "2 urgent, 3 normal", icon: HeadphonesIcon, color: "#DC2626", bg: "#FEF2F2" },
];

const QUICK_ACTIONS = [
    { label: "Manage Students", icon: Users, to: "/admin/students", color: "#5540DE", desc: "View, add & edit student records" },
    { label: "Announcements", icon: Bell, to: "/admin/schedule", color: "#7C3AED", desc: "Post & manage notices" },
    { label: "Schedule", icon: CalendarDays, to: "/admin/schedule", color: "#0891B2", desc: "Manage master timetables" },
    { label: "Documents", icon: FileText, to: "/documents", color: "#059669", desc: "Manage forms & circulars" },
    { label: "Placements", icon: Trophy, to: "/placements", color: "#D97706", desc: "Update placement drive data" },
    { label: "Faculties", icon: GraduationCap, to: "/about/faculties", color: "#BE185D", desc: "Manage faculty profiles" },
    { label: "Achievements", icon: Award, to: "/campus/achievements", color: "#7C3AED", desc: "Add awards & recognitions" },
    { label: "Portal Settings", icon: Settings, to: "/admin/settings", color: "#475569", desc: "Academic year, contact info" },
];

const RECENT_ACTIVITY = [
    { id: 1, icon: Bell, color: "#5540DE", bg: "#EEF2FF", title: "Announcement posted", desc: "GATE exam holiday notice published", time: "2 mins ago", type: "info" },
    { id: 2, icon: Users, color: "#059669", bg: "#ECFDF5", title: "New student added", desc: "24CS087 — Divya R onboarded", time: "1 hr ago", type: "success" },
    { id: 3, icon: HeadphonesIcon, color: "#DC2626", bg: "#FEF2F2", title: "Support ticket opened", desc: "21EC045 — Hall ticket not generated", time: "3 hrs ago", type: "error" },
    { id: 4, icon: Trophy, color: "#D97706", bg: "#FFFBEB", title: "Placement updated", desc: "TCS drive result: 23 students selected", time: "Yesterday", type: "info" },
    { id: 5, icon: CheckCircle2, color: "#059669", bg: "#ECFDF5", title: "Ticket resolved", desc: "22IT023 — Fee portal login issue fixed", time: "Yesterday", type: "success" },
];

const ACCREDITATIONS = ["NAAC A+", "NBA Accredited", "Anna University", "NIRF Ranked", "ISO 9001:2015"];

export function AdminDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeAccred] = useState(0);

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* ── Hero ── */}
            <div
                className="rounded-[2.5rem] p-8 mb-6 relative overflow-hidden bento-card-strong border-none shadow-2xl"
                style={{ background: "linear-gradient(135deg, #1a0a3a 0%, #2d1060 100%)" }}
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield size={16} className="text-indigo-300" />
                        <p className="text-indigo-200 text-[10px] tracking-[0.2em] font-bold uppercase">
                            Administration Panel
                        </p>
                    </div>
                    <h1 className="text-white text-4xl mb-3" style={{ fontWeight: 800 }}>Admin Dashboard</h1>
                    <p className="text-indigo-100/90 text-sm max-w-xl leading-relaxed font-medium">
                        Welcome back, <strong>{user?.name}</strong>! You have full administrative access. Here's an overview of the portal operations and metrics.
                    </p>
                    {/* Accreditation badges */}
                    <div className="flex gap-2.5 flex-wrap mt-6">
                        {ACCREDITATIONS.map((a) => (
                            <span key={a} className="text-white/90 text-[11px] px-3 py-1.5 rounded-full shadow-sm"
                                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.5px" }}>
                                {a}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
                <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {STAT_CARDS.map((s) => (
                    <div key={s.label} className="bento-card-strong rounded-[2.5rem] p-6 flex flex-col gap-4 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-pointer group">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-sm"
                                style={{ background: `${s.color}15`, border: `1px solid ${s.color}20` }}>
                                <s.icon size={24} style={{ color: s.color }} />
                            </div>
                            <span className="text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest" style={{ background: `${s.color}15`, color: s.color, fontWeight: 800 }}>
                                <TrendingUp size={12} className="inline mr-1" />Live
                            </span>
                        </div>
                        <div className="mt-2">
                            <p className="text-4xl" style={{ fontWeight: 800, color: "var(--foreground)", letterSpacing: "-1px" }}>{s.value}</p>
                            <p className="text-sm mt-1" style={{ color: "var(--foreground)", fontWeight: 700 }}>{s.label}</p>
                            <p className="text-[11px] mt-2 px-2.5 py-1 inline-block rounded-xl" style={{ background: "var(--surface-inset)", color: "var(--muted-foreground)", fontWeight: 700 }}>{s.change}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Quick Actions ── */}
                <div className="lg:col-span-2 bento-card p-7 shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 rounded-full bg-[#5540DE]" />
                            <h2 className="text-xl" style={{ fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>Quick Actions</h2>
                        </div>
                        <span className="text-xs bg-muted text-foreground px-3 py-1.5 rounded-full font-bold">Manage all sections</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {QUICK_ACTIONS.map((qa) => (
                            <button key={qa.label} onClick={() => navigate(qa.to)}
                                className="flex flex-col items-start gap-4 p-5 rounded-[1.5rem] text-left transition-all hover:-translate-y-1 hover:shadow-xl"
                                style={{ background: `linear-gradient(145deg, ${qa.color}08, transparent)`, border: `1px solid ${qa.color}20` }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = `${qa.color}15`)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = `linear-gradient(145deg, ${qa.color}08, transparent)`)}
                            >
                                <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-sm"
                                    style={{ background: `${qa.color}15`, border: `1px solid ${qa.color}30` }}>
                                    <qa.icon size={20} style={{ color: qa.color }} />
                                </div>
                                <div>
                                    <p className="text-sm" style={{ fontWeight: 800, color: "var(--foreground)" }}>{qa.label}</p>
                                    <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)", fontWeight: 600 }}>{qa.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Recent Activity ── */}
                <div className="bento-card p-7 flex flex-col shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 rounded-full bg-[#7C3AED]" />
                            <h2 className="text-xl" style={{ fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>Recent Activity</h2>
                        </div>
                        <div className="w-10 h-10 rounded-[1rem] bg-muted/50 flex items-center justify-center">
                            <Clock size={16} style={{ color: "var(--foreground)" }} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 flex-1 overflow-y-auto pr-2" style={{ maxHeight: "360px", scrollbarWidth: "none" }}>
                        {RECENT_ACTIVITY.map((a) => (
                            <div key={a.id} className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-[1.25rem] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm"
                                    style={{ background: `${a.color}15` }}>
                                    <a.icon size={16} style={{ color: a.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] leading-tight" style={{ fontWeight: 800, color: "var(--foreground)" }}>{a.title}</p>
                                    <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)", fontWeight: 600 }}>{a.desc}</p>
                                    <p className="text-[9px] mt-1.5 font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)", opacity: 0.8 }}>{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── College Info Strip ── */}
            <div className="mt-6 bento-card p-6 flex items-center gap-6 flex-wrap shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-[#5540DE] flex items-center justify-center shrink-0 shadow-lg shadow-[#5540DE]/40">
                        <BookOpen size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-base" style={{ fontWeight: 800, color: "var(--foreground)" }}>Bannari Amman Institute of Technology</p>
                        <p className="text-xs mt-0.5 font-bold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>Sathyamangalam – 638 401, Erode District, TN</p>
                    </div>
                </div>
                <div className="ml-auto flex gap-3 flex-wrap">
                    <a href="https://www.bitsathy.ac.in" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] text-white hover:opacity-90 shadow-lg shadow-[#5540DE]/20 transition-all hover:-translate-y-0.5"
                        style={{ background: "#5540DE", fontWeight: 700 }}>
                        Visit Website <ChevronRight size={14} />
                    </a>
                    <button onClick={() => navigate("/admin/settings")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] transition-all hover:bg-muted"
                        style={{ color: "var(--foreground)", border: "1px solid var(--border)", fontWeight: 700 }}>
                        <Settings size={14} /> Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
