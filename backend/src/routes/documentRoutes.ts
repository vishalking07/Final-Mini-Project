import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/requests', authenticateToken, async (req: Request, res: Response) => {
    try {
        const requests = await prisma.docRequest.findMany();
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/requests', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const docReq = await prisma.docRequest.create({ data: req.body });
        res.json({ success: true, data: docReq });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/requests/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        await prisma.docRequest.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/submissions', authenticateToken, async (req: Request, res: Response) => {
    try {
        const subs = await prisma.documentSubmission.findMany();
        res.json({ success: true, data: subs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/submissions', authenticateToken, async (req: Request, res: Response) => {
    try {
        const docSub = await prisma.documentSubmission.create({ data: req.body });
        res.json({ success: true, data: docSub });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/submissions/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const docSub = await prisma.documentSubmission.update({ where: { id }, data: req.body });
        res.json({ success: true, data: docSub });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/submissions/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        await prisma.documentSubmission.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
