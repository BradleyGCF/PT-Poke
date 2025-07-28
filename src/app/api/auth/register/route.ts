import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { generatePlaceholderAvatar } from "~/utils/avatar";
import { logger } from "~/utils";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = (await request.json()) as {
      email: string;
      password: string;
      name?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const avatarUrl = generatePlaceholderAvatar(name ?? null, email);

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null,
        image: avatarUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Registration error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
