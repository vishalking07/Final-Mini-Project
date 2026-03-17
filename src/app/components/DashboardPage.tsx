import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Bell, X, Pencil, Trash2, Save, BookOpen, Activity, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AdminDashboardPage } from "./AdminDashboardPage";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8–18

interface Event { id: number; title: string; day: number; startHour: number; endHour: number; color: string; venue: string; }
interface Announcement { id: number; title: string; time: string; author: string; type: "unread" | "read"; color: string; category: string; }

const COLORS = ["#a78bfa", "#6ee7b7", "#fca5a5", "#93c5fd", "#fde68a", "#fbcfe8", "#d9f99d", "#bfdbfe", "#f9a8d4", "#86efac"];
const CAT_COLORS: Record<string, string> = { Holiday: "#5540DE", Event: "#FF5757", Finance: "#5AC84E", Academic: "#0891B2", General: "#94a3b8", Library: "#7C3AED" };

const HOUR_LABEL = (h: number) => h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;

const STUDENT_STATS = [
  { label: "CGPA", value: "8.42", sub: "Current Semester", icon: BookOpen, color: "#5540DE", bg: "#EEF2FF" },
  { label: "Attendance", value: "82%", sub: "Present / 180 days", icon: Activity, color: "#059669", bg: "#ECFDF5" },
  { label: "Fee Due", value: "Feb 28", sub: "₹45,000 pending", icon: CreditCard, color: "#D97706", bg: "#FFFBEB" },
];

