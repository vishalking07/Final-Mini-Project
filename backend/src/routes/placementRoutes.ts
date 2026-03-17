import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const router = express.Router();

// --- DRIVES ---
router.get('/drives', authenticateToken, async (req: Request, res: Response) => {
    try {
        const drives = await prisma.drive.findMany();
        const formattedDrives = drives.map(d => ({
            ...d,
            branches: d.branches ? JSON.parse(d.branches) : [],
            roles: d.roles ? JSON.parse(d.roles) : [],
            rounds: d.rounds ? JSON.parse(d.rounds) : []
        }));
        res.json({ success: true, data: formattedDrives });
    } catch (error) {
        console.error("Fetch drives error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/drives', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const { branches, roles, rounds, ...rest } = req.body;
        const newDrive = await prisma.drive.create({
            data: {
                ...rest,
                branches: JSON.stringify(branches || []),
                roles: JSON.stringify(roles || []),
                rounds: JSON.stringify(rounds || [])
            }
        });
        res.json({ success: true, data: { ...newDrive, branches, roles, rounds } });
    } catch (error) {
        console.error("Create drive error:", error);
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
});

router.put('/drives/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const { branches, roles, rounds, ...rest } = req.body;
        const updated = await prisma.drive.update({
            where: { id },
            data: {
                ...rest,
                branches: JSON.stringify(branches || []),
                roles: JSON.stringify(roles || []),
                rounds: JSON.stringify(rounds || [])
            }
        });
        res.json({ success: true, data: { ...updated, branches, roles, rounds } });
    } catch (error) {
        console.error("Update drive error:", error);
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

router.delete('/drives/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        await prisma.drive.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

// --- PLACED STUDENTS ---
router.get('/placed', authenticateToken, async (req: Request, res: Response) => {
    try {
        const placed = await prisma.placedStudent.findMany();
        res.json({ success: true, data: placed });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/placed', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const newPlaced = await prisma.placedStudent.create({ data: req.body });
        res.json({ success: true, data: newPlaced });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
});

router.put('/placed/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const updated = await prisma.placedStudent.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

router.delete('/placed/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        await prisma.placedStudent.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

// --- COMPANIES ---
router.get('/companies', authenticateToken, async (req: Request, res: Response) => {
    try {
        const companies = await prisma.company.findMany();
        res.json({ success: true, data: companies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/companies', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const newCompany = await prisma.company.create({ data: req.body });
        res.json({ success: true, data: newCompany });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
});

router.put('/companies/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const updated = await prisma.company.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

router.delete('/companies/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        await prisma.company.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

// --- SHORTLISTED ---
router.get('/shortlisted', authenticateToken, async (req: Request, res: Response) => {
    try {
        const shortlisted = await prisma.shortlistedStudent.findMany();
        res.json({ success: true, data: shortlisted });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/shortlisted', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const newShortlist = await prisma.shortlistedStudent.create({ data: req.body });
        res.json({ success: true, data: newShortlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
});

router.put('/shortlisted/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const updated = await prisma.shortlistedStudent.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

router.delete('/shortlisted/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        await prisma.shortlistedStudent.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

export default router;
