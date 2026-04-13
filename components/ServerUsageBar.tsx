"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type ServerUsageBarProps = {
  used: number;
  limit: number; // -1 = ilimitado
  onUpgrade?: () => void;
};

export default function ServerUsageBar({
  used,
  limit,
  onUpgrade,
}: ServerUsageBarProps) {
  const router = useRouter();

  if (limit === -1) {
    return (
      <div className="mb-8 rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">
          {used} servidores (ilimitado)
        </p>
      </div>
    );
  }

  const safeLimit = Math.max(limit, 0);
  const percent =
    safeLimit === 0 ? 100 : Math.min(100, Math.round((used / safeLimit) * 100));
  const isAtLimit = safeLimit > 0 && used >= safeLimit;

  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">
          {used}/{safeLimit} servidores
        </p>

        {isAtLimit ? (
          <Button
            type="button"
            size="sm"
            onClick={() => (onUpgrade ? onUpgrade() : router.push("/pricing"))}
            className="rounded-lg"
          >
            Fazer upgrade
          </Button>
        ) : null}
      </div>

      <div className="mt-3">
        <Progress
          value={percent}
          className={isAtLimit ? "[&>div]:bg-red-500" : "[&>div]:bg-blue-500"}
        />
      </div>
    </div>
  );
}