export function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Redirect admin to dedicated admin dashboard
  if (isAdmin) return <AdminDashboardPage />;

  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 19));
  const [annTab, setAnnTab] = useState<"unread" | "read">("unread");
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("bit_events");
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem("bit_announcements");
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem("bit_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("bit_announcements", JSON.stringify(announcements));
  }, [announcements]);

  // Event modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [evForm, setEvForm] = useState({ title: "", day: 1, startHour: 8, endHour: 9, venue: "", color: COLORS[0] });

  // Ann modal
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [annForm, setAnnForm] = useState({ title: "", category: "General", type: "unread" as "unread" | "read" });

  // Week
  const getWeekStart = (d: Date) => { const w = new Date(d); w.setDate(d.getDate() - d.getDay()); return w; };
  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d; });
  const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
  const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };
  const today = new Date();
  const isToday = (d: Date) => d.toDateString() === today.toDateString();

  // Event CRUD
  const openAddEvent = () => { setEditingEvent(null); setEvForm({ title: "", day: 1, startHour: 8, endHour: 9, venue: "", color: COLORS[0] }); setShowEventModal(true); };
  const openEditEvent = (e: Event) => { setEditingEvent(e); setEvForm({ title: e.title, day: e.day, startHour: e.startHour, endHour: e.endHour, venue: e.venue, color: e.color }); setShowEventModal(true); };
  const saveEvent = () => {
    if (!evForm.title.trim()) return;
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...evForm } : e));
    } else {
      setEvents(prev => [...prev, { id: Date.now(), ...evForm }]);
    }
    setShowEventModal(false);
  };
  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Ann CRUD
  const openAddAnn = () => { setEditingAnn(null); setAnnForm({ title: "", category: "General", type: "unread" }); setShowAnnModal(true); };
  const openEditAnn = (a: Announcement) => { setEditingAnn(a); setAnnForm({ title: a.title, category: a.category, type: a.type }); setShowAnnModal(true); };
  const saveAnn = () => {
    if (!annForm.title.trim()) return;
    const color = CAT_COLORS[annForm.category] || "#94a3b8";

    if (editingAnn) {
      setAnnouncements(prev => prev.map(a => a.id === editingAnn.id ? { ...a, ...annForm, color } : a));
    } else {
      setAnnouncements(prev => [{ id: Date.now(), ...annForm, time: "Just now", author: "BIT Admin", color }, ...prev]);
    }
    setShowAnnModal(false);
  };
  const deleteAnn = (id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };
  const markRead = (id: number) => setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, type: "read" } : a));

  const filteredAnns = announcements.filter(a => a.type === annTab);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="rounded-[2.5rem] p-8 mb-6 relative overflow-hidden bento-card-strong border-none shadow-2xl"
        style={{ background: "linear-gradient(135deg,#5540DE 0%,#2e2378 100%)" }}>
        <div className="relative z-10">
          <p className="text-indigo-200 text-xs mb-2 tracking-widest uppercase" style={{ fontWeight: 700 }}>Student Portal</p>
          <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>My Dashboard</h1>
          <p className="text-indigo-100 text-sm opacity-90">
            Welcome back, <strong>{user?.name}</strong>! 👋 {user?.department} · {user?.year} · Section {user?.section}
          </p>
        </div>
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-white/5 blur-xl" />
        <div className="absolute right-24 -bottom-16 w-32 h-32 rounded-full bg-white/10 blur-xl" />
      </div>

      {/* Student Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {STUDENT_STATS.map((s) => (
          <div key={s.label} className="bento-card-strong rounded-[2.5rem] p-6 flex items-center gap-5 hover:-translate-y-2 transition-all duration-500 group cursor-pointer">
            <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-inner" style={{ background: s.bg }}>
              <s.icon size={26} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-foreground text-3xl leading-none" style={{ fontWeight: 800 }}>{s.value}</p>
              <p className="text-muted-foreground text-sm mt-1" style={{ fontWeight: 700 }}>{s.label}</p>
              <p className="text-[#5540DE] text-[11px] mt-1" style={{ fontWeight: 700, background: "rgba(85,64,222,0.1)", display: "inline-block", padding: "4px 10px", borderRadius: "1rem" }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6 flex-col lg:flex-row mb-8">
        {/* Schedule */}
        <div className="flex-1 bento-card p-7 min-w-0 flex flex-col hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground text-xl" style={{ fontWeight: 800 }}>Schedules 🕐</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground mr-2 font-bold">{MONTHS[weekStart.getMonth()]} {weekStart.getFullYear()}</span>
              <button onClick={prevWeek} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"><ChevronLeft size={16} /></button>
              <button onClick={nextWeek} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-8 mb-2">
            <div className="flex items-end justify-center pb-2"><span className="text-xs text-muted-foreground font-bold">Time</span></div>
            {weekDays.map((day, i) => {
              const isSun = day.getDay() === 0;
              return (
                <div key={i} className={`text-center ${isSun ? "opacity-30" : ""}`}>
                  <div className={`text-[11px] mb-1.5 uppercase tracking-wider ${isToday(day) ? "text-[#5540DE]" : "text-muted-foreground"}`} style={{ fontWeight: 800 }}>{DAYS[day.getDay()]}</div>
                  <div className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full text-base transition-all ${isToday(day) ? "bg-[#5540DE] text-white shadow-lg shadow-[#5540DE]/40 scale-110" : "bg-muted/30 text-foreground hover:bg-muted"}`} style={{ fontWeight: 800 }}>{day.getDate()}</div>
                  {isSun && <div className="text-[9px] text-muted-foreground mt-2 font-bold uppercase tracking-widest hidden sm:block">Holiday</div>}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="overflow-y-auto pr-1 mt-2" style={{ maxHeight: "440px", scrollbarWidth: "none" }}>
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-8" style={{ height: "65px" }}>
                <div className="flex items-start justify-end pr-4 pt-1">
                  <span className="text-[11px] text-muted-foreground font-bold uppercase">{HOUR_LABEL(hour)}</span>
                </div>
                {weekDays.map((day, di) => {
                  const isSun = day.getDay() === 0;
                  const startEvents = events.filter(e => e.day === di && e.startHour === hour);
                  return (
                    <div key={di} className={`relative border-t border-muted/50 ${isSun ? "bg-muted/10 stripe-pattern" : ""}`}>
                      {!isSun && startEvents.map(ev => (
                        <div key={ev.id} className="absolute inset-x-1 rounded-xl px-2 py-1.5 z-10 cursor-pointer overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                          style={{ backgroundColor: ev.color, height: `${(ev.endHour - ev.startHour) * 65 - 4}px`, top: "2px" }}>
                          <p className="text-black/80 leading-tight truncate" style={{ fontSize: "11px", fontWeight: 700 }}>{ev.title}</p>
                          {ev.venue && <p className="text-black/60 leading-tight mt-0.5" style={{ fontSize: "10px", fontWeight: 600 }}>{ev.venue}</p>}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="w-full lg:w-[340px] bento-card-strong p-6 flex flex-col shrink-0 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground text-xl flex items-center gap-2" style={{ fontWeight: 800 }}>
              Announcements <Bell size={18} className="text-[#5540DE]" />
            </h2>
          </div>
          <div className="w-full h-px bg-muted mb-4" />

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {(["unread", "read"] as const).map(t => (
              <button key={t} onClick={() => setAnnTab(t)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1.25rem] text-xs transition-all capitalize"
                style={{ background: annTab === t ? "#5540DE" : "var(--surface-inset)", color: annTab === t ? "white" : "var(--muted-foreground)", fontWeight: annTab === t ? 800 : 600, border: annTab === t ? "none" : "1px solid var(--bento-border)", boxShadow: annTab === t ? "0 4px 12px rgba(85,64,222,0.3)" : "none" }}>
                <span className={`w-2 h-2 rounded-full ${t === "unread" ? "bg-current" : "bg-emerald-400"}`} />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1" style={{ maxHeight: "460px", scrollbarWidth: "none" }}>
            {filteredAnns.map(ann => (
              <div key={ann.id} onClick={() => !isAdmin && markRead(ann.id)}
                className="group/ann bg-background/50 rounded-[1.5rem] p-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all relative border border-muted">
                <span className="inline-block px-2.5 py-1 rounded-full text-white mb-2.5 shadow-sm" style={{ fontSize: "10px", backgroundColor: ann.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>{ann.category}</span>
                <p className="text-foreground leading-relaxed mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>{ann.title}</p>
                <div className="flex items-center gap-2 border-t border-muted/50 pt-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white" style={{ backgroundColor: ann.color, fontWeight: 800 }}>A</div>
                  <span className="text-foreground font-bold" style={{ fontSize: "11px" }}>{ann.author}</span>
                  <span className="ml-auto text-muted-foreground font-bold" style={{ fontSize: "10px" }}>{ann.time}</span>
                </div>
              </div>
            ))}
            {filteredAnns.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-4xl mb-3 opacity-50">📭</div>
                <p className="text-sm font-bold">No {annTab} announcements</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="w-96 rounded-2xl p-6 bg-background shadow-2xl border border-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-800 text-lg" style={{ fontWeight: 700 }}>{editingEvent ? "Edit Event" : "Add Event"}</h3>
              <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Title *</label>
                <input value={evForm.title} onChange={e => setEvForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Engineering Mathematics"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Venue</label>
                <input value={evForm.venue} onChange={e => setEvForm(p => ({ ...p, venue: e.target.value }))} placeholder="e.g. Room 101"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Day</label>
                <select value={evForm.day} onChange={e => setEvForm(p => ({ ...p, day: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]">
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Start</label>
                  <select value={evForm.startHour} onChange={e => setEvForm(p => ({ ...p, startHour: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]">
                    {Array.from({ length: 11 }, (_, i) => i + 8).map(h => <option key={h} value={h}>{HOUR_LABEL(h)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>End</label>
                  <select value={evForm.endHour} onChange={e => setEvForm(p => ({ ...p, endHour: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]">
                    {Array.from({ length: 10 }, (_, i) => i + 9).map(h => <option key={h} value={h}>{HOUR_LABEL(h)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1.5" style={{ fontWeight: 600 }}>Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => <button key={c} type="button" onClick={() => setEvForm(p => ({ ...p, color: c }))} className="w-7 h-7 rounded-full hover:scale-110 transition-transform" style={{ backgroundColor: c, outline: evForm.color === c ? `3px solid ${c}` : "none", outlineOffset: "2px" }} />)}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowEventModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={saveEvent} className="flex-1 py-2.5 rounded-xl text-white text-sm hover:opacity-90 flex items-center justify-center gap-1.5" style={{ background: "#5540DE", fontWeight: 600 }}>
                <Save size={14} /> {editingEvent ? "Update" : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="w-96 rounded-2xl p-6 bg-background shadow-2xl border border-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-800 text-lg" style={{ fontWeight: 700 }}>{editingAnn ? "Edit Announcement" : "New Announcement"}</h3>
              <button onClick={() => setShowAnnModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Title *</label>
                <textarea value={annForm.title} onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} rows={3}
                  placeholder="Write announcement..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Category</label>
                  <select value={annForm.category} onChange={e => setAnnForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]">
                    {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Status</label>
                  <select value={annForm.type} onChange={e => setAnnForm(p => ({ ...p, type: e.target.value as "unread" | "read" }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]">
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAnnModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={saveAnn} className="flex-1 py-2.5 rounded-xl text-white text-sm hover:opacity-90 flex items-center justify-center gap-1.5" style={{ background: "#5540DE", fontWeight: 600 }}>
                <Save size={14} /> {editingAnn ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}