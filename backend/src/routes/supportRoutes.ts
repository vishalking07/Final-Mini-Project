import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/tickets', authenticateToken, async (req: Request, res: Response) => {
    try {
        const tickets = await prisma.supportTicket.findMany();
        res.json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/tickets', authenticateToken, async (req: Request, res: Response) => {
    try {
        const ticket = await prisma.supportTicket.create({ data: req.body });
        res.json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/tickets/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const ticket = await prisma.supportTicket.update({ where: { id }, data: req.body });
        res.json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
