import { Quote, Award, MapPin, GraduationCap, Users, BookOpen, Clock } from "lucide-react";

import campusImg1 from "../../../src/BIT.jpg";
import campusImg2 from "../../../src/BIT.jpg";
import chairmanPhoto from "../../../src/Chairman.png";
import principalPhoto from "../../../src/Principal.png";
const leadership = [
  {
    role: "Chairman",
    name: "Thiru S V Balasubramaniam",
    photo: chairmanPhoto,
    gradient: "linear-gradient(135deg, #1a0a3a 0%, #5540DE 60%, #9b59b6 100%)",
    accentColor: "#a78bfa",
    badgeBg: "rgba(255,255,255,0.18)",
    badge: "Founder & Chairman",
    msg: "Beyond providing a sound education, we wish to provide our students with a holistic learning experience for life. Our aim is to teach students to LEARN, not just to STUDY. BIT has grown into one of Tamil Nadu's premier institutions through the collective dedication of our faculty and students.",
    stats: [{ icon: Award, label: "Est.", value: "2001" }, { icon: Users, label: "Students", value: "5000+" }, { icon: BookOpen, label: "Depts", value: "14+" }],
  },
  {
    role: "Principal",
    name: "Dr. C Palanisamy",
    photo: principalPhoto,
    gradient: "linear-gradient(135deg, #062520 0%, #059669 60%, #34d399 100%)",
    accentColor: "#6ee7b7",
    badgeBg: "rgba(255,255,255,0.18)",
    badge: "Principal & Director",
    msg: "At BIT, we strive to create an environment where every student can discover their potential and grow into a leader of tomorrow, contributing to nation-building. Our commitment to academic excellence, ethical values, and holistic development shapes every graduate we produce.",
    stats: [{ icon: Award, label: "NAAC", value: "A+" }, { icon: GraduationCap, label: "Placed", value: "847+" }, { icon: Clock, label: "Years", value: "23+" }],
  },
];

const quickStats = [
  { label: "Established", value: "2001", emoji: "🏛️", gradient: "linear-gradient(135deg,#5540DE,#7c6de8)" },
  { label: "Departments", value: "14+", emoji: "📚", gradient: "linear-gradient(135deg,#059669,#34d399)" },
  { label: "Students", value: "5000+", emoji: "🎓", gradient: "linear-gradient(135deg,#D97706,#fbbf24)" },
  { label: "NAAC Grade", value: "A+", emoji: "⭐", gradient: "linear-gradient(135deg,#DC2626,#f87171)" },
];

const accreditations = [
  { name: "NAAC", grade: "A+", body: "National Assessment & Accreditation Council", emoji: "🏆" },
  { name: "NBA", grade: "Accredited", body: "National Board of Accreditation", emoji: "🎖️" },
  { name: "AU", grade: "Affiliated", body: "Anna University, Chennai", emoji: "🎓" },
  { name: "NIRF", grade: "Ranked", body: "National Institutional Ranking Framework", emoji: "📊" },
];

