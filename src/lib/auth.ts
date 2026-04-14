import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextRequest } from "next/server";

// ==================== PASSWORD ====================

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ==================== SESSION ====================

export function generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

export async function getSessionUser(req: NextRequest) {
    const token = req.cookies.get("session_token")?.value;
    if (!token) return null;

    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
        if (session) {
            await prisma.session.delete({ where: { id: session.id } });
        }
        return null;
    }

    return session.user;
}
