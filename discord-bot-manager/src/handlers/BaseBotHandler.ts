import {
  Client,
  EmbedBuilder,
  GuildMember,
  TextChannel,
  type ColorResolvable,
} from "discord.js";

import type { BotConfig } from "../api.js";
import { FivemFaccaoHandler } from "./FivemFaccaoHandler.js";
import { FivemServerHandler } from "./FivemServerHandler.js";
import { TorcidaHandler } from "./TorcidaHandler.js";

export class BaseBotHandler {
  constructor(
    protected config: BotConfig,
    protected client: Client,
    protected allConfigs: Map<string, BotConfig>,
  ) {}

  protected getConfig() {
    return this.allConfigs.get(this.config.guildId) ?? this.config;
  }

  register() {
    this.client.on("guildMemberAdd", (member) => {
      void this.onMemberJoin(member);
    });
    this.registerSpecific();
  }

  protected registerSpecific() {}

  private async onMemberJoin(member: GuildMember) {
    const cfg = this.getConfig();

    try {
      if (cfg.systems.includes("cargo_auto") && cfg.autoRoleId) {
        const role = member.guild.roles.cache.get(cfg.autoRoleId);
        if (role) {
          await member.roles.add(role);
        }
      }

      if (cfg.systems.includes("welcome") && cfg.welcomeChannelId) {
        const channel = member.guild.channels.cache.get(
          cfg.welcomeChannelId,
        ) as TextChannel | undefined;

        if (channel && channel.isTextBased()) {
          const embed = new EmbedBuilder()
            .setColor((cfg.embedColor ?? "#5865F2") as ColorResolvable)
            .setDescription(
              cfg.embedText?.replace("{user}", member.toString()) ??
                `Bem-vindo(a), ${member}!`,
            )
            .setTimestamp();

          if (cfg.embedBanner) {
            embed.setImage(cfg.embedBanner);
          }

          await channel.send({ embeds: [embed] });
        }
      }

      if (cfg.systems.includes("log") && cfg.logChannelId) {
        const logChannel = member.guild.channels.cache.get(
          cfg.logChannelId,
        ) as TextChannel | undefined;

        if (logChannel && logChannel.isTextBased()) {
          await logChannel.send(
            `📥 **${member.user.tag}** entrou - ${new Date().toLocaleString("pt-BR")}`,
          );
        }
      }
    } catch (error) {
      console.error(
        `[BotHandler] Erro no fluxo de entrada (${cfg.guildId}):`,
        error,
      );
    }
  }
}

export function createHandler(
  config: BotConfig,
  client: Client,
  allConfigs: Map<string, BotConfig>,
) {
  switch (config.botType) {
    case "torcida":
      return new TorcidaHandler(config, client, allConfigs);
    case "fivem_server":
      return new FivemServerHandler(config, client, allConfigs);
    case "fivem_faccao":
      return new FivemFaccaoHandler(config, client, allConfigs);
    default:
      return new BaseBotHandler(config, client, allConfigs);
  }
}
