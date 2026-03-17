import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Bell, X, Pencil, Trash2, Save } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);

interface Event { id: number; title: string; day: number; startHour: number; endHour: number; color: string; venue: string; }
interface Announcement { id: number; title: string; time: string; author: string; type: "unread" | "read"; color: string; category: string; }

const COLORS = ["#a78bfa", "#6ee7b7", "#fca5a5", "#93c5fd", "#fde68a", "#fbcfe8", "#d9f99d", "#bfdbfe", "#f9a8d4", "#86efac"];
const CAT_COLORS: Record<string, string> = { Holiday: "#5540DE", Event: "#FF5757", Finance: "#5AC84E", Academic: "#0891B2", General: "#94a3b8", Library: "#7C3AED" };

const HOUR_LABEL = (h: number) => h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;

export function AdminSchedulePage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 19));
    const [annTab, setAnnTab] = useState<"unread" | "read">("unread");
    const [events, setEvents] = useState<Event[]>(() => {
        const s = localStorage.getItem("bit_events");
        return s ? JSON.parse(s) : [];
    });
    const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
        const s = localStorage.getItem("bit_announcements");
        return s ? JSON.parse(s) : [];
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

    // Week navigation
    const getWeekStart = (d: Date) => { const w = new Date(d); w.setDate(d.getDate() - d.getDay()); return w; };
    const weekStart = getWeekStart(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d; });
    const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
    const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };
    const today = new Date();
    const isToday = (d: Date) => d.toDateString() === today.toDateString();

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

    const filteredAnns = announcements.filter(a => a.type === annTab);

    return (
        <div className="max-w-[1400px] mx-auto pb-8">
            <div className="rounded-[2.5rem] p-9 mb-8 relative overflow-hidden bento-card-strong shadow-2xl border-none" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
                <div className="relative z-10">
                    <p className="text-indigo-200 text-[10px] mb-2 tracking-[0.2em] uppercase font-bold">Administration</p>
                    <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Manage Master Schedule & Announcements</h1>
                    <p className="text-indigo-100/90 text-sm font-medium">Add, update, and remove schedules and announcements visible to students.</p>
                </div>
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
                <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
            </div>

            <div className="flex gap-6 flex-col xl:flex-row">
                {/* Schedule Management */}
                <div className="flex-1 bento-card-strong rounded-[2.5rem] p-8 shadow-xl border-none">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-foreground text-2xl" style={{ fontWeight: 800 }}>Master Schedule</h2>
                            <p className="text-muted-foreground text-sm mt-1 font-medium">Update student timetables globally.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-foreground mr-2 font-bold bg-muted px-4 py-2 rounded-xl shadow-sm">{MONTHS[weekStart.getMonth()]} {weekStart.getFullYear()}</span>
                            <button onClick={prevWeek} className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-muted text-muted-foreground transition-all shadow-sm border border-border"><ChevronLeft size={18} /></button>
                            <button onClick={nextWeek} className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-muted text-muted-foreground transition-all shadow-sm border border-border"><ChevronRight size={18} /></button>
                            <button onClick={openAddEvent} className="h-10 px-4 ml-2 rounded-2xl flex items-center justify-center text-white transition-all shadow-md hover:-translate-y-0.5" style={{ background: "#5540DE", fontWeight: 700 }}><Plus size={16} className="mr-2" /> Add Event</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-8 mb-4">
                        <div className="flex items-end justify-center pb-2"><span className="text-xs text-muted-foreground font-bold">Time</span></div>
                        {weekDays.map((day, i) => {
                            const isSun = day.getDay() === 0;
                            return (
                                <div key={i} className={`text-center ${isSun ? "opacity-30" : ""}`}>
                                    <div className={`text-xs mb-2 uppercase tracking-wider ${isToday(day) ? "text-[#5540DE]" : "text-muted-foreground"}`} style={{ fontWeight: 800 }}>{DAYS[day.getDay()]}</div>
                                    <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-2xl text-lg transition-all ${isToday(day) ? "bg-[#5540DE] text-white shadow-lg shadow-[#5540DE]/40 scale-110" : "bg-muted/30 text-foreground hover:bg-muted"}`} style={{ fontWeight: 800 }}>{day.getDate()}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="overflow-y-auto pr-2 mt-4 custom-scrollbar" style={{ maxHeight: "500px" }}>
                        {HOURS.map((hour) => (
                            <div key={hour} className="grid grid-cols-8 group" style={{ height: "70px" }}>
                                <div className="flex items-start justify-end pr-5 pt-2">
                                    <span className="text-xs text-muted-foreground font-bold uppercase">{HOUR_LABEL(hour)}</span>
                                </div>
                                {weekDays.map((day, di) => {
                                    const isSun = day.getDay() === 0;
                                    const startEvents = events.filter(e => e.day === di && e.startHour === hour);
                                    return (
                                        <div key={di} className={`relative border-t border-muted/50 ${isSun ? "bg-muted/10 stripe-pattern" : "group-hover:bg-muted/10 transition-colors"}`}>
                                            {!isSun && startEvents.map(ev => (
                                                <div key={ev.id} className="absolute inset-x-2 rounded-[1rem] p-3 z-10 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group/ev"
                                                    style={{ backgroundColor: ev.color, height: `${(ev.endHour - ev.startHour) * 70 - 6}px`, top: "3px" }}>
                                                    <p className="text-black/80 leading-tight truncate" style={{ fontSize: "12px", fontWeight: 800 }}>{ev.title}</p>
                                                    {ev.venue && <p className="text-black/60 leading-tight mt-1" style={{ fontSize: "11px", fontWeight: 700 }}>{ev.venue}</p>}
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/ev:opacity-100 transition-opacity bg-white/50 backdrop-blur-sm p-1 rounded-lg">
                                                        <button onClick={() => openEditEvent(ev)} className="p-1 hover:text-purple-700 bg-white rounded-md shadow-sm"><Pencil size={12} /></button>
                                                        <button onClick={() => deleteEvent(ev.id)} className="p-1 hover:text-red-600 bg-white rounded-md shadow-sm"><Trash2 size={12} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Announcements Management */}
                <div className="w-full xl:w-[420px] bento-card-strong rounded-[2.5rem] p-8 shrink-0 shadow-xl border-none flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-foreground text-2xl flex items-center gap-3" style={{ fontWeight: 800 }}>
                                Announcements
                            </h2>
                            <p className="text-muted-foreground text-sm mt-1 font-medium">Manage global notices.</p>
                        </div>
                        <button onClick={openAddAnn} className="w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all shadow-md hover:-translate-y-0.5 shrink-0" style={{ background: "#7C3AED" }}>
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="flex gap-3 mb-6">
                        {(["unread", "read"] as const).map(t => (
                            <button key={t} onClick={() => setAnnTab(t)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm transition-all shadow-sm capitalize"
                                style={{ background: annTab === t ? "#7C3AED" : "var(--surface-inset)", color: annTab === t ? "white" : "var(--muted-foreground)", fontWeight: annTab === t ? 800 : 700, border: annTab === t ? "none" : "1px solid var(--bento-border)" }}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar" style={{ maxHeight: "560px" }}>
                        {filteredAnns.map(ann => (
                            <div key={ann.id} className="bento-card bg-background rounded-[1.5rem] p-5 hover:shadow-lg transition-all group/ann relative border-none">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="inline-block px-3 py-1.5 rounded-xl text-white shadow-sm" style={{ fontSize: "11px", backgroundColor: ann.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>{ann.category}</span>
                                    <div className="flex gap-2 opacity-0 group-hover/ann:opacity-100 transition-opacity">
                                        <button onClick={() => openEditAnn(ann)} className="w-7 h-7 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center transition-colors"><Pencil size={12} /></button>
                                        <button onClick={() => deleteAnn(ann.id)} className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors"><Trash2 size={12} /></button>
                                    </div>
                                </div>
                                <p className="text-foreground leading-relaxed mb-4" style={{ fontSize: "15px", fontWeight: 700 }}>{ann.title}</p>
                                <div className="flex items-center gap-3 border-t border-muted/50 pt-3">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm" style={{ backgroundColor: ann.color, fontWeight: 800 }}>A</div>
                                    <span className="text-foreground font-bold text-xs">{ann.author}</span>
                                    <span className="ml-auto text-muted-foreground font-bold text-xs bg-muted px-2 py-1 rounded-lg">{ann.time}</span>
                                </div>
                            </div>
                        ))}
                        {filteredAnns.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground bento-card border-none rounded-[1.5rem]">
                                <div className="text-5xl mb-4 opacity-50">📭</div>
                                <p className="text-base font-bold">No announcements</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" style={{ backgroundColor: "rgba(10, 5, 25, 0.65)", backdropFilter: "blur(12px)" }}>
                    <div className="w-full max-w-sm rounded-[2.5rem] p-8 bento-card-strong shadow-2xl border-none animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-foreground text-xl" style={{ fontWeight: 800 }}>{editingEvent ? "Edit Event" : "Create Event"}</h3>
                            <button onClick={() => setShowEventModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"><X size={16} /></button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-bold">Title *</label>
                                <input value={evForm.title} onChange={e => setEvForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Guest Lecture"
                                    className="w-full bg-white/60 border border-border rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-[#5540DE] focus:ring-2 focus:ring-[#5540DE]/20 font-medium transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-bold">Venue</label>
                                <input value={evForm.venue} onChange={e => setEvForm(p => ({ ...p, venue: e.target.value }))} placeholder="e.g. Main Auditorium"
                                    className="w-full bg-white/60 border border-border rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-[#5540DE] focus:ring-2 focus:ring-[#5540DE]/20 font-medium transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-bold">Day</label>
                                <select value={evForm.day} onChange={e => setEvForm(p => ({ ...p, day: Number(e.target.value) }))}
                                    className="w-full bg-white/60 border border-border rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-[#5540DE] focus:ring-2 focus:ring-[#5540DE]/20 font-medium transition-all appearance-none cursor-pointer">
                                    {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-bold">Start Time</label>
                                    <select value={evForm.startHour} onChange={e => setEvForm(p => ({ ...p, startHour: Number(e.target.value) }))}
                                        className="w-full bg-white/60 border border-border rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-[#5540DE] focus:ring-2 focus:ring-[#5540DE]/20 font-medium transition-all appearance-none cursor-pointer">
                                        {Array.from({ length: 11 }, (_, i) => i + 8).map(h => <option key={h} value={h}>{HOUR_LABEL(h)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-bold">End Time</label>
                                    <select value={evForm.endHour} onChange={e => setEvForm(p => ({ ...p, endHour: Number(e.target.value) }))}
                                        className="w-full bg-white/60 border border-border rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-[#5540DE] focus:ring-2 focus:ring-[#5540DE]/20 font-medium transition-all appearance-none cursor-pointer">
                                        {Array.from({ length: 10 }, (_, i) => i + 9).map(h => <option key={h} value={h}>{HOUR_LABEL(h)}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide font-bold">Event Color</label>
                                <div className="flex gap-3 flex-wrap">
                                    {COLORS.map(c => <button key={c} type="button" onClick={() => setEvForm(p => ({ ...p, color: c }))} className="w-8 h-8 rounded-full hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c, outline: evForm.color === c ? `3px solid ${c}80` : "none", outlineOffset: "2px" }} />)}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowEventModal(false)} className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors">Cancel</button>
                            <button onClick={saveEvent} className="flex-1 py-3 rounded-2xl text-white font-bold hover:opacity-90 flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-0.5" style={{ background: "#5540DE" }}>
                                <Save size={16} /> {editingEvent ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAnnModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" style={{ backgroundColor: "rgba(10, 5, 25, 0.65)", backdropFilter: "blur(12px)" }}>
                    <div className="w-full max-w-sm rounded-[2.5rem] p-8 bento-card-strong shadow-2xl border-none animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-foreground text-xl" style={{ fontWeight: 800 }}>{editingAnn ? "Edit Notice" : "Publish Notice"}</h3>
                            <button onClick={() => setShowAnnModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"><X size={16} /></button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-bold">Message *</label>
                                <textarea value={annForm.title} onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} rows={4}
                                    placeholder="Write announcement details..." className="w-full bg-white/60 border border-border rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 font-medium transition-all resize-none custom-scrollbar" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-bold">Category</label>
                                    <select value={annForm.category} onChange={e => setAnnForm(p => ({ ...p, category: e.target.value }))}
                                        className="w-full bg-white/60 border border-border rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 font-medium transition-all appearance-none cursor-pointer">
                                        {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-bold">Status</label>
                                    <select value={annForm.type} onChange={e => setAnnForm(p => ({ ...p, type: e.target.value as "unread" | "read" }))}
                                        className="w-full bg-white/60 border border-border rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 font-medium transition-all appearance-none cursor-pointer">
                                        <option value="unread">Active</option>
                                        <option value="read">Archived</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowAnnModal(false)} className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors">Cancel</button>
                            <button onClick={saveAnn} className="flex-1 py-3 rounded-2xl text-white font-bold hover:opacity-90 flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-0.5" style={{ background: "#7C3AED" }}>
                                <Save size={16} /> {editingAnn ? "Update" : "Publish"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
