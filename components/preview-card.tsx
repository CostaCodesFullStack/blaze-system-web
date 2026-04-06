"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Zap, MessageSquare, AlertCircle } from "lucide-react";
import { bots, systems } from "@/lib/data";

interface PreviewCardProps {
  selectedBot: string;
  role: string;
  channel: string;
  enabledSystems: string[];
  roleOptions: { id: string; label: string }[];
  channelOptions: { id: string; label: string }[];
}

export function PreviewCard({
  selectedBot,
  role,
  channel,
  enabledSystems,
  roleOptions,
  channelOptions,
}: PreviewCardProps) {
  const selectedBotData = useMemo(
    () => bots.find((b) => b.id === selectedBot),
    [selectedBot],
  );

  const selectedRoleLabel = useMemo(
    () =>
      roleOptions.find((r) => r.id === role)?.label ?? "Cargo não selecionado",
    [role, roleOptions],
  );

  const selectedChannelLabel = useMemo(
    () =>
      channelOptions.find((c) => c.id === channel)?.label ??
      "Canal não selecionado",
    [channel, channelOptions],
  );

  const enabledSystemsData = useMemo(
    () => systems.filter((s) => enabledSystems.includes(s.id)),
    [enabledSystems],
  );

  const previewMessages = useMemo(() => {
    const messages: Array<{
      type: "warning" | "info";
      emoji: string;
      text: string;
    }> = [];

    if (!selectedBotData) return messages;

    // Adicionar mensagem de verificação se não houver cargo selecionado
    if (!role) {
      messages.push({
        type: "warning",
        emoji: "⚠️",
        text: "Selecione um cargo para a verificação",
      });
    } else {
      messages.push({
        type: "info",
        emoji: "✅",
        text: `Novo membro será verificado e receberá ${selectedRoleLabel}`,
      });
    }

    // Adicionar mensagens de sistemas ativados
    if (enabledSystemsData.length > 0) {
      messages.push({
        type: "info",
        emoji: "⚙️",
        text: `Sistema${enabledSystemsData.length > 1 ? "s" : ""} ativado${enabledSystemsData.length > 1 ? "s" : ""}: ${enabledSystemsData.map((s) => s.name).join(", ")}`,
      });
    }

    // Adicionar mensagem de canal de anúncios
    if (!channel) {
      messages.push({
        type: "warning",
        emoji: "📢",
        text: "Selecione um canal para anúncios",
      });
    } else {
      messages.push({
        type: "info",
        emoji: "📢",
        text: `Anúncios serão enviados em ${selectedChannelLabel}`,
      });
    }

    return messages;
  }, [
    selectedBotData,
    role,
    channel,
    enabledSystemsData,
    selectedRoleLabel,
    selectedChannelLabel,
  ]);

  const BotIcon = selectedBotData?.icon;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">
          Preview da Configuração
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Como sua configuração aparecerá no Discord
        </p>
      </div>

      {/* Discord-style Message Preview */}
      <div className="rounded-xl border border-border bg-slate-950 p-4 space-y-4">
        {/* Bot Header */}
        <div className="flex items-center gap-3">
          {BotIcon ? (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
              <BotIcon className="w-6 h-6 text-primary" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          )}
          <div>
            <p className="text-sm font-semibold text-white">
              {selectedBotData?.name ?? "Bot não selecionado"}
            </p>
            <p className="text-xs text-slate-400">Blaze System Bot</p>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-2 border-t border-slate-800 pt-4">
          {previewMessages.length === 0 ? (
            <div className="text-sm text-slate-400 italic">
              Nenhuma configuração ainda...
            </div>
          ) : (
            previewMessages.map((msg, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <span className="text-lg flex-shrink-0">{msg.emoji}</span>
                <p
                  className={cn(
                    "leading-relaxed",
                    msg.type === "warning"
                      ? "text-amber-400"
                      : "text-slate-300",
                  )}
                >
                  {msg.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Configuration Summary */}
        {(role || channel) && (
          <div className="border-t border-slate-800 pt-4 mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Configuração Resumida
            </p>
            <div className="space-y-1 text-xs text-slate-300">
              {role && (
                <p>
                  <span className="text-slate-500">Cargo verificado:</span>{" "}
                  {selectedRoleLabel}
                </p>
              )}
              {channel && (
                <p>
                  <span className="text-slate-500">Canal de anúncios:</span>{" "}
                  {selectedChannelLabel}
                </p>
              )}
              {enabledSystemsData.length > 0 && (
                <p>
                  <span className="text-slate-500">Módulos:</span>{" "}
                  {enabledSystemsData.length}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="mt-4 text-xs text-muted-foreground">
        💡 Dica: configure todos os campos acima para ver o preview completo
      </p>
    </div>
  );
}
