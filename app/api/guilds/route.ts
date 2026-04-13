import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getAdminDiscordGuilds } from "@/lib/discord";
import { requireActivePlan } from "@/lib/plan";

export async function GET() {
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

    const guilds = await getAdminDiscordGuilds(session.accessToken);

    return NextResponse.json({ success: true, guilds });
  } catch (error) {
    console.error("Erro ao buscar servidores do Discord:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno ao buscar servidores do Discord.",
      },
      { status: 500 },
    );
  }
}
