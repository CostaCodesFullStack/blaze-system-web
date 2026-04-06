import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getAdminDiscordGuilds } from "@/lib/discord";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
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
