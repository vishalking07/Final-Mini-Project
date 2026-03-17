"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
// Login Route
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, password, role } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: 'Missing credentials' });
        }
        const user = yield prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { rollNo: identifier.toUpperCase() }
                ]
            }
        });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
        }
        if (user.role !== role) {
            return res.status(401).json({ success: false, message: 'Role mismatch.' });
        }
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        // Don't send password back to client
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.json({
            success: true,
            message: `Welcome, ${user.name}!`,
            token,
            user: userWithoutPassword
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}));
// Seed Initial Admin and Students (For demonstration, usually done via a seed script)
router.post('/seed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield prisma.user.count();
        if (count > 0) {
            return res.json({ message: 'Database already seeded' });
        }
        const adminHash = yield bcrypt_1.default.hash('Admin@123', 10);
        const studentHash = yield bcrypt_1.default.hash('Student@123', 10);
        yield prisma.user.create({
            data: {
                name: 'Dr. C Palanisamy',
                role: 'admin',
                email: 'admin@bitsathy.ac.in',
                password: adminHash,
                department: "Principal's Office",
                phone: '+91-4295-226001',
            }
        });
        const students = [
            { name: "Vishal S", role: "student", email: "21cs001@bitsathy.ac.in", rollNo: "21CS001", department: "Computer Science & Engineering", year: "3rd Year", section: "A", phone: "+91 98765 43210", dob: new Date("2003-06-15"), bloodGroup: "O+", address: "Erode, Tamil Nadu" },
            { name: "Priya K", role: "student", email: "21ec045@bitsathy.ac.in", rollNo: "21EC045", department: "Electronics & Communication Engineering", year: "3rd Year", section: "B", phone: "+91 87654 32109", dob: new Date("2003-09-22"), bloodGroup: "A+", address: "Coimbatore, Tamil Nadu" },
            { name: "Arjun M", role: "student", email: "22it023@bitsathy.ac.in", rollNo: "22IT023", department: "Information Technology", year: "2nd Year", section: "A", phone: "+91 76543 21098", dob: new Date("2004-03-10"), bloodGroup: "B+", address: "Salem, Tamil Nadu" },
        ];
        for (const s of students) {
            yield prisma.user.create({
                data: Object.assign(Object.assign({}, s), { password: studentHash, role: 'student' })
            });
        }
        res.json({ success: true, message: 'Seeded successfully' });
    }
    catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ success: false, message: 'Seed failed' });
    }
}));
exports.default = router;
