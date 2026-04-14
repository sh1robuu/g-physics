import { prisma } from "@/lib/db";
import { verifyPassword, generateToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Vui lòng nhập email và mật khẩu" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return NextResponse.json(
                { error: "Email hoặc mật khẩu không đúng" },
                { status: 401 }
            );
        }

        const valid = await verifyPassword(password, user.password);
        if (!valid) {
            return NextResponse.json(
                { error: "Email hoặc mật khẩu không đúng" },
                { status: 401 }
            );
        }

        // Create session
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await prisma.session.create({
            data: { userId: user.id, token, expiresAt },
        });

        const response = NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });

        response.cookies.set("session_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: expiresAt,
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Đã xảy ra lỗi, vui lòng thử lại" },
            { status: 500 }
        );
    }
}
