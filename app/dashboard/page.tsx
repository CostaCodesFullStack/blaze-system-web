import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Bot, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { auth } from "@/auth";
import { bots } from "@/lib/data";
import { getAdminDiscordGuilds, type DiscordGuild } from "@/lib/discord";
import { prisma } from "@/lib/prisma";

const botLabelById = new Map(bots.map((bot) => [bot.id, bot.name]));

type DashboardGuild = DiscordGuild & {
  config: any | null;
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  let configs: any[] = [];
  try {
    configs = await prisma.config.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("Erro ao buscar configuracoes:", error);
  }

  let guilds: DiscordGuild[] = [];
  let guildsError = "";

  if (session.accessToken) {
    try {
      guilds = await getAdminDiscordGuilds(session.accessToken);
    } catch (error) {
      console.error("Erro ao carregar guilds no dashboard:", error);
      guildsError =
        "Nao foi possivel carregar seus servidores do Discord agora.";
    }
  } else {
    guildsError =
      "A sessao nao possui access token para consultar seus servidores.";
  }

  const configByGuildId = new Map(
    configs.map((config) => [config.guildId, config]),
  );

  const dashboardGuilds: DashboardGuild[] = guilds.map((guild) => ({
    ...guild,
    config: configByGuildId.get(guild.id) ?? null,
  }));

  const configuredGuildCount = dashboardGuilds.filter(
    (guild) => guild.config,
  ).length;
  const activeBots = new Set(
    dashboardGuilds
      .map((guild) => guild.config?.bot)
      .filter((bot): bot is string => Boolean(bot)),
  ).size;

  return (
    <div className="px-8 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Meus Servidores</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie apenas os servidores do Discord onde sua conta tem permissao
          administrativa.
        </p>
        <p className="text-sm text-muted-foreground">
          Usuario conectado:{" "}
          {session.user.globalName ?? session.user.name ?? "Discord"}
        </p>
      </div>

      {guildsError ? (
        <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {guildsError}
        </div>
      ) : null}

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Servidores com admin", value: dashboardGuilds.length },
          { label: "Configs salvas", value: configuredGuildCount },
          { label: "Bots ativos", value: activeBots },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4"
          >
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <span className="text-2xl font-bold text-foreground">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {dashboardGuilds.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Nenhum servidor disponivel
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Seu dashboard vai listar os servidores em que voce tem permissao de
            administrador no Discord.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardGuilds.map((guild) => (
            <div
              key={guild.id}
              className="group flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(254,83,0,0.08)]"
            >
              <div className="flex items-start gap-4">
                {guild.iconUrl ? (
                  <img
                    src={guild.iconUrl}
                    alt={guild.name}
                    className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
                    {guild.name.charAt(0).toUpperCase()}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {guild.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Guild ID: {guild.id}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    guild.config
                      ? "bg-green-500/10 text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {guild.config ? "Configurado" : "Sem config"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>
                    {guild.owner ? "Dono do servidor" : "Administrador"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <span>
                    {guild.config
                      ? (botLabelById.get(guild.config.bot) ?? guild.config.bot)
                      : "Nenhum bot configurado"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <span>
                    {guild.config
                      ? `${guild.config.systems.length} sistema(s) ativo(s)`
                      : "Nenhuma automacao salva"}
                  </span>
                </div>
              </div>

              <Link
                href={`/dashboard/${guild.id}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary group-hover:border-primary/40"
              >
                Gerenciar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
