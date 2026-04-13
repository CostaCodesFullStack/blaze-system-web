import { EmbedBuilder, type ColorResolvable, type TextChannel } from "discord.js";

import { BaseBotHandler } from "./BaseBotHandler.js";

export class FivemServerHandler extends BaseBotHandler {
  protected registerSpecific() {
    this.client.once("ready", () => {
      setInterval(() => {
        void this.postServerStatus();
      }, 5 * 60_000);
    });
  }

  private async postServerStatus() {
    const cfg = this.getConfig();
    if (!cfg.systems.includes("status") || !cfg.logChannelId) return;

    const guild = this.client.guilds.cache.get(cfg.guildId);
    if (!guild) return;

    const channel = guild.channels.cache.get(cfg.logChannelId) as TextChannel | undefined;
    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor((cfg.embedColor ?? "#5865F2") as ColorResolvable)
      .setTitle("🖥️ Servidor online")
      .setDescription("Status do servidor atualizado.")
      .setTimestamp();

    // Integrar com API FiveM aqui.
    await channel.send({ embeds: [embed] });
  }
}
