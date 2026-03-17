// ─── Types ────────────────────────────────────────────────────────────────────
export interface Drive {
    id: number; company: string; color: string; date: string;
    ctc: string; minCGPA: number; branches: string[]; roles: string[];
    rounds: string[]; deadline: string; registeredCount: number;
}
export interface PlacedStudent {
    id: number; name: string; rollNo: string; dept: string;
    company: string; companyColor: string; package: number; role: string; year: number; photo: string;
}
export interface Company {
    id: number; name: string; initials: string; color: string;
    sector: string; ctcRange: string; hired: number; status: "partner" | "upcoming"; visitDate?: string; desc: string;
}
export interface ShortlistedStudent {
    id: number; name: string; rollNo: string; dept: string;
    company: string; round: string; status: "shortlisted" | "selected" | "rejected";
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
export const SEED_PLACED: PlacedStudent[] = [
    { id: 1, name: "Arun Kumar S", rollNo: "20CS001", dept: "CSE", company: "Google", companyColor: "#EA4335", package: 32, role: "Software Engineer L3", year: 2024, photo: "https://images.unsplash.com/photo-1727875075949-8b36efd25260?w=300&fit=crop" },
    { id: 2, name: "Priya Sharma", rollNo: "20IT012", dept: "IT", company: "Microsoft", companyColor: "#00A4EF", package: 28, role: "SDE-2", year: 2024, photo: "https://images.unsplash.com/photo-1649928090866-de76493db1b8?w=300&fit=crop" },
    { id: 3, name: "Karthik Raja", rollNo: "20CS045", dept: "CSE", company: "Amazon", companyColor: "#FF9900", package: 25, role: "SDE-1", year: 2024, photo: "https://images.unsplash.com/photo-1588674845784-9d0c32777b3a?w=300&fit=crop" },
    { id: 4, name: "Divya Nair", rollNo: "20ECE023", dept: "ECE", company: "Zoho", companyColor: "#E64626", package: 18, role: "Software Developer", year: 2024, photo: "https://images.unsplash.com/photo-1684125483810-b4c196bc9162?w=300&fit=crop" },
    { id: 5, name: "Suresh Patel", rollNo: "20EEE011", dept: "EEE", company: "Infosys SP", companyColor: "#007CC3", package: 15, role: "Systems Engineer", year: 2024, photo: "https://images.unsplash.com/photo-1770235622059-f544451fbe94?w=300&fit=crop" },
    { id: 6, name: "Meena Velu", rollNo: "20MECH031", dept: "MECH", company: "L&T Technology", companyColor: "#005F8E", package: 13, role: "Design Engineer", year: 2024, photo: "https://images.unsplash.com/photo-1659080925666-16001612bc3e?w=300&fit=crop" },
];
export const SEED_COMPANIES: Company[] = [
    { id: 1, name: "TCS", initials: "TCS", color: "#1e3a8a", sector: "IT Services", ctcRange: "7–12 LPA", hired: 145, status: "partner", desc: "Premier IT partner for over a decade." },
    { id: 2, name: "Infosys", initials: "INF", color: "#0d9488", sector: "IT Services", ctcRange: "6.5–14 LPA", hired: 112, status: "partner", desc: "Global leader in digital services." },
    { id: 3, name: "Zoho", initials: "ZHO", color: "#DC2626", sector: "SaaS Product", ctcRange: "8–20 LPA", hired: 67, status: "partner", desc: "World's most complete business software suite." },
    { id: 4, name: "Amazon", initials: "AMZ", color: "#D97706", sector: "E-Commerce / Cloud", ctcRange: "18–35 LPA", hired: 28, status: "partner", desc: "World's largest e-commerce & cloud giant." },
    { id: 5, name: "Microsoft", initials: "MSF", color: "#16A34A", sector: "Software Product", ctcRange: "20–40 LPA", hired: 15, status: "partner", desc: "Empowering every person on the planet." },
    { id: 6, name: "Wipro", initials: "WIP", color: "#7C3AED", sector: "IT Services", ctcRange: "6.5–12 LPA", hired: 89, status: "partner", desc: "Technology services & consulting." },
    { id: 7, name: "Capgemini", initials: "CAP", color: "#0F766E", sector: "IT Services", ctcRange: "6.5–12 LPA", hired: 60, status: "partner", desc: "Global consulting & digital transformation." },
    { id: 8, name: "Accenture", initials: "ACC", color: "#A21CAF", sector: "Consulting", ctcRange: "7–15 LPA", hired: 102, status: "partner", desc: "Digital, cloud & security services." },
    { id: 9, name: "Google", initials: "GGL", color: "#EA4335", sector: "Technology", ctcRange: "25–50 LPA", hired: 8, status: "upcoming", visitDate: "Mar 25, 2026", desc: "World's leading technology company." },
    { id: 10, name: "HCL Tech", initials: "HCL", color: "#0891B2", sector: "IT Services", ctcRange: "6–11 LPA", hired: 78, status: "partner", desc: "Leading global tech company." },
];
export const SEED_DRIVES: Drive[] = [
    { id: 1, company: "Zoho Corporation", color: "#DC2626", date: "March 5, 2026", ctc: "10–22 LPA", minCGPA: 7.5, branches: ["CSE", "IT", "ECE"], roles: ["Software Developer", "Product Manager"], rounds: ["Online Test", "Technical Interview", "HR"], deadline: "Feb 28, 2026", registeredCount: 124 },
    { id: 2, company: "TCS Digital", color: "#1e3a8a", date: "March 12, 2026", ctc: "7–12 LPA", minCGPA: 6.5, branches: ["CSE", "IT", "ECE", "EEE", "MECH"], roles: ["System Engineer", "Digital Associate"], rounds: ["TCS NQT", "Technical Round", "HR Round"], deadline: "Mar 8, 2026", registeredCount: 287 },
    { id: 3, company: "Infosys", color: "#0d9488", date: "March 20, 2026", ctc: "6.5–14 LPA", minCGPA: 7.0, branches: ["CSE", "IT", "ECE", "EEE"], roles: ["Systems Engineer", "Technology Analyst"], rounds: ["InfyTQ Test", "Technical Interview", "HR"], deadline: "Mar 15, 2026", registeredCount: 198 },
];
export const SEED_SHORTLISTED: ShortlistedStudent[] = [
    { id: 1, name: "Vishal S", rollNo: "21CS001", dept: "CSE", company: "Zoho", round: "Technical Interview", status: "shortlisted" },
    { id: 2, name: "Rahul D", rollNo: "21CSE088", dept: "CSE", company: "Amazon", round: "Offer", status: "selected" },
    { id: 3, name: "Sneha P", rollNo: "21EC022", dept: "ECE", company: "TCS Digital", round: "HR Round", status: "shortlisted" },
    { id: 4, name: "Arjun M", rollNo: "22IT023", dept: "IT", company: "Infosys", round: "Online Test", status: "rejected" },
];
export const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "MBA", "MCA"];
export const ALL_BRANCHES = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "MBA", "MCA"];
export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG 1st Year", "PG 2nd Year"];
