"use client";

import { XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Checkout Cancelado
          </h1>

          <p className="text-muted-foreground mb-8">
            Você cancelou o processo de checkout. Sua assinatura não foi
            ativada.
          </p>

          <div className="bg-card border border-border rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-3 text-foreground">Próximas ações:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>💳 Nenhum valor foi cobrado</li>
              <li>🔄 Você pode tentar novamente quando quiser</li>
              <li>📧 Dúvidas? Entre em contato com o suporte</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Link href="/pricing">
              <Button className="w-full flex items-center justify-center gap-2">
                Voltar aos Planos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="https://discord.gg/RXDEBXj4Tr" target="_blank">
              <Button variant="outline" className="w-full">
                Suporte no Discord
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Se você experimentou algum problema, avise-nos no Discord.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}