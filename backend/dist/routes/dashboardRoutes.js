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
// --- EVENTS ---
router.get('/events', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany();
        res.json({ success: true, data: events });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
router.post('/events', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEvent = yield prisma.event.create({ data: req.body });
        res.json({ success: true, data: newEvent });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
}));
router.put('/events/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const updated = yield prisma.event.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
}));
router.delete('/events/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield prisma.event.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
}));
// --- ANNOUNCEMENTS ---
router.get('/announcements', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const announcements = yield prisma.announcement.findMany({
            orderBy: { id: 'desc' }
        });
        res.json({ success: true, data: announcements });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
router.post('/announcements', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAnnouncement = yield prisma.announcement.create({ data: req.body });
        res.json({ success: true, data: newAnnouncement });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
}));
router.put('/announcements/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const updated = yield prisma.announcement.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
}));
router.delete('/announcements/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield prisma.announcement.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
}));
exports.default = router;
