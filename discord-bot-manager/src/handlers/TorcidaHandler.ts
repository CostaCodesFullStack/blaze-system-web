import { EmbedBuilder, type ColorResolvable, type Interaction } from "discord.js";

import { BaseBotHandler } from "./BaseBotHandler.js";

export class TorcidaHandler extends BaseBotHandler {
  protected registerSpecific() {
    this.client.on("interactionCreate", (interaction: Interaction) => {
      void this.handleInteraction(interaction);
    });
  }

  private async handleInteraction(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const cfg = this.getConfig();

    if (interaction.commandName === "torcer") {
      const embed = new EmbedBuilder()
        .setColor((cfg.embedColor ?? "#5865F2") as ColorResolvable)
        .setTitle("Vamos torcer juntos!")
        .setDescription(cfg.embedText ?? "A torcida está pronta para apoiar o time.")
        .setTimestamp();

      if (cfg.embedBanner) {
        embed.setImage(cfg.embedBanner);
      }

      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (interaction.commandName === "time") {
      const embed = new EmbedBuilder()
        .setColor((cfg.embedColor ?? "#5865F2") as ColorResolvable)
        .setTitle("Informações do time")
        .setDescription("Informações do time")
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  }
}
