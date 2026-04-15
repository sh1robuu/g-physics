"use client";

import { createContext, useContext, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Session = typeof authClient.$Infer.Session;

interface AuthContextType {
    user: Session["user"] | null;
    session: Session["session"] | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: sessionData, isPending } = authClient.useSession();
    const router = useRouter();

    const login = async (email: string, password: string) => {
        const { error } = await authClient.signIn.email({
            email,
            password,
        });
        if (error) return { error: error.message || "Đã xảy ra lỗi" };
        router.push("/dashboard");
        return {};
    };

    const signup = async (name: string, email: string, password: string) => {
        const { error } = await authClient.signUp.email({
            email,
            password,
            name,
        });
        if (error) return { error: error.message || "Đã xảy ra lỗi" };
        router.push("/dashboard");
        return {};
    };

    const logout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => router.push("/"),
            },
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user: sessionData?.user ?? null,
                session: sessionData?.session ?? null,
                isLoading: isPending,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
