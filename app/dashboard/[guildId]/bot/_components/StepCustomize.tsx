"use client";

import type { BotWizardForm } from "../page";
import BotPreview from "./BotPreview";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type StepCustomizeProps = {
  form: BotWizardForm;
  setForm: React.Dispatch<React.SetStateAction<BotWizardForm>>;
  onNext: () => void;
  onBack: () => void;
};

export default function StepCustomize({
  form,
  setForm,
  onNext,
  onBack,
}: StepCustomizeProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Personalização</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ajuste nome, avatar e embed. Você verá a prévia em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Nome do bot
              </label>
              <Input
                value={form.botName}
                maxLength={32}
                placeholder="nome atual do bot"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, botName: e.target.value }))
                }
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Máximo de 32 caracteres.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                URL do avatar
              </label>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                  {form.botAvatar ? (
                    <img
                      src={form.botAvatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <Input
                  type="url"
                  value={form.botAvatar}
                  placeholder="https://..."
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, botAvatar: e.target.value }))
                  }
                  className="flex-1 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Cor do embed
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.embedColor || "#5865F2"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, embedColor: e.target.value }))
                  }
                  className={cn(
                    "h-10 w-12 cursor-pointer rounded-xl border border-border bg-background p-1",
                  )}
                />
                <Input
                  value={form.embedColor}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, embedColor: e.target.value }))
                  }
                  placeholder="#5865F2"
                  className="w-40 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Texto do embed
              </label>
              <Textarea
                value={form.embedText}
                maxLength={500}
                placeholder='Ex: Bem-vindo {user}!'
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, embedText: e.target.value }))
                }
                className="min-h-28 rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Dica: use <span className="font-mono">{`{user}`}</span> para
                mencionar.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                URL do banner
              </label>
              <Input
                type="url"
                value={form.embedBanner}
                placeholder="https://..."
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, embedBanner: e.target.value }))
                }
                className="rounded-xl"
              />
              {form.embedBanner ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  <img
                    src={form.embedBanner}
                    alt="Banner"
                    className="h-28 w-full object-cover"
                  />
                </div>
              ) : null}
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
            <Button type="button" onClick={onNext} className="rounded-xl">
              Continuar
            </Button>
          </div>
        </div>

        <BotPreview
          botName={form.botName}
          botAvatar={form.botAvatar}
          embedColor={form.embedColor}
          embedText={form.embedText}
          embedBanner={form.embedBanner}
        />
      </div>
    </div>
  );
}