export function AboutPage() {
  return (
    <div className="flex flex-col gap-8 pb-8">

      {/* ── Hero Banner ── */}
      <div className="rounded-[3rem] p-10 relative overflow-hidden bento-card-strong shadow-2xl border-none" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)", minHeight: "360px" }}>
        <div className="relative z-10 max-w-2xl flex flex-col justify-center h-full pt-10 pb-8">
          <p className="text-indigo-200 text-xs mb-3 tracking-[0.2em] uppercase font-bold">
            About the Institution
          </p>
          <h2 className="text-white text-5xl mb-4" style={{ fontWeight: 900, lineHeight: 1.15 }}>
            Bannari Amman<br />
            <span style={{ opacity: 0.85 }}>Institute of Technology</span>
          </h2>
          <p className="text-indigo-100 text-base leading-relaxed max-w-lg font-medium">
            An autonomous institution affiliated to Anna University, established in 2001,
            offering engineering and technology programs across 14+ departments. Committed
            to academic excellence, research, and holistic development.
          </p>
          <div className="flex items-center gap-3 mt-8 flex-wrap">
            {["NAAC A+", "NBA Accredited", "Anna University", "Est. 2001", "5000+ Students"].map(tag => (
              <span key={tag} className="px-5 py-2 rounded-full text-xs text-white shadow-sm"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 600 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Decorative orbs */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-60 h-60 rounded-full bg-purple-500/20 blur-2xl z-0" />
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {quickStats.map(s => (
          <div key={s.label} className="bento-card-strong rounded-[2.5rem] p-6 text-center shadow-lg border-none hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ background: s.gradient }} />
              <div className="relative z-10">{s.emoji}</div>
            </div>
            <span className="text-4xl block mb-2" style={{ fontWeight: 900, background: s.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {s.value}
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Vision & Mission ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl bento-card-strong border-none" style={{ minHeight: "360px" }}>
          <img src={campusImg1} alt="BIT Campus" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
        </div>
        <div className="rounded-[2.5rem] p-10 flex flex-col justify-center bento-card-strong shadow-xl border-none" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 rounded-full bg-yellow-300 shadow-sm" />
            <h3 className="text-white text-3xl" style={{ fontWeight: 800 }}>Vision</h3>
          </div>
          <ul className="text-indigo-100 text-base leading-relaxed space-y-4 font-medium">
            {[
              "To be a centre of excellence providing world-class education that transforms individuals into intellectual, empathetic and responsible citizens.",
              "To foster innovation and entrepreneurship with cutting-edge research facilities and industry collaborations.",
              "To nurture ethical, socially responsible graduates contributing meaningfully to society.",
            ].map((v, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-yellow-300 mt-1 shrink-0 text-[10px]">◆</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2.5rem] p-10 flex flex-col justify-center bento-card-strong shadow-xl border-none" style={{ background: "linear-gradient(135deg, #062520 0%, #059669 100%)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 rounded-full bg-green-300 shadow-sm" />
            <h3 className="text-white text-3xl" style={{ fontWeight: 800 }}>Mission</h3>
          </div>
          <ul className="text-green-100 text-base leading-relaxed space-y-4 font-medium">
            {[
              "Provide top-of-the-line infrastructure conducive for learning and research.",
              "Engage committed faculty who infuse subject knowledge with modern teaching pedagogies.",
              "Provide state-of-the-art facilities for research and development.",
              "Collaborate industry with academia, empowering students to meet global standards.",
              "Create an enterprising environment for continual progress that respects diversity.",
            ].map((m, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-green-300 mt-1 shrink-0 text-[10px]">◆</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl bento-card-strong border-none" style={{ minHeight: "360px" }}>
          <img src={campusImg2} alt="BIT Campus" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
        </div>
      </div>

      {/* ── Premium Leadership Cards ── */}
      <div className="pt-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-8 rounded-full" style={{ background: "#5540DE" }} />
          <h3 className="text-2xl" style={{ fontWeight: 800, color: "var(--foreground)" }}>Leadership</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {leadership.map(leader => (
            <div key={leader.role} className="bento-card-strong rounded-[3rem] overflow-hidden shadow-2xl border-none transition-transform hover:-translate-y-2">
              {/* Full-bleed gradient header */}
              <div className="relative overflow-hidden" style={{ background: leader.gradient, padding: "40px 36px 96px" }}>
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="absolute right-10 bottom-0 w-24 h-24 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />

                {/* Role badge */}
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-white mb-5 shadow-sm"
                  style={{ background: leader.badgeBg, border: "1px solid rgba(255,255,255,0.25)", fontWeight: 700, backdropFilter: "blur(8px)" }}>
                  <span className="w-2 h-2 rounded-full bg-white/90 inline-block shadow-sm" />
                  {leader.role}
                </span>

                <h4 className="text-white text-3xl mb-2" style={{ fontWeight: 800 }}>{leader.name}</h4>
                <p className="text-sm font-medium" style={{ color: leader.accentColor }}>{leader.badge}</p>

                {/* Mini stats row */}
                <div className="flex gap-6 mt-6">
                  {leader.stats.map(st => (
                    <div key={st.label} className="text-center">
                      <p className="text-white text-lg" style={{ fontWeight: 800 }}>{st.value}</p>
                      <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{st.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo — overlapping card boundary */}
              <div className="bento-card px-8 pb-8 -mt-16 relative mx-4 rounded-[2rem] shadow-lg border-none mb-4">
                <div className="flex items-end gap-6 mb-6">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 relative"
                    style={{ border: "4px solid var(--bento-bg)", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", marginTop: "-16px" }}>
                    <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="pb-2">
                    <p className="text-base" style={{ fontWeight: 800, color: "var(--foreground)" }}>{leader.name}</p>
                    <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>{leader.badge}</p>
                  </div>
                </div>
                {/* Quote */}
                <div className="relative rounded-2xl p-5 bento-card shadow-sm border-none">
                  <Quote size={24} className="absolute top-4 left-4 opacity-10" style={{ color: "var(--foreground)" }} />
                  <p className="text-sm leading-relaxed pl-8 pr-2 italic font-medium" style={{ color: "var(--muted-foreground)" }}>
                    {leader.msg}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Accreditations ── */}
      <div className="pt-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-8 rounded-full" style={{ background: "#5540DE" }} />
          <h3 className="text-2xl" style={{ fontWeight: 800, color: "var(--foreground)" }}>Accreditations & Affiliations</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {accreditations.map(acc => (
            <div key={acc.name} className="bento-card rounded-[2.5rem] p-6 text-center group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border-none shadow-md">
              <div className="text-4xl mb-4">{acc.emoji}</div>
              <div className="w-16 h-8 rounded-xl flex items-center justify-center text-white text-xs mx-auto mb-3 shadow-sm"
                style={{ background: "linear-gradient(135deg, #5540DE, #2e2378)", fontWeight: 800, letterSpacing: "0.04em" }}>
                {acc.name}
              </div>
              <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{acc.grade}</p>
              <p className="text-xs mt-1 leading-tight font-medium" style={{ color: "var(--muted-foreground)" }}>{acc.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Location Card ── */}
      <div className="bento-card-strong rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-start gap-6 shadow-xl border-none mt-4">
        <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-white shrink-0 shadow-lg" style={{ background: "linear-gradient(135deg,#DC2626,#f87171)" }}>
          <MapPin size={28} />
        </div>
        <div className="flex-1">
          <p className="text-xl mb-2" style={{ fontWeight: 800, color: "var(--foreground)" }}>Campus Location</p>
          <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Bannari Amman Institute of Technology, Sathyamangalam – 638 401,<br />
            Erode District, Tamil Nadu, India
          </p>
          <p className="text-sm mt-3 font-semibold" style={{ color: "var(--muted-foreground)" }}>
            📞 +91-4295-226001 &nbsp;•&nbsp; 🌐{" "}
            <a href="https://www.bitsathy.ac.in" target="_blank" rel="noopener noreferrer" className="text-[#5540DE] hover:underline">bitsathy.ac.in</a>
          </p>
        </div>
        <a href="https://maps.google.com/?q=Bannari+Amman+Institute+of+Technology+Sathyamangalam" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm hover:opacity-90 transition-opacity shrink-0 shadow-sm"
          style={{ background: "linear-gradient(135deg,#5540DE,#2e2378)", fontWeight: 700 }}>
          View on Maps
        </a>
      </div>
    </div>
  );
}