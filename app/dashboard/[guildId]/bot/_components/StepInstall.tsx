"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type { BotWizardForm } from "../page";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StepInstallProps = {
  form: BotWizardForm;
  guildId: string;
  onBack?: () => void;
};

export default function StepInstall({ form, guildId }: StepInstallProps) {
  const [activating, setActivating] = useState(false);
  const [active, setActive] = useState(false);

  const installUrl = useMemo(() => {
    const params = new URLSearchParams({
      client_id: form.botClientId || "",
      permissions: "8",
      scope: "bot applications.commands",
      guild_id: guildId,
    });

    return `https://discord.com/oauth2/authorize?${params.toString()}`;
  }, [form.botClientId, guildId]);

  async function activate() {
    try {
      await fetch("/api/bot/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guildId }),
      });
      setActive(true);
    } catch {
      // Se falhar, o usuário ainda pode tentar novamente.
    } finally {
      setActivating(false);
    }
  }

  function handleInstall() {
    if (!form.botClientId) {
      return;
    }

    window.open(installUrl, "_blank", "width=500,height=700");
    setActivating(true);
    setActive(false);
  }

  useEffect(() => {
    if (!activating) return;
    const t = window.setTimeout(() => {
      void activate();
    }, 4000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activating]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Instalação</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Adicione o bot no servidor e finalize a ativação.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5">
        <p className="text-sm font-semibold text-foreground">
          Link de instalação
        </p>
        <p className="mt-2 break-all text-xs text-muted-foreground">
          {installUrl}
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            onClick={handleInstall}
            disabled={!form.botClientId || activating}
            className="rounded-xl"
          >
            {activating ? "Aguardando..." : "Adicionar bot ao servidor"}
          </Button>

          <span
            className={cn(
              "text-sm font-semibold",
              active ? "text-green-400" : "text-muted-foreground",
            )}
          >
            {active ? "Bot ativo ✅" : "Ainda não ativado"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href={`/dashboard/${guildId}`}>Voltar ao dashboard</Link>
        </Button>

        <Button asChild variant="ghost" className="rounded-xl">
          <Link href="/dashboard">Voltar para servidores</Link>
        </Button>
      </div>
    </div>
  );
}

