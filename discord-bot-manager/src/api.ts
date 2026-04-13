export interface BotConfig {
  id: string;
  guildId: string;
  botType: string;
  botToken: string;
  botClientId: string;
  botName: string | null;
  botAvatar: string | null;
  systems: string[];
  welcomeChannelId: string | null;
  logChannelId: string | null;
  autoRoleId: string | null;
  embedColor: string | null;
  embedText: string | null;
  embedBanner: string | null;
}

type SyncResponse = {
  configs?: BotConfig[];
};

export async function fetchAllConfigs(): Promise<BotConfig[] | null> {
  try {
    const baseUrl = process.env.SAAS_API_URL;
    const secret = process.env.BOT_API_SECRET;

    if (!baseUrl || !secret) {
      console.error("[BotManager] SAAS_API_URL ou BOT_API_SECRET ausente no ambiente.");
      return null;
    }

    const response = await fetch(`${baseUrl}/api/bot/sync`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(`[BotManager] /api/bot/sync falhou com status ${response.status}`);
      return null;
    }

    const data = (await response.json()) as SyncResponse;
    return Array.isArray(data.configs) ? data.configs : [];
  } catch (error) {
    console.error("[BotManager] Erro ao buscar configs:", error);
    return null;
  }
}
