import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { requireActivePlan } from "@/lib/plan";
import { prisma } from "@/lib/prisma";

const botConfigSchema = z.object({
  guildId: z.string().min(1),
  botType: z.enum(["torcida", "fivem_server", "fivem_faccao"]),
  botToken: z.string().min(50),
  botClientId: z.string().min(1),
  botName: z.string().min(1).optional(),
  botAvatar: z.string().url().optional(),
  systems: z.array(z.string()).default([]),
  welcomeChannelId: z.string().min(1).optional(),
  logChannelId: z.string().min(1).optional(),
  autoRoleId: z.string().min(1).optional(),
  embedColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  embedText: z.string().max(500).optional(),
  embedBanner: z.string().url().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = botConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await requireActivePlan(session.user.id);

  const data = parsed.data;
  const config = await prisma.botConfig.upsert({
    where: {
      userId_guildId: { userId: session.user.id, guildId: data.guildId },
    },
    create: {
      userId: session.user.id,
      guildId: data.guildId,
      botType: data.botType,
      botToken: data.botToken,
      botClientId: data.botClientId,
      botName: data.botName,
      botAvatar: data.botAvatar,
      systems: data.systems,
      welcomeChannelId: data.welcomeChannelId,
      logChannelId: data.logChannelId,
      autoRoleId: data.autoRoleId,
      embedColor: data.embedColor,
      embedText: data.embedText,
      embedBanner: data.embedBanner,
    },
    update: {
      botType: data.botType,
      botToken: data.botToken,
      botClientId: data.botClientId,
      botName: data.botName,
      botAvatar: data.botAvatar,
      systems: data.systems,
      welcomeChannelId: data.welcomeChannelId,
      logChannelId: data.logChannelId,
      autoRoleId: data.autoRoleId,
      embedColor: data.embedColor,
      embedText: data.embedText,
      embedBanner: data.embedBanner,
    },
  });

  return NextResponse.json({ config });
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId") ?? "";
  if (!guildId) {
    return NextResponse.json({ error: "Missing guildId" }, { status: 400 });
  }

  const config = await prisma.botConfig.findUnique({
    where: { userId_guildId: { userId: session.user.id, guildId } },
  });

  return NextResponse.json({ config });
}
