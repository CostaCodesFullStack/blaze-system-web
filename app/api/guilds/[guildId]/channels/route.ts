import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAuthorizedDiscordGuild, getGuildChannels } from "@/lib/discord";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ guildId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { guildId } = await params;

    if (!guildId) {
      return NextResponse.json(
        { success: false, error: "guildId é obrigatório" },
        { status: 400 },
      );
    }

    if (!(await getAuthorizedDiscordGuild(session.accessToken, guildId))) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const channels = await getGuildChannels(guildId, session.accessToken);

    return NextResponse.json({ success: true, channels });
  } catch (error) {
    console.error("Erro ao buscar canais:", error);

    return NextResponse.json(
      { success: false, error: "Erro ao buscar canais do servidor" },
      { status: 500 },
    );
  }
}
