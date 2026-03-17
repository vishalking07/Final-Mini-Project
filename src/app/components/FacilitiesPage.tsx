import { useState } from "react";
import { Pencil, Save, X, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const facilityImages = {
  library: "https://images.unsplash.com/photo-1741708011297-a364acd23638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  computerLab: "https://images.unsplash.com/photo-1689236673934-66f8e9d9279b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  sports: "https://images.unsplash.com/photo-1740906793007-692710a640a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  hostel: "https://images.unsplash.com/photo-1642928351698-5d2c0f643a92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  research: "https://images.unsplash.com/photo-1760493828288-d2dbb70d18c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  medical: "https://images.unsplash.com/photo-1581982231900-6a1a46b744c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  canteen: "https://images.unsplash.com/photo-1744168222850-85b5e5e9aa24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  transport: "https://images.unsplash.com/photo-1767455471096-fad3b4616524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
};

const initialFacilities = [
  {
    id: 1,
    title: "Central Library",
    icon: "📚",
    color: "#5540DE",
    img: facilityImages.library,
    desc: "The central library spans over 10,000 sq.ft with a collection of 50,000+ books, e-journals, and online databases. Open from 8 AM to 10 PM on all days.",
    features: ["50,000+ books & journals", "DELNET & EBSCO access", "Digital library section", "Reading hall for 500 students"],
  },
  {
    id: 2,
    title: "Computer Labs",
    icon: "💻",
    color: "#059669",
    img: facilityImages.computerLab,
    desc: "State-of-the-art computer laboratories with the latest hardware and licensed software. High-speed internet connectivity available 24/7.",
    features: ["500+ workstations", "1 Gbps internet speed", "Licensed software suite", "Open 24/7 for students"],
  },
  {
    id: 3,
    title: "Sports Complex",
    icon: "🏆",
    color: "#0891B2",
    img: facilityImages.sports,
    desc: "World-class sports facilities including an indoor stadium, outdoor courts, and a well-equipped gymnasium to promote physical fitness.",
    features: ["Indoor stadium", "Cricket & football grounds", "Basketball & volleyball courts", "Swimming pool"],
  },
  {
    id: 4,
    title: "Hostel Facilities",
    icon: "🏠",
    color: "#7C3AED",
    img: facilityImages.hostel,
    desc: "Separate hostels for boys and girls with modern amenities, mess facilities, and 24/7 security. Accommodation for 3000+ students.",
    features: ["AC & non-AC rooms", "24/7 security", "Mess with nutritious food", "Wi-Fi enabled premises"],
  },
  {
    id: 5,
    title: "Research Labs",
    icon: "🔬",
    color: "#DC2626",
    img: facilityImages.research,
    desc: "Advanced research laboratories equipped with modern instruments for undergraduate and postgraduate research activities.",
    features: ["Domain-specific research labs", "Industry-grade equipment", "Research funding support", "Publication assistance"],
  },
  {
    id: 6,
    title: "Medical Centre",
    icon: "🏥",
    color: "#B45309",
    img: facilityImages.medical,
    desc: "A well-equipped medical centre with qualified doctors and nursing staff available round the clock to attend to health emergencies.",
    features: ["24/7 doctor availability", "Ambulance service", "First aid & pharmacy", "Tie-up with nearby hospitals"],
  },
  {
    id: 7,
    title: "Canteen & Mess",
    icon: "🍽️",
    color: "#0D9488",
    img: facilityImages.canteen,
    desc: "Multiple canteens and a central mess providing hygienic and nutritious food at subsidised rates. Special diet options available.",
    features: ["Hygienic food", "Subsidised rates", "Vegetarian & non-veg options", "Special diet on request"],
  },
  {
    id: 8,
    title: "Transportation",
    icon: "🚌",
    color: "#6B7280",
    img: facilityImages.transport,
    desc: "Bus service covering major routes from nearby cities and towns. Buses are GPS tracked and regularly maintained for safety.",
    features: ["40+ bus routes", "GPS tracked buses", "Pick-up & drop facility", "Monthly pass available"],
  },
];

export function FacilitiesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [facilities, setFacilities] = useState(initialFacilities);
  const [editing, setEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", desc: "", features: ["", "", "", ""] });

  const startEdit = (f: typeof facilities[0]) => {
    setEditForm({ title: f.title, desc: f.desc, features: [...f.features] });
    setEditing(f.id);
  };
  const saveEdit = (id: number) => {
    setFacilities((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, title: editForm.title, desc: editForm.desc, features: editForm.features.filter(Boolean) }
          : f
      )
    );
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div
        className="rounded-[2.5rem] p-8 mb-4 relative overflow-hidden bento-card-strong shadow-2xl border-none"
        style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}
      >
        <div className="relative z-10">
          <p className="text-indigo-200 text-[10px] mb-2 tracking-[0.2em] font-bold uppercase">
            Campus Infrastructure
          </p>
          <h2 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Campus Facilities</h2>
          <p className="text-indigo-100/90 text-sm font-medium max-w-xl">
            BIT Sathy offers world-class facilities to ensure a holistic learning environment for all students.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((f) => (
          <div
            key={f.id}
            className="bento-card-strong rounded-[2.5rem] overflow-hidden border-none hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            {editing === f.id ? (
              /* Edit Form */
              <div className="p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className="text-gray-700 text-base" style={{ fontWeight: 700 }}>Editing: {f.title}</h3>
                </div>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]"
                  placeholder="Facility title"
                />
                <textarea
                  value={editForm.desc}
                  onChange={(e) => setEditForm((p) => ({ ...p, desc: e.target.value }))}
                  rows={3}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE] resize-none"
                  placeholder="Description"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-600" style={{ fontWeight: 600 }}>Key Features</p>
                  {editForm.features.map((feat, i) => (
                    <input
                      key={i}
                      value={feat}
                      onChange={(e) => {
                        const arr = [...editForm.features]; arr[i] = e.target.value;
                        setEditForm((p) => ({ ...p, features: arr }));
                      }}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5540DE]"
                      placeholder={`Feature ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setEditing(null)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50"
                  >
                    <X size={13} /> Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(f.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm hover:opacity-90"
                    style={{ background: f.color, fontWeight: 600 }}
                  >
                    <Save size={13} /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Facility Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover"
                    style={{ transition: "transform 0.3s ease" }}
                    onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
                  />
                  {/* Image overlay gradient */}
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)` }}
                  />
                  {/* Icon badge */}
                  <div
                    className="absolute bottom-3 left-4 flex items-center gap-2"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}
                    >
                      {f.icon}
                    </div>
                    <h3 className="text-white text-base" style={{ fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                      {f.title}
                    </h3>
                  </div>
                  {/* Edit button */}
                  {isAdmin && (
                    <button
                      onClick={() => startEdit(f)}
                      className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs hover:opacity-90"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        color: f.color,
                        fontWeight: 600,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <Pencil size={11} /> Edit
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Color strip */}
                  <div
                    className="w-12 h-1.5 rounded-full mb-4"
                    style={{ background: `linear-gradient(90deg, ${f.color}, ${f.color}55)` }}
                  />
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.desc}</p>

                  {/* Features grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {f.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{ background: `${f.color}0d`, border: `1px solid ${f.color}20` }}
                      >
                        <CheckCircle size={12} style={{ color: f.color, flexShrink: 0 }} />
                        <span className="text-xs text-gray-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}