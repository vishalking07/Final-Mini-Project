import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, UserRole } from "../context/AuthContext";
import {
  Eye, EyeOff, AlertCircle, Loader2, GraduationCap, Shield,
  ArrowRight, CheckCircle2, MapPin, Phone, Globe,
} from "lucide-react";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { BITLogo } from "./BITLogo";

const campusImg = "https://images.unsplash.com/photo-1770967004881-5e8795cb5fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

export function LoginPage() {
  const [role, setRole] = useState<UserRole>("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    const result = await login({ role, identifier: identifier.trim(), password });
    if (result.success) { setSuccess(result.message); setTimeout(() => navigate("/"), 600); }
    else { setError(result.message); setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      setError(""); setLoading(true);
      const result = await loginWithGoogle(credentialResponse.credential);
      if (result.success) { setSuccess(result.message); setTimeout(() => navigate("/"), 600); }
      else { setError(result.message); setLoading(false); }
    }
  };

  const features = [
    "Interactive Schedule & Weekly Calendar",
    "Rules, Facilities & Departments Guide",
    "Document Management & Verification",
    "24/7 Support Desk & Resources",
  ];

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4"
      style={{
        background: "linear-gradient(135deg, rgb(210,200,255) 0%, rgb(238,215,255) 50%, rgb(253,200,249) 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-80px] w-[420px] h-[420px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c6de8, #5540DE)" }} />
      <div className="absolute bottom-[-80px] right-[-60px] w-[360px] h-[360px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #f0abfc, #e879f9)" }} />
      <div className="absolute top-[40%] left-[30%] w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #a78bfa, #6d28d9)" }} />

      <div
        className="relative w-full max-w-5xl rounded-3xl overflow-hidden flex shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 32px 80px rgba(85,64,222,0.28)",
          minHeight: "620px",
        }}
      >
        {/* ── Left: Branding Panel ── */}
        <div className="relative flex-1 hidden md:flex flex-col overflow-hidden">
          <img src={campusImg} alt="BIT Campus" className="absolute inset-0 w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(150deg, rgba(85,64,222,0.92) 0%, rgba(30,20,100,0.96) 100%)" }}
          />
          <div className="relative z-10 flex flex-col justify-between h-full p-10">
            {/* Top: Logo */}
            <div>
              <BITLogo size={56} showText={true} textColor="white" subTextColor="rgba(255,255,255,0.65)" />
              <div className="mt-3 h-px w-16 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
            </div>

            {/* Middle: Hero text */}
            <div>
              <h1 className="text-white text-4xl leading-tight mb-3" style={{ fontWeight: 800 }}>
                Student<br />Orientation<br />Portal
              </h1>
              <p className="text-white/75 text-sm leading-relaxed mb-7">
                Your gateway to academic information, resources, schedules, and support at Bannari Amman Institute of Technology.
              </p>
              <div className="flex flex-col gap-2.5">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} className="text-green-300 shrink-0" />
                    <span className="text-white/80 text-xs">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: College info */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <div className="flex items-start gap-2.5 mb-2">
                <MapPin size={13} className="text-white/50 mt-0.5 shrink-0" />
                <p className="text-white/80 text-xs leading-relaxed">
                  Sathyamangalam – 638 401, Erode District, Tamil Nadu
                </p>
              </div>
              <div className="flex items-center gap-2.5 mb-2">
                <Phone size={13} className="text-white/50 shrink-0" />
                <p className="text-white/80 text-xs">+91-4295-226001 / 226006</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe size={13} className="text-white/50 shrink-0" />
                <p className="text-white/80 text-xs">www.bitsathy.ac.in</p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/15 flex gap-3">
                {["NAAC A+", "NBA Accredited", "Anna University"].map((b) => (
                  <span key={b} className="text-white/60 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Login Form ── */}
        <div
          className="flex flex-col justify-center p-8 md:p-10 w-full md:w-[420px] shrink-0"
          style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)" }}
        >
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3 mb-6">
            <BITLogo size={40} showText={true} textColor="#1F2937" subTextColor="#6B7280" />
          </div>

          <h2 className="text-gray-800 text-2xl mb-1" style={{ fontWeight: 800 }}>Sign In</h2>
          <p className="text-gray-500 text-sm mb-6">
            {role === "student" ? "Enter your Roll Number to continue" : "Admin access only"}
          </p>

          {/* Role Toggle */}
          <div
            className="flex rounded-2xl p-1 mb-6"
            style={{
              background: "rgba(85,64,222,0.08)",
              border: "1px solid rgba(85,64,222,0.15)",
            }}
          >
            {(["student", "admin"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setError(""); setIdentifier(""); setPassword(""); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all capitalize"
                style={{
                  background: role === r ? "#5540DE" : "transparent",
                  color: role === r ? "white" : "#6B7280",
                  fontWeight: role === r ? 600 : 400,
                  boxShadow: role === r ? "0 4px 12px rgba(85,64,222,0.35)" : "none",
                }}
              >
                {r === "student" ? <GraduationCap size={15} /> : <Shield size={15} />}
                {r === "student" ? "Student" : "Admin"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5" style={{ fontWeight: 600 }}>
                {role === "admin" ? "Email Address" : "Roll Number / Email"}
              </label>
              <input
                type={role === "admin" ? "email" : "text"}
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError(""); }}
                placeholder={role === "admin" ? "admin@bitsathy.ac.in" : "e.g. 21CS001"}
                className="w-full rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-all placeholder-gray-400"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1.5px solid rgba(85,64,222,0.2)",
                  fontFamily: "'Poppins', sans-serif",
                }}
                onFocus={(e) => (e.target.style.border = "1.5px solid #5540DE")}
                onBlur={(e) => (e.target.style.border = "1.5px solid rgba(85,64,222,0.2)")}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5" style={{ fontWeight: 600 }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-gray-700 outline-none transition-all placeholder-gray-400"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    border: "1.5px solid rgba(85,64,222,0.2)",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.border = "1.5px solid #5540DE")}
                  onBlur={(e) => (e.target.style.border = "1.5px solid rgba(85,64,222,0.2)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            ) : null}
            {success ? (
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                <p className="text-green-600 text-xs">{success}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-sm hover:opacity-90 mt-1 disabled:opacity-70 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #6d5ae8, #5540DE)",
                fontWeight: 600,
                boxShadow: "0 6px 20px rgba(85,64,222,0.4)",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {loading && identifier ? (
                <><Loader2 size={15} className="animate-spin" /> Signing in...</>
              ) : (
                <>{role === "admin" ? "Admin Login" : "Student Login"}<ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {role === "student" && (
            <div className="flex flex-col gap-4 mt-4">
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300/50"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">or continue with</span>
                <div className="flex-grow border-t border-gray-300/50"></div>
              </div>
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Sign-In was unsuccessful or interrupted.")}
                  useOneTap
                  shape="rectangular"
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                />
              </div>
              {loading && !identifier && !error && !success && (
                <div className="flex items-center justify-center gap-2 text-indigo-600 text-sm">
                  <Loader2 size={16} className="animate-spin" /> Verifying identity...
                </div>
              )}
            </div>
          )}



          <p className="text-center text-gray-400 text-xs mt-5">
            Bannari Amman Institute of Technology © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
