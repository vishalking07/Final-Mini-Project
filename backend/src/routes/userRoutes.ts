import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const router = express.Router();

// Get Current User Profile
router.get('/me', authenticateToken, async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
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
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin: Get all students
router.get('/students', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: 'student' },
            select: {
                id: true, name: true, email: true, rollNo: true,
                department: true, year: true, section: true, phone: true,
                dob: true, bloodGroup: true, address: true
            }
        });
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin: Create student
router.post('/students', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const { name, email, rollNo, department, year, section, phone, dob, bloodGroup, address } = req.body;
        // Default password for new students
        const bcrypt = require('bcrypt');
        const passwordHash = await bcrypt.hash('Student@123', 10);

        const newStudent = await prisma.user.create({
            data: {
                name, email, rollNo, department, year, section, phone,
                dob: dob ? new Date(dob) : null,
                bloodGroup, address,
                password: passwordHash,
                role: 'student'
            },
            select: {
                id: true, name: true, email: true, rollNo: true,
                department: true, year: true, section: true, phone: true,
                dob: true, bloodGroup: true, address: true
            }
        });

        res.json({ success: true, data: newStudent });
    } catch (error) {
        console.error("Create Student Error:", error);
        res.status(500).json({ success: false, message: 'Failed to create student.' });
    }
});

// Admin: Update student
router.put('/students/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, email, rollNo, department, year, section, phone, dob, bloodGroup, address } = req.body;

        const updated = await prisma.user.update({
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
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

// Admin: Delete student
router.delete('/students/:id', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.user.delete({ where: { id } });
        res.json({ success: true, message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

export default router;
