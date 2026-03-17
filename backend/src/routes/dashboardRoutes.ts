import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const router = express.Router();

// --- EVENTS ---
router.get('/events', authenticateToken, async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany();
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/events', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const newEvent = await prisma.event.create({ data: req.body });
        res.json({ success: true, data: newEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
});

router.put('/events/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const updated = await prisma.event.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

router.delete('/events/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        await prisma.event.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

// --- ANNOUNCEMENTS ---
router.get('/announcements', authenticateToken, async (req: Request, res: Response) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { id: 'desc' }
        });
        res.json({ success: true, data: announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/announcements', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const newAnnouncement = await prisma.announcement.create({ data: req.body });
        res.json({ success: true, data: newAnnouncement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
});

router.put('/announcements/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const updated = await prisma.announcement.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

router.delete('/announcements/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        await prisma.announcement.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

export default router;
