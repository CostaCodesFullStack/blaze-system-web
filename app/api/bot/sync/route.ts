import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${process.env.BOT_API_SECRET ?? ""}`;

  if (!process.env.BOT_API_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const configs = await prisma.botConfig.findMany({
    where: { isActive: true },
    select: {
      id: true,
      guildId: true,
      botType: true,
      botToken: true,
      botClientId: true,
      botName: true,
      botAvatar: true,
      systems: true,
      welcomeChannelId: true,
      logChannelId: true,
      autoRoleId: true,
      embedColor: true,
      embedText: true,
      embedBanner: true,
    },
  });

  return NextResponse.json({ configs });
}

