import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";

const validateSchema = z.object({
  botToken: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = validateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    const res = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bot ${parsed.data.botToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    const bot = (await res.json()) as { id: string; username: string; avatar: string | null };

    return NextResponse.json({
      valid: true,
      botId: bot.id,
      botUsername: bot.username,
      botAvatar: bot.avatar
        ? `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png`
        : null,
    });
  } catch {
    return NextResponse.json({ valid: false }, { status: 200 });
  }
}

