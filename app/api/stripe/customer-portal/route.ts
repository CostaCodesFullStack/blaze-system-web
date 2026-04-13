import { stripe } from "@/lib/stripe";
import { getUserSubscription } from "@/lib/stripe-service";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🔐 Validar autenticação
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // 👤 Buscar subscription do usuário
    const subscription = await getUserSubscription(session.user.id);

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Nenhuma assinatura encontrada" },
        { status: 404 }
      );
    }

    // 🔗 Criar sessão do billing portal
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: process.env.NEXT_PUBLIC_APP_URL,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("❌ Erro ao criar billing portal:", error);
    return NextResponse.json(
      { error: "Erro ao criar portal de assinatura" },
      { status: 500 }
    );
  }
}
