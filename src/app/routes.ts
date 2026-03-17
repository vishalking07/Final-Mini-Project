import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { LoginPage } from "./components/LoginPage";
import { DashboardPage } from "./components/DashboardPage";
import { AdminDashboardPage } from "./components/AdminDashboardPage";
import { AdminStudentsPage } from "./components/AdminStudentsPage";
import { AdminSettingsPage } from "./components/AdminSettingsPage";
import { AdminSchedulePage } from "./components/AdminSchedulePage";
import { AboutPage } from "./components/AboutPage";
import { RulesPage } from "./components/RulesPage";
import { FacilitiesPage } from "./components/FacilitiesPage";
import { DepartmentsPage } from "./components/DepartmentsPage";
import { FacultiesPage } from "./components/FacultiesPage";
import { DocumentsPage } from "./components/DocumentsPage";
import { SupportPage } from "./components/SupportPage";
import { StudentProfilePage } from "./components/StudentProfilePage";
import { PlacementsPage } from "./components/PlacementsPage";
import { ExamTimetablePage } from "./components/ExamTimetablePage";
import { EventsClubsPage } from "./components/EventsClubsPage";
import { AchievementsPage } from "./components/AchievementsPage";
import { HostelPage } from "./components/HostelPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        Component: Layout,
        children: [
          // ── Root: role-aware dashboard ──
          { index: true, Component: DashboardPage },

          // ── Admin-only routes ──
          {
            path: "admin",
            Component: AdminRoute,
            children: [
              { path: "students", Component: AdminStudentsPage },
              { path: "settings", Component: AdminSettingsPage },
              { path: "schedule", Component: AdminSchedulePage },
              // Admin also has its own dashboard entry point
              { index: true, Component: AdminDashboardPage },
            ],
          },

          // ── About section (shared — admin can browse too) ──
          {
            path: "about",
            children: [
              { index: true, Component: AboutPage },
              { path: "rules", Component: RulesPage },
              { path: "facilities", Component: FacilitiesPage },
              { path: "departments", Component: DepartmentsPage },
              { path: "faculties", Component: FacultiesPage },
            ],
          },

          // ── Campus Life (shared) ──
          {
            path: "campus",
            children: [
              { index: true, Component: EventsClubsPage },
              { path: "achievements", Component: AchievementsPage },
              { path: "hostel", Component: HostelPage },
            ],
          },

          // ── Academic & Career (shared) ──
          { path: "timetable", Component: ExamTimetablePage },
          { path: "placements", Component: PlacementsPage },

          // ── Resources ──
          { path: "documents", Component: DocumentsPage },
          { path: "support", Component: SupportPage },

          // ── Student-only ──
          { path: "profile", Component: StudentProfilePage },
        ],
      },
    ],
  },
]);
