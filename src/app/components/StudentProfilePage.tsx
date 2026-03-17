import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import {
  User, Mail, Phone, BookOpen, Calendar, Droplets, MapPin,
  GraduationCap, ExternalLink, Camera, Printer, IdCard,
  Activity, CreditCard,
} from "lucide-react";

// Default student profile photo
const DEFAULT_STUDENT_PHOTO = "https://images.unsplash.com/photo-1727875075949-8b36efd25260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";

const PORTAL_LINKS = [
  { name: "BIP Portal", url: "https://bip.bitsathy.ac.in/", color: "#5540DE", icon: "🏛️", desc: "Results, Fee Payment, OD" },
  { name: "Support Desk", url: "https://supportdesk.bitsathy.ac.in/", color: "#059669", icon: "🎫", desc: "Raise & Track Tickets" },
  { name: "BIT Wiki", url: "https://wiki.bitsathy.ac.in/", color: "#0891B2", icon: "📖", desc: "Study Materials & Notes" },
  { name: "BIT Website", url: "https://www.bitsathy.ac.in/", color: "#7C3AED", icon: "🌐", desc: "Official College Website" },
];

export function StudentProfilePage() {
  const { user } = useAuth();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handlePrint = () => window.print();

  if (!user || user.role !== "student") {
    // Admin should not see the student profile page at all
    return <Navigate to="/" replace />;
  }

  const onPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfilePhoto(url);
    e.target.value = "";
  };

  return (
    <div className="max-w-[1100px] mx-auto bit-print-area">

      {/* ── Hero Header ── */}
      <div
        className="rounded-[2.5rem] p-8 mb-8 relative overflow-hidden bento-card-strong border-none shadow-2xl"
        style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}
      >
        <div className="relative z-10 flex items-center gap-6">
          {/* Profile Photo */}
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden"
              style={{ border: "3px solid rgba(255,255,255,0.4)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
            >
              <img
                src={profilePhoto || DEFAULT_STUDENT_PHOTO}
                alt={user.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <button
              onClick={() => photoInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity bit-no-print"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.4)" }}
              title="Change profile photo"
            >
              <Camera size={12} className="text-white" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-4xl mb-1.5" style={{ fontWeight: 800 }}>{user.name}</h1>
            <p className="text-indigo-100/90 text-sm mb-3 font-medium">{user.rollNo} · {user.department}</p>
            <div className="flex gap-3 flex-wrap">
              <span className="px-3.5 py-1.5 rounded-full text-xs text-white shadow-sm" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 700 }}>
                🎓 {user.year}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs text-white" style={{ background: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
                Section {user.section}
              </span>
            </div>
          </div>

          {/* Print / Export buttons */}
          <div className="hidden sm:flex flex-col gap-2 shrink-0 bit-no-print">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 600 }}
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={() => alert("ID Card download will be available once BIP portal integration is enabled.")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 600 }}
            >
              <IdCard size={14} /> ID Card
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl z-0" />
      </div>

      {/* ── Academic Summary Strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {[
          { icon: BookOpen, color: "#5540DE", bg: "#EEF2FF", label: "CGPA", value: "8.42", sub: "Current Semester" },
          { icon: Activity, color: "#059669", bg: "#ECFDF5", label: "Attendance", value: "82%", sub: "Present / 180 days" },
          { icon: CreditCard, color: "#D97706", bg: "#FFFBEB", label: "Fee Status", value: "Due", sub: "₹45,000 · Feb 28" },
        ].map(s => (
          <div key={s.label} className="bento-card-strong rounded-[2rem] p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-none">
            <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-sm" style={{ background: s.bg }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-gray-800 text-lg leading-none" style={{ fontWeight: 800 }}>{s.value}</p>
              <p className="text-gray-600 text-xs mt-0.5" style={{ fontWeight: 600 }}>{s.label}</p>
              <p className="text-gray-400 text-[10px]">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Profile Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div
          className="lg:col-span-2 bento-card-strong rounded-[2.5rem] p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border-none"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 rounded-full bg-[#5540DE]" />
            <h3 className="text-[var(--foreground)]" style={{ fontWeight: 800, fontSize: "18px" }}>Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {[
              { icon: <User size={14} />, l: "Full Name", v: user.name },
              { icon: <Mail size={14} />, l: "Email Address", v: user.email },
              { icon: <Phone size={14} />, l: "Phone", v: user.phone || "—" },
              { icon: <Calendar size={14} />, l: "Date of Birth", v: user.dob ? new Date(user.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—" },
              { icon: <Droplets size={14} />, l: "Blood Group", v: user.bloodGroup || "—" },
              { icon: <MapPin size={14} />, l: "Address", v: user.address || "—" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 sm:even:border-l sm:even:pl-5"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#EEF2FF", color: "#5540DE" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">{item.l}</p>
                  <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{item.v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Academic Details */}
          <div
            className="bento-card-strong rounded-[2.5rem] p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border-none"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 rounded-full bg-[#059669]" />
              <h3 className="text-[var(--foreground)]" style={{ fontWeight: 800, fontSize: "18px" }}>Academic Details</h3>
            </div>
            {[
              { icon: <BookOpen size={14} />, l: "Roll Number", v: user.rollNo },
              { icon: <GraduationCap size={14} />, l: "Department", v: user.department },
              { icon: <BookOpen size={14} />, l: "Year", v: user.year },
              { icon: <User size={14} />, l: "Section", v: `Section ${user.section}` },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "#ECFDF5", color: "#059669" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-gray-400 text-xs">{item.l}</p>
                  <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{item.v}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Portal Links */}
          <div
            className="bento-card-strong rounded-[2.5rem] p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border-none"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 rounded-full bg-[#0891B2]" />
              <h3 className="text-[var(--foreground)]" style={{ fontWeight: 800, fontSize: "18px" }}>Quick Portal Links</h3>
            </div>
            {PORTAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl transition-all mb-2 last:mb-0 group"
                style={{
                  background: `${link.color}08`,
                  border: `1px solid ${link.color}20`,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = `${link.color}12`)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = `${link.color}08`)}
              >
                <span className="text-lg shrink-0">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: link.color, fontWeight: 600 }}>{link.name}</p>
                  <p className="text-gray-400 text-xs">{link.desc}</p>
                </div>
                <ExternalLink size={13} style={{ color: link.color }} className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={onPhotoSelected} />
    </div>
  );
}