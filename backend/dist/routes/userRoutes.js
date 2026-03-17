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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Get Current User Profile
router.get('/me', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true, name: true, email: true, role: true, rollNo: true,
                department: true, year: true, section: true, phone: true,
                dob: true, bloodGroup: true, address: true, createdAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
// Admin: Get all students
router.get('/students', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield prisma.user.findMany({
            where: { role: 'student' },
            select: {
                id: true, name: true, email: true, rollNo: true,
                department: true, year: true, section: true, phone: true,
                dob: true, bloodGroup: true, address: true
            }
        });
        res.json({ success: true, data: students });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
// Admin: Update student
router.put('/students/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { name, email, rollNo, department, year, section, phone, dob, bloodGroup, address } = req.body;
        const updated = yield prisma.user.update({
            where: { id },
            data: {
                name, email, rollNo, department, year, section, phone,
                dob: dob ? new Date(dob) : null,
                bloodGroup, address
            },
            select: {
                id: true, name: true, email: true, rollNo: true,
                department: true, year: true, section: true, phone: true,
                dob: true, bloodGroup: true, address: true
            }
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
}));
// Admin: Delete student
router.delete('/students/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield prisma.user.delete({ where: { id } });
        res.json({ success: true, message: 'Student deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
}));
exports.default = router;
