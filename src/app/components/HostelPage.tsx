import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MESS_MENU: Record<string, { breakfast: string[]; lunch: string[]; snacks: string[]; dinner: string[] }> = {
  Monday: { breakfast: ["Idli (3)", "Sambar", "Coconut Chutney", "Tea / Coffee"], lunch: ["Steamed Rice", "Dal Tadka", "Poriyal (Beans)", "Rasam", "Papad", "Curd"], snacks: ["Bread Toast (2)", "Butter", "Tea"], dinner: ["Chapathi (3)", "Paneer Butter Masala", "Dal", "Curd Rice"] },
  Tuesday: { breakfast: ["Pongal", "Vada (2)", "Sambar", "Chutney", "Tea / Coffee"], lunch: ["Rice", "Sambar", "Kootu", "Rasam", "Appalam", "Buttermilk"], snacks: ["Bun", "Tea"], dinner: ["Poori (4)", "Channa Masala", "Raita", "Kheer"] },
  Wednesday: { breakfast: ["Rava Upma", "Coconut Chutney", "Banana", "Tea / Coffee"], lunch: ["Rice", "Rajma Masala", "Poriyal (Cabbage)", "Rasam", "Papad", "Curd"], snacks: ["Vada Pav", "Tea"], dinner: ["Chapathi (3)", "Chicken Curry / Veg Kurma", "Dal", "Papad"] },
  Thursday: { breakfast: ["Dosa (3)", "Sambar", "Tomato Chutney", "Tea / Coffee"], lunch: ["Rice", "Lemon Rice", "Curd Rice", "Pickle", "Papad", "Buttermilk"], snacks: ["Samosa", "Tamarind Chutney", "Tea"], dinner: ["Paratha (3)", "Mix Veg Curry", "Dal Makhani", "Curd"] },
  Friday: { breakfast: ["Idiyappam (4)", "Coconut Milk", "Egg Curry / Mushroom Curry", "Tea / Coffee"], lunch: ["Rice", "Sambar", "Avial", "Rasam", "Papad", "Curd", "Payasam"], snacks: ["Bonda (2)", "Tea"], dinner: ["Chapathi (3)", "Palak Paneer", "Dal", "Ice Cream / Sweet"] },
  Saturday: { breakfast: ["Aloo Paratha (2)", "Curd", "Pickle", "Tea / Coffee"], lunch: ["Veg Biriyani", "Raita", "Boiled Egg / Paneer Tikka", "Cold Drink"], snacks: ["Fruit Salad"], dinner: ["Chapathi (3)", "Mutton Curry / Soya Chunks Gravy", "Dal", "Curd Rice"] },
  Sunday: { breakfast: ["Poori (4)", "Potato Masala", "Halwa", "Tea / Coffee"], lunch: ["White Rice", "Veg Sambar", "Rasam", "Poriyal", "Papad", "Curd", "Payasam"], snacks: ["Snacks + Cold Drink"], dinner: ["Chapathi (3) / Naan", "Dal Makhani", "Paneer Curry", "Ice Cream"] },
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const BOYS_HOSTELS = [
  { name: "Sri Vivekananda Block A", rooms: "Single & Double sharing", capacity: 240, warden: "Mr. K Rajan", phone: "+91-4295-226010", amenities: ["24/7 CCTV", "High-speed Wi-Fi", "Common Room with TV", "Gym", "Indoor Games", "Laundry"] },
  { name: "Sri Vivekananda Block B", rooms: "Double & Triple sharing", capacity: 360, warden: "Mr. S Moorthy", phone: "+91-4295-226011", amenities: ["24/7 CCTV", "Wi-Fi", "Study Hall", "Laundry", "Indoor Games", "Medical Room"] },
  { name: "Sri Ramanuja Block", rooms: "Double sharing (AC & Non-AC)", capacity: 400, warden: "Dr. R Balasubramanian", phone: "+91-4295-226012", amenities: ["24/7 CCTV", "High-speed Wi-Fi", "AC Rooms Available", "Gym", "Common Room", "Mess with Full Catering"] },
];

const GIRLS_HOSTELS = [
  { name: "Saraswathi Block A", rooms: "Double & Triple sharing", capacity: 320, warden: "Ms. P Kavitha", phone: "+91-4295-226015", amenities: ["24/7 CCTV", "High-speed Wi-Fi", "Beauty Parlour", "Common Room", "Laundry", "Medical Room"] },
  { name: "Saraswathi Block B", rooms: "Single & Double sharing (AC)", capacity: 240, warden: "Ms. R Meenalochani", phone: "+91-4295-226016", amenities: ["24/7 CCTV", "Wi-Fi", "AC Rooms", "Study Hall", "Indoor Games", "Ladies Gym"] },
];

const HOSTEL_RULES = [
  "All hostel students must return to hostel by 9:00 PM on weekdays and 10:00 PM on weekends.",
  "Outpass is mandatory for staying outside the campus. Apply through BIP Portal.",
  "Consumption of alcohol, tobacco, or narcotic substances is strictly prohibited.",
  "Ragging in any form is a criminal offence. Anti-ragging helpline: 1800-180-5522.",
  "Maintain cleanliness in rooms and common areas at all times.",
  "Cooking inside hostel rooms using electric appliances is strictly prohibited.",
  "Students must not bring vehicles inside the hostel premises without permission.",
  "Mobile phones must be switched to silent mode after 10:30 PM.",
  "Any damage to college property will be recovered from the responsible student.",
  "Visitors are allowed only at the reception area; they are not permitted inside hostel blocks.",
];

export function HostelPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"boys" | "girls" | "mess" | "rules">("boys");
  const [messDay, setMessDay] = useState("Monday");
  const [complaintForm, setComplaintForm] = useState({ name: user?.name || "", rollNo: user?.rollNo || "", hostel: "", room: "", issue: "", details: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.issue || !complaintForm.details) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }) as keyof typeof MESS_MENU;

  const HostelCard = ({ h }: { h: typeof BOYS_HOSTELS[0] }) => (
    <div className="bento-card-strong rounded-[2.5rem] overflow-hidden border-none transition-all hover:-translate-y-1 hover:shadow-xl"
      style={{ boxShadow: "0 8px 32px rgba(85,64,222,0.12)" }}>
      <div className="h-1.5" style={{ background: "linear-gradient(90deg, #5540DE, #7c6de8)" }} />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: "#EEF2FF" }}>🏠</div>
          <div>
            <h3 className="text-gray-800 text-base" style={{ fontWeight: 700 }}>{h.name}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{h.rooms} · Capacity: {h.capacity} students</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Phone size={12} className="text-[#5540DE]" />
          <span className="text-gray-700 text-xs" style={{ fontWeight: 600 }}>Warden: {h.warden}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Mail size={12} className="text-[#5540DE]" />
          <span className="text-gray-500 text-xs">{h.phone}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {h.amenities.map(a => (
            <div key={a} className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5540DE] shrink-0" />{a}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const menu = MESS_MENU[messDay];

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Hero */}
      <div className="rounded-[2.5rem] p-8 mb-4 relative overflow-hidden bento-card-strong shadow-2xl border-none" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
        <div className="relative z-10">
          <p className="text-indigo-200 text-[10px] mb-2 tracking-[0.2em] font-bold uppercase">Campus Accommodation</p>
          <h2 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Hostel Information 🏠</h2>
          <p className="text-indigo-100/90 text-sm font-medium">All you need to know about hostel facilities, mess menu, rules, and contacts.</p>
          <div className="flex gap-4 mt-6 flex-wrap">
            {["1,300+ Residents", "Separate Boy/Girl Blocks", "24/7 Security", "Wi-Fi Enabled"].map(t => (
              <span key={t} className="px-4 py-1.5 rounded-full text-xs text-white shadow-sm"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl z-0" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {([["boys", "👦 Boys Hostel"], ["girls", "👧 Girls Hostel"], ["mess", "🍽️ Mess Menu"], ["rules", "📋 Rules"]] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all"
            style={{ background: tab === t ? "#5540DE" : "rgba(255,255,255,0.75)", color: tab === t ? "white" : "#374151", fontWeight: tab === t ? 700 : 500, border: tab === t ? "none" : "1px solid rgba(255,255,255,0.6)", boxShadow: tab === t ? "0 4px 14px rgba(85,64,222,0.3)" : "none" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Boys Hostel */}
      {tab === "boys" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOYS_HOSTELS.map(h => <HostelCard key={h.name} h={h} />)}
          </div>
          <div className="bento-card-strong rounded-[2.5rem] p-7 border-none shadow-xl">
            <h3 className="text-gray-800 text-lg mb-4" style={{ fontWeight: 800 }}>📋 Key Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[["Fee (per year)", "₹50,000 – ₹65,000 (varies by room type)"], ["Check-in Time", "Anytime during college hours"], ["In-time (Weekdays)", "9:00 PM"], ["In-time (Weekends)", "10:00 PM"], ["Mess Timings", "B: 7–8 AM | L: 12–1:30 PM | D: 7–8:30 PM"], ["Contact Office", "+91-4295-226010 / 226011"]].map(([l, v]) => (
                <div key={l} className="rounded-xl p-3" style={{ background: "#EEF2FF" }}>
                  <p className="text-gray-400 text-xs">{l}</p>
                  <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Complaint Form */}
          <div className="bento-card-strong rounded-[2.5rem] p-7 border-none shadow-xl mt-2">
            <h3 className="text-gray-800 text-lg mb-5" style={{ fontWeight: 800 }}>📮 Submit a Hostel Complaint</h3>
            {submitted ? (
              <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                <div>
                  <p className="text-green-700 text-sm" style={{ fontWeight: 600 }}>Complaint submitted successfully!</p>
                  <p className="text-green-600 text-xs mt-0.5">The hostel office will respond within 24 hours. You may also raise a ticket at supportdesk.bitsathy.ac.in</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[{ l: "Your Name", k: "name" }, { l: "Roll Number", k: "rollNo" }, { l: "Hostel Block", k: "hostel" }, { l: "Room Number", k: "room" }].map(({ l, k }) => (
                  <div key={k}>
                    <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>{l}</label>
                    <input value={(complaintForm as Record<string, string>)[k]} onChange={e => setComplaintForm(p => ({ ...p, [k]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Issue Type *</label>
                  <select value={complaintForm.issue} onChange={e => setComplaintForm(p => ({ ...p, issue: e.target.value }))} required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]">
                    <option value="">Select an issue</option>
                    {["Electrical Problem", "Plumbing Issue", "Wi-Fi / Internet", "Mess Food Quality", "Cleanliness", "Security Concern", "Maintenance Request", "Others"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Details *</label>
                  <textarea value={complaintForm.details} onChange={e => setComplaintForm(p => ({ ...p, details: e.target.value }))} required rows={3} placeholder="Describe your issue in detail..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE] resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
                    style={{ background: "#5540DE", fontWeight: 600 }}>
                    {submitting ? "Submitting..." : <><Send size={14} /> Submit Complaint</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Girls Hostel */}
      {tab === "girls" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GIRLS_HOSTELS.map(h => <HostelCard key={h.name} h={h} />)}
          </div>
          <div className="bento-card rounded-[2.5rem] p-6 flex items-start gap-4"
            style={{ border: "1px solid rgba(236, 72, 153, 0.25)" }}>
            <AlertCircle size={18} className="text-pink-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-pink-700 text-sm" style={{ fontWeight: 600 }}>Girls Hostel Safety Measures</p>
              <p className="text-pink-600 text-xs mt-0.5 leading-relaxed">Girls' hostel has dedicated lady wardens and security personnel available 24/7. Biometric entry access is mandatory for all students. Emergency contact number: +91-4295-226015</p>
            </div>
          </div>
        </div>
      )}

      {/* Mess Menu */}
      {tab === "mess" && (
        <div className="flex flex-col gap-5">
          {/* Today highlight */}
          <div className="bento-card rounded-[2.5rem] p-6 flex items-center gap-4 mb-2"
            style={{ border: "1px solid rgba(85,64,222,0.2)" }}>
            <span className="text-3xl">🍽️</span>
            <div>
              <p className="text-[#5540DE] text-base" style={{ fontWeight: 800 }}>Today is {today}</p>
              <p className="text-gray-500 text-sm font-medium">Tap on a day below to see the full menu for that day</p>
            </div>
          </div>

          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {DAYS.map(day => (
              <button key={day} onClick={() => setMessDay(day)}
                className="px-5 py-2.5 rounded-[1rem] text-sm whitespace-nowrap transition-all shrink-0"
                style={{ background: messDay === day ? "#5540DE" : day === today ? "rgba(85,64,222,0.12)" : "rgba(255,255,255,0.75)", color: messDay === day ? "white" : day === today ? "#5540DE" : "#374151", fontWeight: messDay === day || day === today ? 700 : 500, border: messDay === day ? "none" : day === today ? "2px solid rgba(85,64,222,0.4)" : "1px solid rgba(255,255,255,0.6)" }}>
                {day.substring(0, 3)}
              </button>
            ))}
          </div>

          {/* Menu cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "🌅 Breakfast", key: "breakfast" as const, time: "7:00 – 8:00 AM", color: "#D97706", bg: "#FFFBEB" },
              { label: "☀️ Lunch", key: "lunch" as const, time: "12:00 – 1:30 PM", color: "#059669", bg: "#ECFDF5" },
              { label: "☕ Evening Snacks", key: "snacks" as const, time: "4:30 – 5:30 PM", color: "#5540DE", bg: "#EEF2FF" },
              { label: "🌙 Dinner", key: "dinner" as const, time: "7:00 – 8:30 PM", color: "#0891B2", bg: "#E0F2FE" },
            ].map(({ label, key, time, color, bg }) => (
              <div key={key} className="bento-card-strong rounded-[2.5rem] overflow-hidden border-none hover:-translate-y-1 hover:shadow-xl transition-all"
                style={{ boxShadow: "0 8px 32px rgba(85,64,222,0.08)" }}>
                <div className="h-2" style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
                <div className="p-6">
                  <p className="text-base mb-1" style={{ fontWeight: 800, color }}>{label}</p>
                  <p className="text-gray-400 text-xs mb-4 font-semibold">{time}</p>
                  <ul className="flex flex-col gap-1.5">
                    {menu[key].map(item => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4 flex items-start gap-3"
            style={{ background: "rgba(255,200,0,0.1)", border: "1px solid rgba(255,160,0,0.3)" }}>
            <span>ℹ️</span>
            <p className="text-amber-800 text-xs leading-relaxed">Menu is subject to change based on availability and seasonal variations. Special meals are available on request with prior notice to the mess office.</p>
          </div>
        </div>
      )}

      {/* Rules */}
      {tab === "rules" && (
        <div className="flex flex-col gap-5 mt-2">
          <div className="bento-card rounded-[2rem] p-6"
            style={{ border: "1px solid rgba(255,160,0,0.3)" }}>
            <p className="text-amber-800 text-base flex items-center gap-3" style={{ fontWeight: 800 }}>
              ⚠️ All students must strictly follow these rules. Violations may result in disciplinary action.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {HOSTEL_RULES.map((rule, i) => (
              <div key={i} className="flex items-start gap-5 p-6 rounded-[2rem] bento-card border-none shadow-sm">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm shrink-0"
                  style={{ background: "linear-gradient(135deg, #5540DE, #2e2378)", fontWeight: 700 }}>{i + 1}</span>
                <p className="text-gray-700 text-sm leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[2.5rem] p-8 flex items-center gap-5 bento-card-strong shadow-2xl border-none"
            style={{ background: "linear-gradient(135deg, #5540DE, #2e2378)" }}>
            <div className="w-14 h-14 rounded-[1.25rem] bg-white/20 flex items-center justify-center shrink-0">
              <Phone size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm" style={{ fontWeight: 700 }}>Anti-Ragging & Emergency</p>
              <p className="text-white/75 text-xs">24/7 Anti-Ragging Helpline: 1800-180-5522 (Toll Free) | Hostel Office: +91-4295-226010</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}