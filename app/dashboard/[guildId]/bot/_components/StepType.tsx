"use client";

import { cn } from "@/lib/utils";
import type { BotWizardForm } from "../page";

type StepTypeProps = {
  form: BotWizardForm;
  setForm: React.Dispatch<React.SetStateAction<BotWizardForm>>;
  onNext: () => void;
};

const options = [
  {
    id: "torcida" as const,
    title: "⚽ Bot de Torcida",
    description: "Servidores de times, esportes e fãs",
  },
  {
    id: "fivem_server" as const,
    title: "🖥️ Bot de Servidor FiveM",
    description: "Whitelist, status, players online",
  },
  {
    id: "fivem_faccao" as const,
    title: "🔫 Bot de Facção FiveM",
    description: "Hierarquia, recrutamento, gestão de membros",
  },
];

export default function StepType({ form, setForm, onNext }: StepTypeProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">
          Qual tipo de bot você quer configurar?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Escolha o perfil para ajustar as próximas etapas automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {options.map((opt) => {
          const selected = form.botType === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, botType: opt.id }));
                onNext();
              }}
              className={cn(
                "rounded-2xl border p-5 text-left transition-all",
                "hover:border-primary/40 hover:bg-primary/5",
                selected
                  ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(254,83,0,0.08)]"
                  : "border-border bg-background",
              )}
            >
              <p className="text-sm font-semibold text-foreground">{opt.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

