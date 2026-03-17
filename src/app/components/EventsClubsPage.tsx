import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Calendar, Users, ExternalLink, MapPin, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Club {
  id: number; name: string; category: string; desc: string;
  members: number; lead: string; color: string; emoji: string; email: string;
}
interface Event {
  id: number; title: string; date: string; time: string;
  venue: string; type: string; organizer: string; color: string;
  emoji: string; registrationOpen: boolean; desc: string;
}

const initClubs: Club[] = [
  { id: 1, name: "IEEE Student Branch", category: "Technical", desc: "One of the most active IEEE student branches in Tamil Nadu, conducting workshops, webinars, and hackathons on cutting-edge technologies.", members: 320, lead: "Dr. K Muthukumar", color: "#5540DE", emoji: "⚡", email: "ieee@bitsathy.ac.in" },
  { id: 2, name: "ACM Student Chapter", category: "Technical", desc: "Association for Computing Machinery chapter promoting computing knowledge through coding contests, seminars, and collaborative projects.", members: 210, lead: "Mr. K Sundaramurthy", color: "#0891B2", emoji: "💻", email: "acm@bitsathy.ac.in" },
  { id: 3, name: "Robotics Club", category: "Technical", desc: "Hands-on robotics learning through competitions, project builds, and participation in national robot-building contests.", members: 145, lead: "Dr. S Annadurai", color: "#DC2626", emoji: "🤖", email: "robotics@bitsathy.ac.in" },
  { id: 4, name: "Coding Club", category: "Technical", desc: "Competitive programming hub with regular LeetCode contests, DSA workshops, placement prep sessions, and open-source contribution drives.", members: 280, lead: "Ms. G Saranya", color: "#059669", emoji: "🖥️", email: "coding@bitsathy.ac.in" },
  { id: 5, name: "Music Club", category: "Cultural", desc: "Classical and western music training, jam sessions, inter-college competitions, and performances at Prathibha cultural fest.", members: 95, lead: "Faculty Coordinator", color: "#EC4899", emoji: "🎵", email: "music@bitsathy.ac.in" },
  { id: 6, name: "Dance Club", category: "Cultural", desc: "Classical (Bharatanatyam, Folk) and western dance training with stage performances, choreography workshops, and competitions.", members: 88, lead: "Faculty Coordinator", color: "#F59E0B", emoji: "💃", email: "dance@bitsathy.ac.in" },
  { id: 7, name: "Drama & Fine Arts", category: "Cultural", desc: "Theatre performances, street plays, painting competitions, photography, and participation in state-level cultural events.", members: 72, lead: "Faculty Coordinator", color: "#7C3AED", emoji: "🎭", email: "arts@bitsathy.ac.in" },
  { id: 8, name: "NSS Unit", category: "Social Service", desc: "National Service Scheme conducting blood donation drives, environmental campaigns, village adoptions, and community welfare activities.", members: 200, lead: "Dr. P Murugesan", color: "#16A34A", emoji: "🤝", email: "nss@bitsathy.ac.in" },
  { id: 9, name: "NCC – Army Wing", category: "Social Service", desc: "National Cadet Corps training for discipline, leadership, and national service. Annual camp and Republic Day parade participation.", members: 120, lead: "Lt. Col. R Balaji", color: "#B45309", emoji: "🪖", email: "ncc@bitsathy.ac.in" },
  { id: 10, name: "Sports Club", category: "Sports", desc: "Organises intra- and inter-college tournaments in cricket, football, basketball, badminton, and athletics.", members: 350, lead: "Dr. V Rajasekar", color: "#0D9488", emoji: "🏆", email: "sports@bitsathy.ac.in" },
];

