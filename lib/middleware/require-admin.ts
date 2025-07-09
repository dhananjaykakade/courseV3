// lib/middleware/require-admin.ts
import { verifyToken } from "@/lib/utils/jwt"
import type { NextApiRequest, NextApiResponse, } from "next"
// import supabase for database operations
import { supabaseDb } from "@/lib/services/supabase-database"
interface User {
    id: string;
    role: string;
    [key: string]: any;
}

interface AuthenticatedRequest extends NextApiRequest {
    user?: User;
}

type NextFunction = (user?: User) => void;

export async function requireAdmin(
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: NextFunction
): Promise<void> {
    try {
        const token: string | undefined = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

        const decoded = verifyToken(token) as { id?: string; [key: string]: any };
        if (!decoded || typeof decoded.id !== "string") {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user: User | null = await supabaseDb.getUserById(decoded.id);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        req.user = user;
        return next(user);
    } catch (err) {
        console.error("Admin auth error:", err);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}
