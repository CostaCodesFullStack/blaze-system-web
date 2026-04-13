import { Client, GatewayIntentBits } from "discord.js";

import { fetchAllConfigs, type BotConfig } from "./api.js";
import { createHandler } from "./handlers/BaseBotHandler.js";

export class BotManager {
  private clients = new Map<string, Client>();
  private configs = new Map<string, BotConfig>();

  async start() {
    console.log("[BotManager] Iniciando...");
    await this.syncAll();
    setInterval(() => {
      void this.syncAll();
    }, 60_000);
  }

  private async syncAll() {
    const fresh = await fetchAllConfigs();
    if (!fresh) return;

    const freshIds = new Set(fresh.map((c) => c.guildId));

    for (const [guildId, client] of this.clients) {
      if (!freshIds.has(guildId)) {
        await client.destroy();
        this.clients.delete(guildId);
        this.configs.delete(guildId);
        console.log(`[BotManager] Bot removido: ${guildId}`);
      }
    }

    for (const config of fresh) {
      const existing = this.configs.get(config.guildId);

      if (!this.clients.has(config.guildId)) {
        await this.loginBot(config);
      } else if (existing?.botToken !== config.botToken) {
        await this.clients.get(config.guildId)?.destroy();
        this.clients.delete(config.guildId);
        await this.loginBot(config);
      } else {
        this.configs.set(config.guildId, config);
      }
    }
  }

  private async loginBot(config: BotConfig) {
    try {
      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      });

      const handler = createHandler(config, client, this.configs);
      handler.register();

      client.once("ready", (c) => {
        console.log(`[Bot ONLINE] ${c.user.tag} -> ${config.guildId}`);
        if (config.botName) c.user.setUsername(config.botName).catch(() => {});
        if (config.botAvatar) c.user.setAvatar(config.botAvatar).catch(() => {});
      });

      await client.login(config.botToken);
      this.clients.set(config.guildId, client);
      this.configs.set(config.guildId, config);
    } catch (error) {
      console.error(`[BotManager] Falha ao logar bot ${config.guildId}:`, error);
    }
  }
}
