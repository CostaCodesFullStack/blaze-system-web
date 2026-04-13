import { EmbedBuilder, type ColorResolvable, type Interaction } from "discord.js";

import { BaseBotHandler } from "./BaseBotHandler.js";

export class FivemFaccaoHandler extends BaseBotHandler {
  protected registerSpecific() {
    this.client.on("interactionCreate", (interaction: Interaction) => {
      void this.handleInteraction(interaction);
    });
  }

  private async handleInteraction(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const cfg = this.getConfig();

    if (interaction.commandName === "hierarquia") {
      const embed = new EmbedBuilder()
        .setColor((cfg.embedColor ?? "#5865F2") as ColorResolvable)
        .setTitle("Hierarquia da Facção")
        .setDescription(cfg.embedText ?? "Hierarquia da facção não configurada.")
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (interaction.commandName === "membros") {
      const embed = new EmbedBuilder()
        .setColor((cfg.embedColor ?? "#5865F2") as ColorResolvable)
        .setTitle("Lista de membros")
        .setDescription("Lista de membros")
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (interaction.commandName === "recrutamento") {
      const embed = new EmbedBuilder()
        .setColor((cfg.embedColor ?? "#5865F2") as ColorResolvable)
        .setTitle("Recrutamento aberto")
        .setDescription("Recrutamento aberto")
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    }
  }
}