const initEvents: Event[] = [
  { id: 1, title: "Techno Blast 2026 – National Tech Symposium", date: "Mar 14–15, 2026", time: "9:00 AM", venue: "Main Auditorium + All Labs", type: "Technical Fest", organizer: "IEEE & ACM", color: "#5540DE", emoji: "⚡", registrationOpen: true, desc: "BIT Sathy's flagship technical symposium featuring paper presentations, coding contests, hackathons, project expo, and workshops by industry experts." },
  { id: 2, title: "Prathibha 2026 – Annual Cultural Fest", date: "Mar 28–29, 2026", time: "10:00 AM", venue: "Open Air Theatre & Auditorium", type: "Cultural Fest", organizer: "Cultural Club", color: "#EC4899", emoji: "🎭", registrationOpen: true, desc: "BIT Sathy's annual cultural extravaganza with music, dance, drama, fashion show, and celebrity night. Open for inter-college participation." },
  { id: 3, title: "CodeSprint 2026 – 24hr Hackathon", date: "Mar 8, 2026", time: "8:00 AM", venue: "CS & IT Labs (Block A)", type: "Hackathon", organizer: "Coding Club", color: "#059669", emoji: "💻", registrationOpen: true, desc: "A 24-hour hackathon with cash prizes worth ₹50,000. Theme: Smart Solutions for Tamil Nadu. Open for all 2nd, 3rd, and 4th year students." },
  { id: 4, title: "Robo Wars 2026", date: "Apr 2, 2026", time: "10:00 AM", venue: "Workshop Hall, Block C", type: "Technical Event", organizer: "Robotics Club", color: "#DC2626", emoji: "🤖", registrationOpen: false, desc: "Annual robot fighting competition open to inter-college teams. Prizes worth ₹30,000. Design, build, and battle your bot!" },
  { id: 5, title: "NSS Blood Donation Camp", date: "Mar 20, 2026", time: "9:00 AM", venue: "College Medical Centre", type: "Social Event", organizer: "NSS Unit", color: "#16A34A", emoji: "❤️", registrationOpen: true, desc: "Annual blood donation drive in collaboration with the Government Hospital, Sathyamangalam. All college students and staff are invited to participate." },
  { id: 6, title: "Industry Guest Lecture Series", date: "Every Friday", time: "2:00 PM", venue: "CSE Seminar Hall (Block A)", type: "Workshop", organizer: "T&P Cell", color: "#D97706", emoji: "🎙️", registrationOpen: false, desc: "Weekly guest lectures by industry professionals from TCS, Infosys, Zoho, and MNCs on current industry trends, placement tips, and career guidance." },
];

const CAT_COLORS: Record<string, string> = {
  Technical: "#5540DE", Cultural: "#EC4899", "Social Service": "#16A34A", Sports: "#0D9488",
};

