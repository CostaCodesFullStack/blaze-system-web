"use client";

import { useMemo, useState } from "react";

import type { BotWizardForm } from "../page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type StepTokenProps = {
  form: BotWizardForm;
  setForm: React.Dispatch<React.SetStateAction<BotWizardForm>>;
  onNext: () => void;
  onBack: () => void;
};

type ValidateTokenResponse =
  | {
      valid: true;
      botId: string;
      botUsername: string;
      botAvatar: string | null;
    }
  | { valid: false };

export default function StepToken({
  form,
  setForm,
  onNext,
  onBack,
}: StepTokenProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidateTokenResponse | null>(null);

  const validated = useMemo(() => result?.valid === true, [result]);

  async function handleValidate() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/bot/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botToken: form.botToken }),
      });

      const data = (await res.json().catch(() => null)) as ValidateTokenResponse | null;

      if (!data || typeof data !== "object" || !("valid" in data)) {
        setResult({ valid: false });
        return;
      }

      if (data.valid) {
        setResult(data);
        setForm((prev) => ({
          ...prev,
          botClientId: data.botId,
          botAvatar: data.botAvatar ?? prev.botAvatar,
          botName: prev.botName || data.botUsername,
        }));
      } else {
        setResult({ valid: false });
      }
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">
          Conecte o seu bot do Discord
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Você vai criar um Application no Discord Developer Portal e colar o
          token do bot aqui.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-sm font-semibold text-foreground">
            Instruções (3 passos)
          </p>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Passo 1:</span>{" "}
              Acesse{" "}
              <a
                href="https://discord.com/developers/applications"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4"
              >
                discord.com/developers/applications
              </a>
            </li>
            <li>
              <span className="font-medium text-foreground">Passo 2:</span> Crie
              um Application → vá em &quot;Bot&quot;
            </li>
            <li>
              <span className="font-medium text-foreground">Passo 3:</span>{" "}
              Clique em &quot;Reset Token&quot; e copie
            </li>
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <label className="text-sm font-medium text-foreground">
            Token do bot
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            O token é confidencial. Não compartilhe com ninguém.
          </p>

          <div className="mt-3 flex flex-col gap-3">
            <Input
              type="password"
              value={form.botToken}
              onChange={(e) => {
                const value = e.target.value;
                setForm((prev) => ({ ...prev, botToken: value }));
                setResult(null);
              }}
              placeholder="Cole aqui o token do bot"
              className="rounded-xl"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                onClick={handleValidate}
                disabled={loading || form.botToken.length === 0}
                className="rounded-xl"
              >
                {loading ? "Verificando..." : "Verificar token"}
              </Button>

              {result?.valid === true ? (
                <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2">
                  <div className="h-9 w-9 overflow-hidden rounded-full bg-muted">
                    {result.botAvatar ? (
                      <img
                        src={result.botAvatar}
                        alt={result.botUsername}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-green-400">
                      {result.botUsername}
                    </p>
                    <p className="text-xs text-muted-foreground">Token válido</p>
                  </div>
                </div>
              ) : result?.valid === false ? (
                <p className="text-sm font-semibold text-destructive">
                  Token inválido
                </p>
              ) : null}
            </div>

            <div className="mt-2 flex items-center justify-between">
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
                onClick={onNext}
                disabled={!validated}
                className={cn("rounded-xl", !validated && "opacity-50")}
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

