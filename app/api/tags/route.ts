import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/utils";

export async function GET() {
  const tags = await prisma.tag.findMany({ orderBy: { count: "desc" } });
  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, slug } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const finalSlug = slug || createSlug(name);

  const existing = await prisma.tag.findUnique({ where: { slug: finalSlug } });
  if (existing) return NextResponse.json({ error: "Tag already exists" }, { status: 409 });

  const tag = await prisma.tag.create({ data: { name, slug: finalSlug } });
  return NextResponse.json(tag, { status: 201 });
}
