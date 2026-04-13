import Link from "next/link";
import type { Subscription } from "@prisma/client";
import { CreditCard, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { isSubscriptionActive } from "@/lib/plan";

type PlanGateProps = {
  subscription: Subscription | null;
};

export default function PlanGate({ subscription }: PlanGateProps) {
  const inactiveButHadBilling =
    Boolean(subscription) && !isSubscriptionActive(subscription);
  const title = inactiveButHadBilling
    ? "Plano inativo ou expirado"
    : "Você precisa de um plano para usar o sistema";
  const description = inactiveButHadBilling
    ? "Renove sua assinatura para voltar a gerenciar servidores e configurações do bot."
    : "Assine um plano para acessar o painel, salvar configurações por servidor e preparar a integração com o Discord.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-xl">
            <Link href="/pricing">Ver planos</Link>
          </Button>
          {inactiveButHadBilling && subscription?.stripeCustomerId ? (
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/api/stripe/customer-portal" prefetch={false}>
                <CreditCard className="mr-2 h-4 w-4" />
                Gerenciar assinatura
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
