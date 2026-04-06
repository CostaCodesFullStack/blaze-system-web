"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Save,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { bots, systems } from "@/lib/data";
import type { DiscordGuild, DiscordRole, DiscordChannel } from "@/lib/discord";
import { PreviewCard } from "@/components/preview-card";

type DashboardConfig = {
  guildId: string;
  bot?: string;
  systems?: string[];
  role?: string;
  channel?: string;
};

interface SelectProps {
  options: { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isLoading?: boolean;
}

function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  isLoading,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={isLoading}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "w-full rounded-xl border border-border bg-input px-4 py-3 text-left text-sm text-foreground transition-colors",
          "flex items-center justify-between hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30",
          isLoading && "opacity-50 cursor-not-allowed",
        )}
      >
        <span
          className={selected ? "text-foreground" : "text-muted-foreground"}
        >
          {isLoading
            ? "Carregando..."
            : selected
              ? selected.label
              : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && !isLoading ? (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          {options.length === 0 ? (
            <div className="px-4 py-2.5 text-sm text-muted-foreground">
              Nenhuma opção disponível
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm transition-colors",
                  "hover:bg-primary/10 hover:text-primary",
                  value === option.id
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground",
                )}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function ServerManagementPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [server, setServer] = useState<DiscordGuild | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [serverMissing, setServerMissing] = useState(false);
  const [role, setRole] = useState("");
  const [channel, setChannel] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [selectedBot, setSelectedBot] = useState("torcida");
  const [enabledSystems, setEnabledSystems] = useState<string[]>([]);
  const [roleOptions, setRoleOptions] = useState<
    { id: string; label: string }[]
  >([]);
  const [channelOptions, setChannelOptions] = useState<
    { id: string; label: string }[]
  >([]);

  // Estado inicial para detectar mudanças
  const [initialRole, setInitialRole] = useState("");
  const [initialChannel, setInitialChannel] = useState("");
  const [initialBot, setInitialBot] = useState("torcida");
  const [initialSystems, setInitialSystems] = useState<string[]>([]);

  // Calcular se o formulário está "dirty" (tem mudanças)
  const isDirty = useMemo(() => {
    return (
      role !== initialRole ||
      channel !== initialChannel ||
      selectedBot !== initialBot ||
      JSON.stringify([...enabledSystems].sort()) !==
        JSON.stringify([...initialSystems].sort())
    );
  }, [
    role,
    channel,
    selectedBot,
    enabledSystems,
    initialRole,
    initialChannel,
    initialBot,
    initialSystems,
  ]);

  function resetConfigState() {
    setRole("");
    setChannel("");
    setSelectedBot("torcida");
    setEnabledSystems([]);
    setInitialRole("");
    setInitialChannel("");
    setInitialBot("torcida");
    setInitialSystems([]);
  }

  useEffect(() => {
    if (!id) {
      setAccessDenied(false);
      setServerMissing(true);
      setLoadingData(false);
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        setLoadingData(true);
        setAccessDenied(false);
        setServerMissing(false);
        setServer(null);
        resetConfigState();

        const guildsResponse = await fetch("/api/guilds", {
          cache: "no-store",
        });

        if (!guildsResponse.ok) {
          throw new Error(
            "Não foi possível carregar seus servidores do Discord.",
          );
        }

        const guildsData = await guildsResponse.json();

        if (!guildsData?.success || cancelled) {
          return;
        }

        const matchedServer = (
          guildsData.guilds as DiscordGuild[] | undefined
        )?.find((guild) => guild.id === id);

        if (!matchedServer) {
          setAccessDenied(true);
          return;
        }

        setServer(matchedServer);

        const configResponse = await fetch(`/api/config?guildId=${id}`, {
          cache: "no-store",
        });

        if (configResponse.status === 403) {
          setAccessDenied(true);
          setServer(null);
          return;
        }

        if (!configResponse.ok) {
          throw new Error(
            "Nao foi possivel carregar a configuracao deste servidor.",
          );
        }

        const configData = await configResponse.json();

        if (!configData?.success || cancelled) {
          return;
        }

        const config = configData.config as DashboardConfig | null;

        if (config) {
          setRole(config.role ?? "");
          setChannel(config.channel ?? "");
          setSelectedBot(config.bot ?? "torcida");
          setEnabledSystems(config.systems ?? []);

          // Também setamos os valores iniciais
          setInitialRole(config.role ?? "");
          setInitialChannel(config.channel ?? "");
          setInitialBot(config.bot ?? "torcida");
          setInitialSystems(config.systems ?? []);
        } else {
          // Se não há config, resetar para defaults
          setRole("");
          setChannel("");
          setSelectedBot("torcida");
          setEnabledSystems([]);

          setInitialRole("");
          setInitialChannel("");
          setInitialBot("torcida");
          setInitialSystems([]);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Não foi possível carregar este servidor agora.";
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoadingData(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Carregar roles e channels do servidor
  useEffect(() => {
    if (!id || accessDenied || serverMissing || !server) {
      return;
    }

    let cancelled = false;

    async function loadOptions() {
      try {
        setLoadingOptions(true);

        const [rolesResponse, channelsResponse] = await Promise.all([
          fetch(`/api/guilds/${id}/roles`, { cache: "no-store" }),
          fetch(`/api/guilds/${id}/channels`, { cache: "no-store" }),
        ]);

        if (!rolesResponse.ok || !channelsResponse.ok) {
          throw new Error("Não foi possível carregar as opções do servidor.");
        }

        const rolesData = await rolesResponse.json();
        const channelsData = await channelsResponse.json();

        if (!cancelled && rolesData?.success && channelsData?.success) {
          const roles = (rolesData.roles as DiscordRole[] | undefined) ?? [];
          const channels =
            (channelsData.channels as DiscordChannel[] | undefined) ?? [];

          setRoleOptions(
            roles.map((r) => ({
              id: r.id,
              label: `@${r.name}`,
            })),
          );

          setChannelOptions(
            channels.map((c) => ({
              id: c.id,
              label: `#${c.name}`,
            })),
          );
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Não foi possível carregar as opções do servidor.";
          // Não mostrar erro de loading de options, só no console se necessário
          console.error("Erro ao carregar roles/channels:", message);
        }
      } finally {
        if (!cancelled) {
          setLoadingOptions(false);
        }
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, [accessDenied, id, server, serverMissing]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();

    if (!id) {
      toast.error("Servidor inválido.");
      return;
    }

    if (!role || !channel) {
      toast.error("Selecione um cargo e um canal antes de salvar.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guildId: id,
          bot: selectedBot,
          systems: enabledSystems,
          role,
          channel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar configurações.");
      }

      // Após salvar com sucesso, atualizar os valores iniciais
      // Isso faz o isDirty voltar a false
      setInitialRole(role);
      setInitialChannel(channel);
      setInitialBot(selectedBot);
      setInitialSystems([...enabledSystems]);

      toast.success(data.message || "Configurações salvas com sucesso!");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar agora. Tente novamente.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="px-8 py-10">
        <div className="flex flex-col gap-4">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="h-20 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!id || accessDenied) {
    return (
      <div className="max-w-2xl px-8 py-10">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-bold text-foreground">
            Voce nao tem acesso a este servidor
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Apenas o dono do servidor ou usuarios com permissao de
            administrador no Discord podem abrir este painel.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para servidores
          </Link>
        </div>
      </div>
    );
  }

  if (serverMissing || !server) {
    return (
      <div className="max-w-2xl px-8 py-10">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-bold text-foreground">
            Servidor não encontrado
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esse servidor não existe ou sua conta não possui acesso
            administrativo.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para servidores
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl px-8 py-10">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para servidores
      </Link>

      <div className="mb-8 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {server.iconUrl ? (
            <img
              src={server.iconUrl}
              alt={server.name}
              className="h-14 w-14 rounded-2xl object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
              {server.name.charAt(0).toUpperCase()}
            </span>
          )}

          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Painel do servidor
            </div>
            <h1 className="mt-2 text-3xl font-bold text-foreground">
              {server.name}
            </h1>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Configure o bot principal, ative módulos extras e defina os canais e
          cargos usados na automação deste servidor.
        </p>
      </div>

      <div className="mb-8 flex items-start gap-4 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
        <div className="mt-0.5 rounded-full bg-green-500/15 p-2">
          <ShieldCheck className="h-5 w-5 text-green-400" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-green-400">
            Acesso administrativo confirmado
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sua conta do Discord possui permissão para gerenciar este servidor e
            salvar configurações no Blaze System.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Grid layout for form and preview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form sections - takes 2 columns on large screens */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-foreground">
                  Bot principal
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Escolha qual bot será responsável pelo fluxo principal deste
                  servidor.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {bots.map((bot) => (
                  <button
                    key={bot.id}
                    type="button"
                    onClick={() => setSelectedBot(bot.id)}
                    className={cn(
                      "rounded-2xl border p-5 text-left transition-all duration-200",
                      "hover:border-primary/40 hover:bg-primary/5",
                      selectedBot === bot.id
                        ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(254,83,0,0.08)]"
                        : "border-border bg-background",
                    )}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl",
                          selectedBot === bot.id
                            ? "bg-primary text-white"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        <bot.icon className="h-5 w-5" />
                      </span>
                      {selectedBot === bot.id ? (
                        <span className="rounded-full bg-primary/15 px-2 py-1 text-xs font-semibold text-primary">
                          Selecionado
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm font-semibold text-foreground">
                      {bot.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {bot.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-foreground">
                  Sistemas adicionais
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ative os módulos complementares que vão expandir a operação do
                  servidor.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {systems.map((system) => {
                  const selected = enabledSystems.includes(system.id);

                  return (
                    <button
                      key={system.id}
                      type="button"
                      onClick={() =>
                        setEnabledSystems((current) =>
                          current.includes(system.id)
                            ? current.filter((item) => item !== system.id)
                            : [...current, system.id],
                        )
                      }
                      className={cn(
                        "rounded-2xl border p-5 text-left transition-all duration-200",
                        "hover:border-primary/40 hover:bg-primary/5",
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background",
                      )}
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <span
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl",
                            selected
                              ? "bg-primary text-white"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          <system.icon className="h-5 w-5" />
                        </span>
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
                            selected
                              ? "border-primary bg-primary text-white"
                              : "border-border text-transparent",
                          )}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-foreground">
                        {system.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {system.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-foreground">
                  Configurações operacionais
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Defina o cargo concedido após verificação e para qual canal os
                  anúncios automáticos serão enviados.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Cargo verificado
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Cargo atribuído ao membro assim que a verificação for
                    concluída.
                  </p>
                  <CustomSelect
                    options={roleOptions}
                    value={role}
                    onChange={setRole}
                    placeholder="Selecione um cargo"
                    isLoading={loadingOptions}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Canal de anúncios
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Canal usado para disparar avisos automatizados do bot.
                  </p>
                  <CustomSelect
                    options={channelOptions}
                    value={channel}
                    onChange={setChannel}
                    placeholder="Selecione um canal"
                    isLoading={loadingOptions}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Preview Card - takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PreviewCard
                selectedBot={selectedBot}
                role={role}
                channel={channel}
                enabledSystems={enabledSystems}
                roleOptions={roleOptions}
                channelOptions={channelOptions}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {isDirty && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-600">
                Você tem mudanças não salvas. Clique em &quot;Salvar
                configurações&quot; para confirmar.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || !isDirty}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all",
                isDirty
                  ? "bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(254,83,0,0.35)] active:scale-95"
                  : "bg-primary/60 hover:bg-primary/60 cursor-not-allowed",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary/60",
              )}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar configurações
                </>
              )}
            </button>

            {!isDirty && !loading && (
              <p className="text-xs text-muted-foreground">
                Sem mudanças para salvar
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
