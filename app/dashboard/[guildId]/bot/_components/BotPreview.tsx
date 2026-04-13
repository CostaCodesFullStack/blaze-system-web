"use client";

import { cn } from "@/lib/utils";

type BotPreviewProps = {
  botName?: string;
  botAvatar?: string;
  embedColor?: string;
  embedText?: string;
  embedBanner?: string;
};

function safeHexColor(input: string | undefined) {
  if (!input) return "#5865F2";
  return /^#[0-9A-Fa-f]{6}$/.test(input) ? input : "#5865F2";
}

export default function BotPreview({
  botName,
  botAvatar,
  embedColor,
  embedText,
  embedBanner,
}: BotPreviewProps) {
  const color = safeHexColor(embedColor);
  const name = botName?.trim() || "Seu bot";
  const text = embedText?.trim() || "Seu texto aparece aqui...";

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="mb-3 text-sm font-semibold text-foreground">Pré-visualização</p>

      <div className="rounded-lg bg-[#313338] p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-[#4e5058]">
            {botAvatar ? (
              <img
                src={botAvatar}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-white">
                {name}
              </span>
              <span className="rounded-[6px] bg-[#5865F2] px-1.5 py-0.5 text-[10px] font-bold text-white">
                BOT
              </span>
            </div>

            <div className="mt-3 flex">
              <div
                className="w-1.5 flex-shrink-0 rounded-l-md"
                style={{ backgroundColor: color }}
              />
              <div className="min-w-0 flex-1 rounded-r-md bg-[#2b2d31]">
                {embedBanner ? (
                  <div className="overflow-hidden rounded-tr-md">
                    <img
                      src={embedBanner}
                      alt="Banner"
                      className="h-28 w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className={cn("p-3", embedBanner ? "pt-3" : "pt-3")}>
                  <p className="whitespace-pre-wrap break-words text-sm text-[#dbdee1]">
                    {text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

