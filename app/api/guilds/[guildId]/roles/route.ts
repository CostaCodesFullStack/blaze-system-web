import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAuthorizedDiscordGuild, getGuildRoles } from "@/lib/discord";
import { requireActivePlan } from "@/lib/plan";

export async function GET(
  request: Request,
  context: { params: Promise<unknown> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const activePlan = await requireActivePlan(session.user.id);
    if (!activePlan.ok) {
      return activePlan.response;
    }

    const { guildId } = (await context.params) as { guildId: string };

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

    const roles = await getGuildRoles(guildId, session.accessToken);

    return NextResponse.json({ success: true, roles });
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);

    return NextResponse.json(
      { success: false, error: "Erro ao buscar cargos do servidor" },
      { status: 500 },
    );
  }
}
