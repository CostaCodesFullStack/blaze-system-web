"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifySession() {
      try {
        if (!searchParams.session_id) {
          setError("Session ID não encontrado");
          setIsLoading(false);
          return;
        }

        // Você pode fazer uma chamada opcional para validar no backend
        // Por enquanto, apenas confirmamos o sucesso
        setSubscriptionData({
          sessionId: searchParams.session_id,
          message: "Seu pagamento foi processado com sucesso!",
        });
      } catch (err) {
        setError("Erro ao verificar pagamento");
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, [searchParams.session_id]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-3xl font-bold mb-2">Erro</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Link href="/pricing">
                <Button>Voltar ao Planos</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="mb-4 flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2 text-foreground">
                Pagamento Confirmado!
              </h1>

              <p className="text-muted-foreground mb-8">
                Sua assinatura foi ativada com sucesso. Você já pode usar todos
                os recursos do plano contratado.
              </p>

              <div className="bg-card border border-border rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold mb-3 text-foreground">
                  O que acontece agora:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✅ Seu bot está pronto para usar</li>
                  <li>✅ Todos os recursos estão desbloqueados</li>
                  <li>✅ Renovação automática no próximo ciclo</li>
                  <li>✅ Acesso ao suporte prioritário</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Link href="/dashboard">
                  <Button className="w-full flex items-center justify-center gap-2">
                    Ir ao Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/pricing">
                  <Button variant="outline" className="w-full">
                    Voltar ao Planos
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                Session ID: {subscriptionData?.sessionId?.slice(0, 20)}...
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}