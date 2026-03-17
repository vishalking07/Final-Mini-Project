import { useState } from "react";
import {
    Settings, Save, User, Mail, Phone, Globe,
    BookOpen, Calendar, Bell, Lock, CheckCircle2, Building2,
} from "lucide-react";

const SEMESTERS = ["Odd Semester (Jul–Nov)", "Even Semester (Jan–May)"];

interface PortalSettings {
    academicYear: string;
    semester: string;
    collegeName: string;
    address: string;
    phone1: string;
    phone2: string;
    email: string;
    website: string;
    announcementEmail: boolean;
    announcementBell: boolean;
}

const DEFAULT_SETTINGS: PortalSettings = {
    academicYear: "2025–2026",
    semester: SEMESTERS[1],
    collegeName: "Bannari Amman Institute of Technology",
    address: "Sathyamangalam – 638 401, Erode District, Tamil Nadu",
    phone1: "+91-4295-226001",
    phone2: "+91-4295-226006",
    email: "principal@bitsathy.ac.in",
    website: "www.bitsathy.ac.in",
    announcementEmail: true,
    announcementBell: true,
};

export function AdminSettingsPage() {
    const [settings, setSettings] = useState<PortalSettings>(DEFAULT_SETTINGS);
    const [saved, setSaved] = useState(false);
    const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
    const [pwSaved, setPwSaved] = useState("");
    const [showPw, setShowPw] = useState(false);

    const set = <K extends keyof PortalSettings>(k: K, v: PortalSettings[K]) =>
        setSettings(p => ({ ...p, [k]: v }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handlePwSave = () => {
        if (!pwForm.current || !pwForm.next) { setPwSaved("error"); return; }
        if (pwForm.next !== pwForm.confirm) { setPwSaved("mismatch"); return; }
        setPwSaved("success");
        setPwForm({ current: "", next: "", confirm: "" });
        setTimeout(() => setPwSaved(""), 2500);
    };

    const Card = ({ title, accent, icon, children }: { title: string; accent: string; icon: React.ReactNode; children: React.ReactNode }) => (
        <div className="bento-card-strong rounded-[2.5rem] p-8 mb-6 border-none shadow-xl transition-all"
            style={{ boxShadow: `0 8px 32px ${accent}15` }}>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 rounded-full" style={{ background: accent }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: `${accent}15` }}>{icon}</div>
                <h2 className="text-gray-800 text-xl" style={{ fontWeight: 800 }}>{title}</h2>
            </div>
            {children}
        </div>
    );

    const InputRow = ({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
        <div>
            <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#5540DE] bg-white/60"
                style={{ fontFamily: "'Poppins', sans-serif" }} />
        </div>
    );

    return (
        <div className="max-w-[900px] mx-auto pb-8">
            {/* Hero */}
            <div className="rounded-[2.5rem] p-9 mb-8 relative overflow-hidden bento-card-strong shadow-2xl border-none" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
                <div className="relative z-10">
                    <p className="text-indigo-200 text-[10px] mb-2 tracking-[0.2em] uppercase font-bold">Administration</p>
                    <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Portal Settings</h1>
                    <p className="text-indigo-100/90 text-sm font-medium">Configure academic year, college info, and portal preferences.</p>
                </div>
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
                <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
            </div>

            {/* Academic Settings */}
            <Card title="Academic Configuration" accent="#5540DE" icon={<Calendar size={16} style={{ color: "#5540DE" }} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputRow label="Academic Year" value={settings.academicYear} onChange={v => set("academicYear", v)} placeholder="2025–2026" />
                    <div>
                        <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>Current Semester</label>
                        <select value={settings.semester} onChange={e => set("semester", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#5540DE] bg-white/60">
                            {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            {/* College Info */}
            <Card title="College Information" accent="#059669" icon={<Building2 size={16} style={{ color: "#059669" }} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <InputRow label="College Name" value={settings.collegeName} onChange={v => set("collegeName", v)} />
                    </div>
                    <div className="sm:col-span-2">
                        <InputRow label="Address" value={settings.address} onChange={v => set("address", v)} />
                    </div>
                    <InputRow label="Phone 1" value={settings.phone1} onChange={v => set("phone1", v)} />
                    <InputRow label="Phone 2" value={settings.phone2} onChange={v => set("phone2", v)} />
                    <InputRow label="Official Email" value={settings.email} onChange={v => set("email", v)} type="email" />
                    <InputRow label="Website" value={settings.website} onChange={v => set("website", v)} />
                </div>
            </Card>

            {/* Notification Preferences */}
            <Card title="Notification Preferences" accent="#0891B2" icon={<Bell size={16} style={{ color: "#0891B2" }} />}>
                <div className="flex flex-col gap-3">
                    {[
                        { key: "announcementEmail" as const, icon: <Mail size={14} />, label: "Email Notifications", desc: "Receive emails for new support tickets and announcements" },
                        { key: "announcementBell" as const, icon: <Bell size={14} />, label: "In-Portal Bell", desc: "Show badge notifications inside the portal" },
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-white/40"
                            style={{ background: "rgba(85,64,222,0.04)", border: "1px solid rgba(85,64,222,0.1)" }}>
                            <div className="flex items-center gap-4">
                                <div className="text-[#5540DE] bg-white p-2.5 rounded-lg shadow-sm">{item.icon}</div>
                                <div>
                                    <p className="text-gray-800 text-sm" style={{ fontWeight: 700 }}>{item.label}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                            <button onClick={() => set(item.key, !settings[item.key])}
                                className="relative w-11 h-6 rounded-full transition-all shrink-0"
                                style={{ background: settings[item.key] ? "#5540DE" : "#D1D5DB" }}>
                                <span className="absolute top-1 transition-all rounded-full bg-white shadow-sm"
                                    style={{ width: "16px", height: "16px", left: settings[item.key] ? "24px" : "4px" }} />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Save Button */}
            <div className="flex items-center gap-3 mb-5">
                <button onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
                    style={{ background: "#5540DE", fontWeight: 600 }}>
                    <Save size={15} /> Save Settings
                </button>
                {saved && (
                    <div className="flex items-center gap-1.5 text-green-600 text-sm">
                        <CheckCircle2 size={15} />
                        <span style={{ fontWeight: 600 }}>Settings saved!</span>
                    </div>
                )}
            </div>

            {/* Password Change */}
            <Card title="Change Admin Password" accent="#7C3AED" icon={<Lock size={16} style={{ color: "#7C3AED" }} />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {[
                        { l: "Current Password", k: "current" as const },
                        { l: "New Password", k: "next" as const },
                        { l: "Confirm Password", k: "confirm" as const },
                    ].map(f => (
                        <div key={f.k}>
                            <label className="block text-xs text-gray-600 mb-1" style={{ fontWeight: 600 }}>{f.l}</label>
                            <input type={showPw ? "text" : "password"} value={pwForm[f.k]} onChange={e => setPwForm(p => ({ ...p, [f.k]: e.target.value }))}
                                placeholder="••••••••"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#5540DE] bg-white/60"
                                style={{ fontFamily: "'Poppins', sans-serif" }} />
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                        <input type="checkbox" checked={showPw} onChange={e => setShowPw(e.target.checked)} className="rounded" />
                        Show passwords
                    </label>
                    <button onClick={handlePwSave}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
                        style={{ background: "#7C3AED", fontWeight: 600 }}>
                        <Lock size={13} /> Update Password
                    </button>
                    {pwSaved === "success" && <span className="text-green-600 text-xs flex items-center gap-1"><CheckCircle2 size={13} /> Password updated!</span>}
                    {pwSaved === "mismatch" && <span className="text-red-500 text-xs">Passwords do not match.</span>}
                    {pwSaved === "error" && <span className="text-red-500 text-xs">Please fill all fields.</span>}
                </div>
            </Card>

            {/* About Portal */}
            <div className="bento-card rounded-[2.5rem] p-6 flex items-center gap-5 shadow-sm border-none mb-4"
                style={{ background: "linear-gradient(135deg, rgba(85,64,222,0.06), rgba(124,58,237,0.06))", border: "1px solid rgba(85,64,222,0.15)" }}>
                <div className="w-14 h-14 rounded-2xl bg-[#5540DE] flex items-center justify-center shrink-0 shadow-lg" style={{ boxShadow: "0 8px 24px rgba(85,64,222,0.4)" }}>
                    <BookOpen size={24} className="text-white" />
                </div>
                <div>
                    <p className="text-gray-800 text-base" style={{ fontWeight: 800 }}>Student Orientation Portal v1.0</p>
                    <p className="text-gray-500 text-sm font-medium mt-0.5">Built for Bannari Amman Institute of Technology · Academic Year {settings.academicYear}</p>
                </div>
                <div className="ml-auto flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white shadow-sm" style={{ color: "#5540DE", fontWeight: 700 }}>
                    <Globe size={16} />
                    <a href={`https://${settings.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{settings.website}</a>
                </div>
            </div>
        </div>
    );
}
