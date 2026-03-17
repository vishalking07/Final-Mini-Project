import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient();
const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Login Route
router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const { identifier, password, role } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: 'Missing credentials' });
        }

        const user = await prisma.user.findFirst({
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

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: `Welcome, ${user.name}!`,
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Google SSO Login Route
router.post('/login/google', async (req: Request, res: Response): Promise<any> => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ success: false, message: 'Missing Google credential' });
        }

        // Verify the token with Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(401).json({ success: false, message: 'Invalid google token payload' });
        }

        const email = payload.email.toLowerCase();
        // Optional domain check:
        // if (!email.endsWith('@bitsathy.ac.in')) {
        //     return res.status(403).json({ success: false, message: 'Please use your bitsathy.ac.in email address.' });
        // }

        let user = await prisma.user.findFirst({
            where: { email }
        });

        // If the user doesn't exist, create an account for them automatically
        if (!user) {
            // Extract Roll No from standard student email format (e.g. 21cs001@bitsathy.ac.in)
            let parsedRollNo = "";
            let role = "student";

            const emailPrefix = email.split("@")[0];
            if (/\d{2}[a-z]{2}\d{3}/i.test(emailPrefix)) {
                parsedRollNo = emailPrefix.toUpperCase();
            } else {
                role = "student"; // Defaulting to student, or can be adjusted based on needs
            }

            user = await prisma.user.create({
                data: {
                    name: payload.name || "Student",
                    email,
                    role: role as Role,
                    rollNo: parsedRollNo || undefined,
                    password: await bcrypt.hash(Math.random().toString(36), 10), // Random password since SSO manages auth
                }
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: `Welcome via Google, ${user.name}!`,
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ success: false, message: 'Google Authentication failed' });
    }
});

// Seed Initial Admin and Students (For demonstration, usually done via a seed script)
router.post('/seed', async (req: Request, res: Response) => {
    try {
        const count = await prisma.user.count();
        if (count > 0) {
            return res.json({ message: 'Database already seeded' });
        }

        const adminHash = await bcrypt.hash('Admin@123', 10);
        const studentHash = await bcrypt.hash('Student@123', 10);

        await prisma.user.create({
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
            await prisma.user.create({
                data: {
                    ...s,
                    password: studentHash,
                    role: 'student'
                }
            })
        }

        res.json({ success: true, message: 'Seeded successfully' });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ success: false, message: 'Seed failed' });
    }
});

export default router;
