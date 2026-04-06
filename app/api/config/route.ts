import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { z } from "zod";

import { auth } from "@/auth";
import { getAdminDiscordGuilds } from "@/lib/discord";
import { connectDB } from "@/lib/mongodb";
import { Config } from "@/models/Config";

const ConfigPayloadSchema = z.object({
  guildId: z.string().min(1, "guildId é obrigatório"),
  bot: z.string().min(1, "bot é obrigatório"),
  systems: z.array(z.string()).default([]),
  role: z.string().min(1, "role é obrigatório"),
  channel: z.string().min(1, "channel é obrigatório"),
});

const ConfigUpdateSchema = z
  .object({
    guildId: z.string().min(1, "guildId é obrigatório"),
    bot: z.string().min(1, "bot é obrigatório").optional(),
    systems: z.array(z.string()).optional(),
    role: z.string().min(1, "role é obrigatório").optional(),
    channel: z.string().min(1, "channel é obrigatório").optional(),
  })
  .strict();

type ConfigPayload = z.infer<typeof ConfigPayloadSchema>;
type ConfigUpdateData = z.infer<typeof ConfigUpdateSchema>;

async function getAuthenticatedSession(): Promise<Session | NextResponse> {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  return session;
}

function getSessionUserId(session: Session) {
  return session?.user?.id;
}

async function getAuthorizedGuildIds(
  session: Session,
): Promise<Set<string> | NextResponse> {
  if (!session.accessToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const guilds = await getAdminDiscordGuilds(session.accessToken);

  return new Set(guilds.map((guild) => guild.id));
}

function getForbiddenResponse() {
  return NextResponse.json(
    { success: false, error: "Forbidden" },
    { status: 403 },
  );
}

export async function POST(request: Request) {
  try {
    const session = await getAuthenticatedSession();

    if (session instanceof NextResponse) {
      return session;
    }

    const userId = getSessionUserId(session);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    let payload: ConfigPayload;
    try {
      payload = ConfigPayloadSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { success: false, error: error.errors[0].message },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { success: false, error: "Corpo da requisição inválido." },
        { status: 400 },
      );
    }

    const authorizedGuildIds = await getAuthorizedGuildIds(session);

    if (authorizedGuildIds instanceof NextResponse) {
      return authorizedGuildIds;
    }

    if (!authorizedGuildIds.has(payload.guildId)) {
      return getForbiddenResponse();
    }

    await connectDB();

    const updateData = {
      bot: payload.bot,
      systems: payload.systems,
      role: payload.role,
      channel: payload.channel,
    };

    const config = await Config.findOneAndUpdate(
      { userId, guildId: payload.guildId },
      {
        $set: updateData,
        $setOnInsert: {
          userId,
          guildId: payload.guildId,
        },
      },
      {
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    ).exec();

    return NextResponse.json({
      success: true,
      config,
      message: "Configuracao salva com sucesso",
    });
  } catch (error) {
    console.error("Erro ao salvar configuracao:", error);

    return NextResponse.json(
      { success: false, error: "Erro interno ao salvar a configuracao." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAuthenticatedSession();

    if (session instanceof NextResponse) {
      return session;
    }

    const userId = getSessionUserId(session);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    let payload: ConfigUpdateData;
    try {
      payload = ConfigUpdateSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { success: false, error: error.errors[0].message },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { success: false, error: "Corpo da requisição inválido." },
        { status: 400 },
      );
    }

    const authorizedGuildIds = await getAuthorizedGuildIds(session);

    if (authorizedGuildIds instanceof NextResponse) {
      return authorizedGuildIds;
    }

    const { guildId, ...updateData } = payload;

    if (!authorizedGuildIds.has(guildId)) {
      return getForbiddenResponse();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Nenhum campo válido foi enviado para atualizar.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const config = await Config.findOneAndUpdate(
      { userId, guildId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    ).exec();

    if (!config) {
      return NextResponse.json(
        { success: false, error: "Configuracao nao encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      config,
      message: "Configuracao atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar configuracao:", error);

    return NextResponse.json(
      { success: false, error: "Erro interno ao atualizar a configuracao." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getAuthenticatedSession();

    if (session instanceof NextResponse) {
      return session;
    }

    const userId = getSessionUserId(session);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const guildId = searchParams.get("guildId");

    const authorizedGuildIds = await getAuthorizedGuildIds(session);

    if (authorizedGuildIds instanceof NextResponse) {
      return authorizedGuildIds;
    }

    if (guildId) {
      if (!authorizedGuildIds.has(guildId)) {
        return getForbiddenResponse();
      }

      await connectDB();

      const config = await Config.findOne({ userId, guildId }).lean().exec();

      if (!config) {
        return NextResponse.json(
          { success: true, config: null },
          { status: 200 },
        );
      }

      return NextResponse.json({ success: true, config });
    }

    const guildIds = [...authorizedGuildIds];

    if (guildIds.length === 0) {
      return NextResponse.json({ success: true, configs: [] });
    }

    await connectDB();

    const configs = await Config.find({
      userId,
      guildId: { $in: guildIds },
    })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({ success: true, configs });
  } catch (error) {
    console.error("Erro ao buscar configuracoes:", error);

    return NextResponse.json(
      { success: false, error: "Erro interno ao buscar configuracoes." },
      { status: 500 },
    );
  }
}
