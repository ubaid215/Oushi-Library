import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { AdminUserSession } from "@/types";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbSettings = await prisma.siteSetting.findMany();

        // Convert array of KVs to an object map
        const mapped: Record<string, string | number | boolean> = {};
        for (const s of dbSettings) {
            if (s.type === "NUMBER") mapped[s.key] = Number(s.value);
            else if (s.type === "BOOLEAN") mapped[s.key] = s.value === "true";
            else mapped[s.key] = s.value;
        }

        return NextResponse.json(mapped);
    } catch (error) {
        console.error("GET /api/settings error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = session.user as AdminUserSession;
        if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") {
            return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
        }

        const body = await req.json();

        // Map JSON to an array of ops for Prisma transactions
        const updates = Object.entries(body).map(([key, rawValue]) => {
            let type: "STRING" | "NUMBER" | "BOOLEAN" = "STRING";
            let value = String(rawValue);

            if (typeof rawValue === "number") type = "NUMBER";
            else if (typeof rawValue === "boolean") type = "BOOLEAN";

            return prisma.siteSetting.upsert({
                where: { key },
                update: { value, type },
                create: { key, value, type, group: "general" },
            });
        });

        await prisma.$transaction(updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/settings error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
