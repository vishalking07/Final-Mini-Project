import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard, BookOpen, Building2, GraduationCap, Users,
  CalendarDays, Award, Home, CalendarRange, Trophy, FileText,
  HeadphonesIcon, LogOut, Moon, Sun, Shield, FolderOpen,
  Settings, Bell, UserCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { BITLogo } from "./BITLogo";

const STUDENT_NAV = [
  {
    title: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "Institution",
    items: [
      { to: "/about", label: "About BIT", icon: BookOpen, exact: true },
      { to: "/about/rules", label: "Rules & Regulations", icon: Shield, exact: true },
      { to: "/about/facilities", label: "Facilities", icon: Building2, exact: true },
      { to: "/about/departments", label: "Departments", icon: GraduationCap, exact: true },
      { to: "/about/faculties", label: "Faculty", icon: Users, exact: true },
    ],
  },
  {
    title: "Campus Life",
    items: [
      { to: "/campus", label: "Events & Clubs", icon: CalendarDays, exact: true },
      { to: "/campus/achievements", label: "Achievements", icon: Award, exact: true },
      { to: "/campus/hostel", label: "Hostel", icon: Home, exact: true },
    ],
  },
  {
    title: "Academic & Career",
    items: [
      { to: "/timetable", label: "Exam Timetable", icon: CalendarRange, exact: true },
      { to: "/placements", label: "Placements", icon: Trophy, exact: true },
    ],
  },
  {
    title: "Resources",
    items: [
      { to: "/documents", label: "My Documents", icon: FolderOpen, exact: true },
      { to: "/support", label: "Support", icon: HeadphonesIcon, exact: true },
    ],
  },
];

const ADMIN_NAV = [
  {
    title: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "Manage",
    items: [
      { to: "/admin/students", label: "Students", icon: UserCheck, exact: true },
      { to: "/about/faculties", label: "Faculties", icon: GraduationCap, exact: true },
      { to: "/about/departments", label: "Departments", icon: Building2, exact: true },
    ],
  },
  {
    title: "Content",
    items: [
      { to: "/campus", label: "Events & Clubs", icon: CalendarDays, exact: true },
      { to: "/campus/achievements", label: "Achievements", icon: Award, exact: true },
      { to: "/placements", label: "Placements", icon: Trophy, exact: true },
      { to: "/documents", label: "Documents", icon: FileText, exact: true },
      { to: "/timetable", label: "Exam Timetable", icon: CalendarRange, exact: true },
    ],
  },
  {
    title: "Communication",
    items: [
      { to: "/support", label: "Support Tickets", icon: HeadphonesIcon, exact: true },
    ],
  },
  {
    title: "Configuration",
    items: [
      { to: "/admin/settings", label: "Portal Settings", icon: Settings, exact: true },
    ],
  },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const NAV_GROUPS = isAdmin ? ADMIN_NAV : STUDENT_NAV;

  const isActive = (to: string, exact: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div className="h-full flex flex-col bento-card-strong w-full sm:w-[280px] overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <BITLogo size={30} showText={false} />
          <div>
            <h1 className="text-[15px] leading-tight tracking-tight text-sidebar-foreground" style={{ fontWeight: 700 }}>
              BIT Sathy
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase" style={{ fontWeight: 500 }}>
              {isAdmin ? "Admin Portal" : "Student Portal"}
            </p>
          </div>
        </div>

        {/* Role Badge */}
        {isAdmin ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 mb-1">
            <Shield size={13} />
            <span className="text-[11px]" style={{ fontWeight: 600 }}>Admin Access</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 mb-1">
            <GraduationCap size={13} />
            <span className="text-[11px]" style={{ fontWeight: 600 }}>{user?.department?.split(" ")[0] || "Student"} · {user?.year}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin scrollbar-thumb-sidebar-border">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-[10px] text-muted-foreground uppercase tracking-widest px-3 mb-1.5" style={{ fontWeight: 600 }}>
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.to, item.exact);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5 mb-1 rounded-[1.25rem] text-[13px] transition-all duration-300
                      ${active
                        ? "bg-[#5540DE] text-white shadow-lg shadow-[#5540DE]/30 scale-[1.02]"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.02]"
                      }
                    `}
                    style={{ fontWeight: active ? 700 : 500 }}
                  >
                    <item.icon
                      size={16}
                      className={active ? "text-white" : "text-muted-foreground group-hover:text-sidebar-accent-foreground transition-colors"}
                    />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        {/* Theme Toggle */}
        <div className="flex items-center p-1 rounded-[1.25rem] bg-sidebar-accent/50 border border-sidebar-border mb-3">
          <button
            onClick={() => isDark && toggleTheme()}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[1rem] text-[11px] transition-all ${!isDark ? "bg-background shadow-sm text-foreground scale-[1.02]" : "text-muted-foreground hover:text-foreground"
              }`}
            style={{ fontWeight: 600 }}
          >
            <Sun size={12} /> Light
          </button>
          <button
            onClick={() => !isDark && toggleTheme()}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[1rem] text-[11px] transition-all ${isDark ? "bg-background shadow-sm text-foreground scale-[1.02]" : "text-muted-foreground hover:text-foreground"
              }`}
            style={{ fontWeight: 600 }}
          >
            <Moon size={12} /> Dark
          </button>
        </div>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-[1.25rem] bg-sidebar-accent/30 border border-sidebar-border">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[13px] shadow-lg shrink-0" style={{ fontWeight: 800 }}>
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-[13px] text-sidebar-foreground truncate" style={{ fontWeight: 700 }}>{user?.name}</p>
            <p className="text-[10px] text-muted-foreground truncate capitalize">{user?.role} · {user?.rollNo || user?.department?.split(" ")[0]}</p>
          </div>
          {!isAdmin && (
            <NavLink to="/profile" onClick={onClose}
              className="p-2 rounded-xl hover:bg-sidebar-accent text-muted-foreground transition-all hover:scale-110"
              title="My Profile">
              <Users size={15} />
            </NavLink>
          )}
          <button
            onClick={() => { logout(); }}
            className="p-2 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all hover:scale-110"
            title="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}