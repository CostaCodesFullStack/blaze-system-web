"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Save,
  Sparkles,
  XCircle,
} from "lucide-react";
import { bots, systems } from "@/lib/data";


const roles = [
  { id: "r1", label: "@Verificado" },
  { id: "r2", label: "@Membro" },
  { id: "r3", label: "@Torcedor" },
  { id: "r4", label: "@VIP" },
];

const channels = [
  { id: "c1", label: "#anúncios" },
  { id: "c2", label: "#geral" },
  { id: "c3", label: "#verificação" },
  { id: "c4", label: "#eventos" },
];

const validServers = ["1", "2", "3", "4"];

interface SelectProps {
  options: { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function CustomSelect({ options, value, onChange, placeholder }: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "w-full flex items-center justify-between rounded-xl border border-border bg-input px-4 py-3 text-left text-sm text-foreground transition-colors",
          "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30",
        )}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          {options.map((option) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServerManagementPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [role, setRole] = useState("");
  const [channel, setChannel] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedBot, setSelectedBot] = useState("torcida");
  const [enabledSystems, setEnabledSystems] = useState<string[]>([]);

  useEffect(() => {
    if (!id || !validServers.includes(id)) return;

    let cancelled = false;

    async function loadConfig() {
      try {
        const response = await fetch(`/api/config?id=${id}`);

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (!data || cancelled) return;

        setRole(data.role ?? "");
        setChannel(data.channel ?? "");
        setSelectedBot(data.bot ?? "torcida");
        setEnabledSystems(data.systems ?? []);
      } catch {
        // Keep the default local state when no saved config is available.
      }
    }

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id || !validServers.includes(id)) {
    return (
      <div className="max-w-2xl px-8 py-10">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-bold text-foreground">
            Servidor não encontrado
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esse servidor não existe ou você não tem acesso a ele.
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

  const isActive = id !== "4";

  const serverNames: Record<string, string> = {
    "1": "Torcida Sangue Azul",
    "2": "Fiel Torcida Oficial",
    "3": "Bando de Loucos FC",
    "4": "Máfia Azul Grêmio",
  };

  const serverName = serverNames[id];

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();

    if (!role || !channel) {
      setFeedback("Selecione um cargo e um canal antes de salvar.");
      return;
    }

    setLoading(true);
    setFeedback("");
    setSaved(false);

    try {
      const config = {
        guildId: id,
        bot: selectedBot,
        systems: enabledSystems,
        role,
        channel,
      };

      const response = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao salvar configurações.");
      }

      setSaved(true);
      setFeedback("Configurações salvas com sucesso.");
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setFeedback("Não foi possível salvar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
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

      <div className="mb-8 flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Painel do servidor
        </div>
        <h1 className="text-3xl font-bold text-foreground">{serverName}</h1>
        <p className="text-sm text-muted-foreground">
          Configure o bot principal, ative módulos extras e defina os canais e
          cargos usados na automação deste servidor.
        </p>
      </div>

      <div
        className={cn(
          "mb-8 flex items-start gap-4 rounded-2xl border p-5",
          isActive
            ? "border-green-500/30 bg-green-500/10"
            : "border-destructive/30 bg-destructive/10",
        )}
      >
        <div
          className={cn(
            "mt-0.5 rounded-full p-2",
            isActive ? "bg-green-500/15" : "bg-destructive/15",
          )}
        >
          {isActive ? (
            <CheckCircle2 className="h-5 w-5 text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" />
          )}
        </div>

        <div className="flex-1">
          <p
            className={cn(
              "text-sm font-semibold",
              isActive ? "text-green-400" : "text-destructive",
            )}
          >
            Licença {isActive ? "ativa" : "expirada"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isActive
              ? "O servidor pode salvar configurações e usar todos os recursos liberados pelo plano atual."
              : "Renove o plano para voltar a salvar configurações e utilizar o bot normalmente."}
          </p>
        </div>

        {!isActive && (
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Renovar plano
          </Link>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
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
                  {selectedBot === bot.id && (
                    <span className="rounded-full bg-primary/15 px-2 py-1 text-xs font-semibold text-primary">
                      Selecionado
                    </span>
                  )}
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
                  onClick={() => {
                    if (!isActive) return;

                    setEnabledSystems((current) =>
                      current.includes(system.id)
                        ? current.filter((item) => item !== system.id)
                        : [...current, system.id],
                    );
                  }}
                  disabled={!isActive}
                  className={cn(
                    "rounded-2xl border p-5 text-left transition-all duration-200",
                    "hover:border-primary/40 hover:bg-primary/5",
                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-background",
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
                Cargo atribuído ao membro assim que a verificação for concluída.
              </p>
              <CustomSelect
                options={roles}
                value={role}
                onChange={setRole}
                placeholder="Selecione um cargo"
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
                options={channels}
                value={channel}
                onChange={setChannel}
                placeholder="Selecione um canal"
              />
            </div>
          </div>
        </section>

        {feedback && (
          <div
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              saved
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {feedback}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!isActive || loading}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all",
              "bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(254,83,0,0.35)] active:scale-95",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary",
            )}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Salvando...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Salvo com sucesso
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar configurações
              </>
            )}
          </button>

          <span className="text-xs text-muted-foreground">
            {isActive
              ? "As alterações são enviadas para a API local do projeto."
              : "Salvamento bloqueado enquanto a licença estiver expirada."}
          </span>
        </div>
      </form>
    </div>
  );
}
