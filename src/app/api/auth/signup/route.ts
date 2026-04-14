import { prisma } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        // Validate
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Vui lòng điền đầy đủ thông tin" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Mật khẩu phải có ít nhất 8 ký tự" },
                { status: 400 }
            );
        }

        // Check existing user
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json(
                { error: "Email đã được sử dụng" },
                { status: 409 }
            );
        }

        // Create user
        const hashed = await hashPassword(password);
        const user = await prisma.user.create({
            data: { name, email, password: hashed },
        });

        // Create session
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await prisma.session.create({
            data: { userId: user.id, token, expiresAt },
        });

        const response = NextResponse.json(
            { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
            { status: 201 }
        );

        response.cookies.set("session_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: expiresAt,
        });

        return response;
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Đã xảy ra lỗi, vui lòng thử lại" },
            { status: 500 }
        );
    }
}