export function EventsClubsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [tab, setTab] = useState<"clubs" | "events">("clubs");
  const [clubs, setClubs] = useState<Club[]>(initClubs);
  const [events, setEvents] = useState<Event[]>(initEvents);
  const [filterCat, setFilterCat] = useState("All");

  // Clubs modal
  const [showClubModal, setShowClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [clubForm, setClubForm] = useState({ name: "", category: "Technical", desc: "", members: 0, lead: "", email: "", color: "#5540DE", emoji: "⭐" });

  // Events modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({ title: "", date: "", time: "", venue: "", type: "", organizer: "", desc: "", color: "#5540DE", emoji: "📅", registrationOpen: true });

  const clubCategories = ["All", "Technical", "Cultural", "Social Service", "Sports"];
  const filteredClubs = clubs.filter(c => filterCat === "All" || c.category === filterCat);

  const openAddClub = () => { setEditingClub(null); setClubForm({ name: "", category: "Technical", desc: "", members: 0, lead: "", email: "", color: "#5540DE", emoji: "⭐" }); setShowClubModal(true); };
  const openEditClub = (c: Club) => { setEditingClub(c); setClubForm({ name: c.name, category: c.category, desc: c.desc, members: c.members, lead: c.lead, email: c.email, color: c.color, emoji: c.emoji }); setShowClubModal(true); };
  const saveClub = () => {
    if (!clubForm.name.trim()) return;
    if (editingClub) setClubs(prev => prev.map(c => c.id === editingClub.id ? { ...c, ...clubForm } : c));
    else setClubs(prev => [...prev, { id: Date.now(), ...clubForm }]);
    setShowClubModal(false);
  };
  const deleteClub = (id: number) => setClubs(prev => prev.filter(c => c.id !== id));

  const openAddEvent = () => { setEditingEvent(null); setEventForm({ title: "", date: "", time: "", venue: "", type: "", organizer: "", desc: "", color: "#5540DE", emoji: "📅", registrationOpen: true }); setShowEventModal(true); };
  const openEditEvent = (e: Event) => { setEditingEvent(e); setEventForm({ title: e.title, date: e.date, time: e.time, venue: e.venue, type: e.type, organizer: e.organizer, desc: e.desc, color: e.color, emoji: e.emoji, registrationOpen: e.registrationOpen }); setShowEventModal(true); };
  const saveEvent = () => {
    if (!eventForm.title.trim()) return;
    if (editingEvent) setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...eventForm } : e));
    else setEvents(prev => [...prev, { id: Date.now(), ...eventForm }]);
    setShowEventModal(false);
  };
  const deleteEvent = (id: number) => setEvents(prev => prev.filter(e => e.id !== id));

  return (
    <div className="flex flex-col gap-6 pb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero */}
      <div className="rounded-[2.5rem] p-8 mb-4 relative overflow-hidden bento-card-strong shadow-2xl border-none" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
        <div className="relative z-10">
          <p className="text-indigo-200 text-[10px] mb-2 tracking-[0.2em] font-bold uppercase">Campus Life</p>
          <h2 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Events & Clubs 🎭</h2>
          <p className="text-indigo-100/90 text-sm font-medium">Explore BIT Sathy's vibrant clubs, upcoming fests, and events to fuel your college experience.</p>
          <div className="flex gap-4 mt-6 flex-wrap">
            {[`${clubs.length}+ Clubs`, `${events.length} Upcoming Events`, "₹50,000+ Prize Pool"].map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full text-xs text-white shadow-sm"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2">
        {([["clubs", "🏛️ Clubs", clubs.length], ["events", "📅 Events", events.length]] as const).map(([t, label, count]) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all"
            style={{ background: tab === t ? "#5540DE" : "rgba(255,255,255,0.75)", color: tab === t ? "white" : "#374151", fontWeight: tab === t ? 700 : 500, border: tab === t ? "none" : "1px solid rgba(255,255,255,0.6)", boxShadow: tab === t ? "0 4px 14px rgba(85,64,222,0.3)" : "none" }}>
            {label} <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: tab === t ? "rgba(255,255,255,0.2)" : "rgba(85,64,222,0.1)", color: tab === t ? "white" : "#5540DE", fontWeight: 700 }}>{count}</span>
          </button>
        ))}
        <div className="ml-auto">
          {isAdmin && tab === "clubs" && (
            <button onClick={openAddClub} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90" style={{ background: "#5540DE", fontWeight: 600 }}>
              <Plus size={14} /> Add Club
            </button>
          )}
          {isAdmin && tab === "events" && (
            <button onClick={openAddEvent} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90" style={{ background: "#5540DE", fontWeight: 600 }}>
              <Plus size={14} /> Add Event
            </button>
          )}
        </div>
      </div>

      {/* Clubs Tab */}
      {tab === "clubs" && (
        <>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {clubCategories.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs transition-all"
                style={{ background: filterCat === cat ? "#5540DE" : "rgba(255,255,255,0.75)", color: filterCat === cat ? "white" : "#4B5563", fontWeight: filterCat === cat ? 600 : 500, border: filterCat === cat ? "none" : "1px solid rgba(255,255,255,0.6)", boxShadow: filterCat === cat ? "0 3px 10px rgba(85,64,222,0.3)" : "none" }}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClubs.map(club => (
              <div key={club.id} className="bento-card rounded-[2rem] overflow-hidden group transition-all hover:-translate-y-2 hover:shadow-xl border-none"
                style={{ boxShadow: `0 8px 32px ${club.color}15` }}>
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${club.color}, ${club.color}60)` }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${club.color}12` }}>{club.emoji}</div>
                      <div>
                        <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: CAT_COLORS[club.category] || "#5540DE", fontWeight: 600 }}>{club.category}</span>
                        <h3 className="text-gray-800 text-sm mt-1" style={{ fontWeight: 700 }}>{club.name}</h3>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditClub(club)} className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center"><Pencil size={12} className="text-purple-600" /></button>
                        <button onClick={() => deleteClub(club.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center"><Trash2 size={12} className="text-red-500" /></button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed mb-3">{club.desc}</p>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Users size={12} />{club.members} members
                    </div>
                    <a href={`mailto:${club.email}`}
                      className="text-xs px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-opacity"
                      style={{ background: club.color, fontWeight: 600 }}>
                      Join Club
                    </a>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Lead: {club.lead}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Events Tab */}
      {tab === "events" && (
        <div className="flex flex-col gap-5">
          {events.map(ev => (
            <div key={ev.id} className="bento-card-strong rounded-[2.5rem] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl border-none"
              style={{ boxShadow: `0 8px 40px ${ev.color}18` }}>
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${ev.color}, ${ev.color}60)` }} />
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${ev.color}12` }}>{ev.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: ev.color, fontWeight: 600 }}>{ev.type}</span>
                        <h3 className="text-gray-800 text-base mt-1.5" style={{ fontWeight: 700 }}>{ev.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${ev.registrationOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`} style={{ fontWeight: 600 }}>
                          {ev.registrationOpen ? "✓ Open" : "Closed"}
                        </span>
                        {isAdmin && (
                          <div className="flex gap-1">
                            <button onClick={() => openEditEvent(ev)} className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center"><Pencil size={12} className="text-purple-600" /></button>
                            <button onClick={() => deleteEvent(ev.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center"><Trash2 size={12} className="text-red-500" /></button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed mt-2 mb-3">{ev.desc}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="text-gray-500 text-xs flex items-center gap-1"><Calendar size={11} />{ev.date}</span>
                      <span className="text-gray-500 text-xs flex items-center gap-1"><Clock size={11} />{ev.time}</span>
                      <span className="text-gray-500 text-xs flex items-center gap-1"><MapPin size={11} />{ev.venue}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <p className="text-gray-400 text-xs">By: {ev.organizer}</p>
                      {ev.registrationOpen && (
                        <a href="https://bip.bitsathy.ac.in" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-opacity"
                          style={{ background: ev.color, fontWeight: 600 }}>
                          Register <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Club Modal */}
      {showClubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" style={{ backgroundColor: "rgba(10, 5, 25, 0.65)", backdropFilter: "blur(12px)" }}>
          <div className="w-full max-w-md rounded-[2.5rem] p-8 bento-card-strong shadow-2xl border-none animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800 text-xl" style={{ fontWeight: 800 }}>{editingClub ? "Edit Club" : "Add Club"}</h3>
              <button onClick={() => setShowClubModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              {[{ l: "Club Name *", k: "name" }, { l: "Lead / Coordinator", k: "lead" }, { l: "Email", k: "email" }, { l: "Emoji", k: "emoji" }].map(({ l, k }) => (
                <div key={k}>
                  <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>{l}</label>
                  <input value={(clubForm as Record<string, string | number>)[k] as string} onChange={e => setClubForm(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Description</label>
                <textarea value={clubForm.desc} onChange={e => setClubForm(p => ({ ...p, desc: e.target.value }))} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE] resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Category</label>
                <select value={clubForm.category} onChange={e => setClubForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]">
                  {["Technical", "Cultural", "Social Service", "Sports"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowClubModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={saveClub} className="flex-1 py-2.5 rounded-xl text-white text-sm hover:opacity-90 flex items-center justify-center gap-1.5" style={{ background: "#5540DE", fontWeight: 600 }}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" style={{ backgroundColor: "rgba(10, 5, 25, 0.65)", backdropFilter: "blur(12px)" }}>
          <div className="w-full max-w-md rounded-[2.5rem] p-8 bento-card-strong shadow-2xl border-none max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800 text-xl" style={{ fontWeight: 800 }}>{editingEvent ? "Edit Event" : "Add Event"}</h3>
              <button onClick={() => setShowEventModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              {[{ l: "Title *", k: "title" }, { l: "Date", k: "date" }, { l: "Time", k: "time" }, { l: "Venue", k: "venue" }, { l: "Type", k: "type" }, { l: "Organizer", k: "organizer" }, { l: "Emoji", k: "emoji" }].map(({ l, k }) => (
                <div key={k}>
                  <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>{l}</label>
                  <input value={(eventForm as Record<string, string | boolean>)[k] as string} onChange={e => setEventForm(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Description</label>
                <textarea value={eventForm.desc} onChange={e => setEventForm(p => ({ ...p, desc: e.target.value }))} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE] resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={eventForm.registrationOpen} onChange={e => setEventForm(p => ({ ...p, registrationOpen: e.target.checked }))}
                  className="w-4 h-4 rounded" style={{ accentColor: "#5540DE" }} />
                <label className="text-sm text-gray-700" style={{ fontWeight: 500 }}>Registration Open</label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowEventModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={saveEvent} className="flex-1 py-2.5 rounded-xl text-white text-sm hover:opacity-90 flex items-center justify-center gap-1.5" style={{ background: "#5540DE", fontWeight: 600 }}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}