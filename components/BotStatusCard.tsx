import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BotStatusConfig = {
  guildId: string;
  botType: string;
  botName: string | null;
  botAvatar: string | null;
  systems: string[];
  isActive: boolean;
  embedColor: string | null;
  botClientId?: string | null;
};

type BotStatusCardProps = {
  config: BotStatusConfig;
  guildName: string;
};

const typeLabelMap: Record<string, string> = {
  torcida: "Torcida",
  fivem_server: "FiveM Server",
  fivem_faccao: "Facção",
};

const typeStyleMap: Record<string, string> = {
  torcida: "bg-blue-500/15 text-blue-400",
  fivem_server: "bg-purple-500/15 text-purple-400",
  fivem_faccao: "bg-orange-500/15 text-orange-400",
};

function getInstallUrl(guildId: string, botClientId?: string | null) {
  if (!botClientId) return "";
  const params = new URLSearchParams({
    client_id: botClientId,
    permissions: "8",
    scope: "bot applications.commands",
    guild_id: guildId,
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export default function BotStatusCard({ config, guildName }: BotStatusCardProps) {
  const displayName = config.botName?.trim() || "Bot sem nome";
  const badgeLabel = typeLabelMap[config.botType] ?? config.botType;
  const badgeStyle =
    typeStyleMap[config.botType] ?? "bg-muted text-muted-foreground";
  const reinstallUrl = getInstallUrl(config.guildId, config.botClientId);

  return (
    <div className="group flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(254,83,0,0.08)]">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-primary/10">
          {config.botAvatar ? (
            <img
              src={config.botAvatar}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {displayName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{guildName}</p>
        </div>

        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-semibold",
            badgeStyle,
          )}
        >
          {badgeLabel}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {config.systems.length > 0 ? (
          config.systems.map((system) => (
            <span
              key={system}
              className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
            >
              {system}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">
            Nenhum sistema ativo
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            config.isActive ? "bg-green-500" : "bg-gray-400",
          )}
        />
        <span className={config.isActive ? "text-green-400" : "text-muted-foreground"}>
          {config.isActive ? "Ativo" : "Inativo"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild className="rounded-xl">
          <Link href={`/dashboard/${config.guildId}/bot`}>Configurar</Link>
        </Button>
        <Button
          asChild
          variant="secondary"
          className="rounded-xl"
          disabled={!reinstallUrl}
        >
          <a href={reinstallUrl || "#"} target="_blank" rel="noreferrer">
            Reinstalar
          </a>
        </Button>
      </div>
    </div>
  );
}

