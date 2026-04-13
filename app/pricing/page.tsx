"use client";

import { Check, Crown, Zap, Star, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "basic",
    name: "Básico",
    price: "R$ 19,90",
    period: "/mês",
    description: "Ideal para servidores pequenos que estão começando.",
    icon: Zap,
    highlight: false,
    features: [
      "1 servidor Discord",
      "Sistema de verificação",
      "Anúncios manuais",
      "Até 500 membros",
      "Suporte por e-mail",
    ],
    missing: [
      "Anúncios automatizados",
      "Sistema de advertência",
      "Lista de presença",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 39,90",
    period: "/mês",
    description: "A escolha perfeita para torcidas em crescimento.",
    icon: Crown,
    highlight: true,
    features: [
      "3 servidores Discord",
      "Sistema de verificação",
      "Anúncios automatizados",
      "Sistema de advertência",
      "Lista de presença",
      "Até 5.000 membros",
      "Suporte prioritário",
    ],
    missing: [],
  },
  {
    id: "elite",
    name: "Elite",
    price: "R$ 79,90",
    period: "/mês",
    description: "Para grandes torcidas que exigem o máximo de controle.",
    icon: Star,
    highlight: false,
    features: [
      "Servidores ilimitados",
      "Todas as funcionalidades Pro",
      "Membros ilimitados",
      "Integrações avançadas",
      "Logs completos de auditoria",
      "SLA de 99,9% uptime",
      "Suporte VIP 24/7",
    ],
    missing: [],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: string) {
    try {
      setLoading(plan);
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        body: JSON.stringify({ plan }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar sessão de checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao processar o checkout. Tente novamente.");
      setLoading(null);
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="min-h-screen py-24">
          <div className="mx-auto max-w-7xl px-6">
            {/* Header */}
            <div className="text-center mb-16 flex flex-col gap-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                Planos
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-balance">
                Escolha o plano ideal
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto text-pretty">
                Preços simples e transparentes. Cancele quando quiser, sem taxas
                ocultas.
              </p>
            </div>

            {/* Plans grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
                    plan.highlight
                      ? "border-primary bg-card shadow-[0_0_40px_rgba(254,83,0,0.15)]"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full bg-primary text-white text-xs font-bold tracking-wide shadow-lg">
                        Recomendado
                      </span>
                    </div>
                  )}

                  <div className="p-7 flex flex-col gap-6 flex-1">
                    {/* Plan header */}
                    <div className="flex flex-col gap-3">
                      <span
                        className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                          plan.highlight
                            ? "bg-primary text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <plan.icon className="w-5 h-5" />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">
                          {plan.name}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground pb-1">
                        {plan.period}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="flex flex-col gap-3 flex-1">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-3 text-sm text-foreground"
                        >
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 flex-shrink-0">
                            <Check className="w-3 h-3 text-primary" />
                          </span>
                          {f}
                        </li>
                      ))}
                      {plan.missing.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-3 text-sm text-muted-foreground/40 line-through"
                        >
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted flex-shrink-0">
                            <Check className="w-3 h-3 text-muted-foreground/40" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button
                      onClick={() => handleCheckout(plan.id)}
                      disabled={loading !== null}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 w-full ${
                        plan.highlight
                          ? "bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(254,83,0,0.4)]"
                          : "border border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {loading === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          Assinar {plan.name}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ teaser */}
            <div className="mt-16 text-center flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Dúvidas sobre os planos?{" "}
                <a
                  href="https://discord.gg/RXDEBXj4Tr"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Entre em contato pelo Discord
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
