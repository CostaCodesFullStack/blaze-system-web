"use client";

import { useEffect, useMemo, useState } from "react";

import type { BotWizardForm } from "../page";
import type { DiscordChannel, DiscordRole } from "@/lib/discord";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type StepSystemsProps = {
  guildId: string;
  form: BotWizardForm;
  setForm: React.Dispatch<React.SetStateAction<BotWizardForm>>;
  onNext: () => void;
  onBack: () => void;
  saving?: boolean;
};

type ChannelsResponse =
  | { success: true; channels: DiscordChannel[] }
  | { success: false; error: string };
type RolesResponse =
  | { success: true; roles: DiscordRole[] }
  | { success: false; error: string };

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

export default function StepSystems({
  guildId,
  form,
  setForm,
  onNext,
  onBack,
  saving,
}: StepSystemsProps) {
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [roles, setRoles] = useState<DiscordRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!guildId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [channelsRes, rolesRes] = await Promise.all([
          fetch(`/api/guilds/${guildId}/channels`, { cache: "no-store" }),
          fetch(`/api/guilds/${guildId}/roles`, { cache: "no-store" }),
        ]);

        const channelsData = (await channelsRes.json().catch(() => null)) as ChannelsResponse | null;
        const rolesData = (await rolesRes.json().catch(() => null)) as RolesResponse | null;

        if (!channelsRes.ok || !channelsData || !channelsData.success) {
          throw new Error(
            channelsData && !channelsData.success
              ? channelsData.error
              : "Não foi possível carregar os canais.",
          );
        }

        if (!rolesRes.ok || !rolesData || !rolesData.success) {
          throw new Error(
            rolesData && !rolesData.success
              ? rolesData.error
              : "Não foi possível carregar os cargos.",
          );
        }

        if (cancelled) return;

        setChannels(channelsData.channels ?? []);
        setRoles(rolesData.roles ?? []);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erro ao carregar opções do servidor.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [guildId]);

  const enabled = useMemo(() => new Set(form.systems ?? []), [form.systems]);

  function setSystem(systemId: string, next: boolean) {
    setLocalError("");
    setForm((prev) => {
      const systems = prev.systems ?? [];
      const nextSystems = next ? toggle(systems, systemId) : systems.filter((x) => x !== systemId);

      const cleared: Partial<BotWizardForm> = {};
      if (!next) {
        if (systemId === "welcome") cleared.welcomeChannelId = "";
        if (systemId === "log") cleared.logChannelId = "";
        if (systemId === "cargo_auto") cleared.autoRoleId = "";
      }

      return { ...prev, ...cleared, systems: nextSystems };
    });
  }

  function validate() {
    const systems = new Set(form.systems ?? []);
    if (systems.has("welcome") && !form.welcomeChannelId) {
      return "Selecione um canal para a mensagem de boas-vindas.";
    }
    if (systems.has("log") && !form.logChannelId) {
      return "Selecione um canal para os logs.";
    }
    if (systems.has("cargo_auto") && !form.autoRoleId) {
      return "Selecione um cargo para o cargo automático.";
    }
    return "";
  }

  function handleContinue() {
    const message = validate();
    if (message) {
      setLocalError(message);
      return;
    }
    onNext();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Sistemas</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ative recursos e selecione canais/cargos do Discord.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {localError ? (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
          {localError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={enabled.has("welcome")}
              onCheckedChange={(v) => setSystem("welcome", Boolean(v))}
              disabled={loading}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Mensagem de boas-vindas
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Envia uma mensagem quando um membro entra no servidor.
              </p>

              {enabled.has("welcome") ? (
                <div className="mt-4 flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Canal de boas-vindas
                  </label>
                  <Select
                    value={form.welcomeChannelId || undefined}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, welcomeChannelId: value }))
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder={loading ? "Carregando..." : "Selecione um canal"} />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          #{c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={enabled.has("log")}
              onCheckedChange={(v) => setSystem("log", Boolean(v))}
              disabled={loading}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Canal de logs</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Centraliza eventos e registros do bot em um canal.
              </p>

              {enabled.has("log") ? (
                <div className="mt-4 flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Canal de logs
                  </label>
                  <Select
                    value={form.logChannelId || undefined}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, logChannelId: value }))
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder={loading ? "Carregando..." : "Selecione um canal"} />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          #{c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={enabled.has("cargo_auto")}
              onCheckedChange={(v) => setSystem("cargo_auto", Boolean(v))}
              disabled={loading}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Cargo automático</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Atribui um cargo automaticamente após o onboarding.
              </p>

              {enabled.has("cargo_auto") ? (
                <div className="mt-4 flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Cargo
                  </label>
                  <Select
                    value={form.autoRoleId || undefined}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, autoRoleId: value }))
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder={loading ? "Carregando..." : "Selecione um cargo"} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          @{r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={enabled.has("status")}
              onCheckedChange={(v) => {
                setLocalError("");
                setForm((prev) => ({ ...prev, systems: toggle(prev.systems ?? [], "status") }));
              }}
              disabled={loading}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Status dinâmico</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Atualiza o status do bot com informações úteis em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-xl"
        >
          Voltar
        </Button>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={Boolean(error) || saving}
          className={cn("rounded-xl", saving && "opacity-70")}
        >
          {saving ? "Salvando..." : "Salvar e continuar"}
        </Button>
      </div>
    </div>
  );
}

