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
// --- DRIVES ---
router.get('/drives', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drives = yield prisma.drive.findMany();
        res.json({ success: true, data: drives });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
router.post('/drives', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDrive = yield prisma.drive.create({ data: req.body });
        res.json({ success: true, data: newDrive });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
}));
router.put('/drives/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const updated = yield prisma.drive.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
}));
router.delete('/drives/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield prisma.drive.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
}));
// --- PLACED STUDENTS ---
router.get('/placed', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const placed = yield prisma.placedStudent.findMany();
        res.json({ success: true, data: placed });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
router.post('/placed', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPlaced = yield prisma.placedStudent.create({ data: req.body });
        res.json({ success: true, data: newPlaced });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
}));
router.put('/placed/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const updated = yield prisma.placedStudent.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
}));
router.delete('/placed/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield prisma.placedStudent.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
}));
// --- COMPANIES ---
router.get('/companies', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companies = yield prisma.company.findMany();
        res.json({ success: true, data: companies });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
router.post('/companies', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCompany = yield prisma.company.create({ data: req.body });
        res.json({ success: true, data: newCompany });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
}));
router.put('/companies/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const updated = yield prisma.company.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
}));
router.delete('/companies/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield prisma.company.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
}));
// --- SHORTLISTED ---
router.get('/shortlisted', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortlisted = yield prisma.shortlistedStudent.findMany();
        res.json({ success: true, data: shortlisted });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
router.post('/shortlisted', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newShortlist = yield prisma.shortlistedStudent.create({ data: req.body });
        res.json({ success: true, data: newShortlist });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
}));
router.put('/shortlisted/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const updated = yield prisma.shortlistedStudent.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
}));
router.delete('/shortlisted/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield prisma.shortlistedStudent.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
}));
exports.default = router;
