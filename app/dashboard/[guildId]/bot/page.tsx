"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import StepType from "./_components/StepType";
import StepToken from "./_components/StepToken";
import StepCustomize from "./_components/StepCustomize";
import StepSystems from "./_components/StepSystems";
import StepInstall from "./_components/StepInstall";

import { cn } from "@/lib/utils";

export type WizardStep = "type" | "token" | "customize" | "systems" | "install";

export type BotWizardForm = {
  botType: "torcida" | "fivem_server" | "fivem_faccao";
  botToken: string;
  botClientId: string;
  botName: string;
  botAvatar: string;
  embedColor: string;
  embedText: string;
  embedBanner: string;
  welcomeChannelId: string;
  logChannelId: string;
  autoRoleId: string;
  systems: string[];
};

const stepOrder: WizardStep[] = [
  "type",
  "token",
  "customize",
  "systems",
  "install",
];

const defaultForm: BotWizardForm = {
  botType: "torcida",
  botToken: "",
  botClientId: "",
  botName: "",
  botAvatar: "",
  embedColor: "#5865F2",
  embedText: "",
  embedBanner: "",
  welcomeChannelId: "",
  logChannelId: "",
  autoRoleId: "",
  systems: [],
};

type BotConfigApiResponse = {
  config:
    | (Partial<BotWizardForm> & {
        guildId: string;
        id: string;
      })
    | null;
};

export default function BotWizardPage() {
  const params = useParams<{ guildId: string }>();
  const router = useRouter();
  const guildId = params?.guildId as string;

  const [step, setStep] = useState<WizardStep>("type");
  const [form, setForm] = useState<BotWizardForm>(defaultForm);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);

  const stepIndex = useMemo(() => stepOrder.indexOf(step), [step]);

  useEffect(() => {
    if (!guildId) {
      setLoadingConfig(false);
      return;
    }

    let cancelled = false;

    async function loadConfig() {
      try {
        setLoadingConfig(true);
        const res = await fetch(`/api/bot/config?guildId=${guildId}`, {
          cache: "no-store",
        });
        const data = (await res.json().catch(() => null)) as BotConfigApiResponse | null;

        if (!res.ok) {
          const errorMessage =
            data && typeof data === "object" && "error" in data
              ? String((data as any).error)
              : "Não foi possível carregar a configuração do bot.";
          throw new Error(errorMessage);
        }

        if (cancelled) {
          return;
        }

        if (data?.config) {
          const cfg = data.config;
          setForm((prev) => ({
            ...prev,
            botType: (cfg.botType as BotWizardForm["botType"]) ?? prev.botType,
            botToken: cfg.botToken ?? prev.botToken,
            botClientId: cfg.botClientId ?? prev.botClientId,
            botName: cfg.botName ?? prev.botName,
            botAvatar: cfg.botAvatar ?? prev.botAvatar,
            embedColor: cfg.embedColor ?? prev.embedColor,
            embedText: cfg.embedText ?? prev.embedText,
            embedBanner: cfg.embedBanner ?? prev.embedBanner,
            welcomeChannelId: cfg.welcomeChannelId ?? prev.welcomeChannelId,
            logChannelId: cfg.logChannelId ?? prev.logChannelId,
            autoRoleId: cfg.autoRoleId ?? prev.autoRoleId,
            systems: Array.isArray(cfg.systems) ? cfg.systems : prev.systems,
          }));
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Não foi possível carregar a configuração do bot.";
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoadingConfig(false);
        }
      }
    }

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, [guildId]);

  async function handleSave() {
    if (!guildId) {
      toast.error("Servidor inválido.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/bot/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guildId,
          ...form,
          systems: form.systems ?? [],
          botName: form.botName || undefined,
          botAvatar: form.botAvatar || undefined,
          embedColor: form.embedColor || undefined,
          embedText: form.embedText || undefined,
          embedBanner: form.embedBanner || undefined,
          welcomeChannelId: form.welcomeChannelId || undefined,
          logChannelId: form.logChannelId || undefined,
          autoRoleId: form.autoRoleId || undefined,
        }),
      });

      const data = (await res.json().catch(() => null)) as any;

      if (!res.ok) {
        const errorMessage =
          data && typeof data === "object" && "error" in data
            ? String(data.error)
            : "Erro ao salvar configurações do bot.";
        throw new Error(errorMessage);
      }

      toast.success("Configuração salva com sucesso.");
      setStep("install");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar agora. Tente novamente.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  const progressDots = (
    <div className="mb-8 flex items-center justify-center gap-3">
      {stepOrder.map((s, idx) => {
        const done = idx < stepIndex;
        const active = idx === stepIndex;
        return (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={cn(
              "h-2.5 w-10 rounded-full transition-colors",
              done ? "bg-primary/60" : active ? "bg-primary" : "bg-muted",
            )}
            aria-label={`Etapa ${idx + 1}`}
          />
        );
      })}
    </div>
  );

  if (loadingConfig) {
    return (
      <div className="px-8 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 h-3 w-40 rounded-full bg-muted" />
          <div className="h-64 rounded-2xl border border-border bg-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-10">
      <div className="mx-auto max-w-5xl">
        {progressDots}

        {step === "type" ? (
          <StepType
            form={form}
            setForm={setForm}
            onNext={() => setStep("token")}
          />
        ) : null}

        {step === "token" ? (
          <StepToken
            form={form}
            setForm={setForm}
            onBack={() => setStep("type")}
            onNext={() => setStep("customize")}
          />
        ) : null}

        {step === "customize" ? (
          <StepCustomize
            form={form}
            setForm={setForm}
            onBack={() => setStep("token")}
            onNext={() => setStep("systems")}
          />
        ) : null}

        {step === "systems" ? (
          <StepSystems
            guildId={guildId}
            form={form}
            setForm={setForm}
            onBack={() => setStep("customize")}
            onNext={handleSave}
            saving={saving}
          />
        ) : null}

        {step === "install" ? (
          <StepInstall
            guildId={guildId}
            form={form}
            onBack={() => router.push(`/dashboard/${guildId}`)}
          />
        ) : null}
      </div>
    </div>
  );
}

