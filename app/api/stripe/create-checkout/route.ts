import { stripe } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/stripe-service";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const VALID_PLANS = ["basic", "pro", "elite"];

export async function POST(req: NextRequest) {
  try {
    // 🔐 Validar autenticação
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { plan } = await req.json();

    // 🛡️ Validar plano
    if (!plan || !VALID_PLANS.includes(plan)) {
      return NextResponse.json(
        { error: "Plano inválido" },
        { status: 400 }
      );
    }

    // 💰 Map preços do Stripe
    const priceMap: Record<string, string> = {
      basic: process.env.STRIPE_PRICE_BASIC!,
      pro: process.env.STRIPE_PRICE_PRO!,
      elite: process.env.STRIPE_PRICE_ELITE!,
    };

    const priceId = priceMap[plan];

    if (!priceId) {
      return NextResponse.json(
        { error: "Configuração de preço inválida" },
        { status: 500 }
      );
    }

    // 👤 Obter ou criar customer Stripe
    const customerId = await getOrCreateStripeCustomer(
      session.user.id,
      session.user.email || `user-${session.user.id}@blaze.local`
    );

    // 🔗 Criar sessão de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      // 📝 Enviar metadata do usuário e plano para o webhook
      metadata: {
        userId: session.user.id,
        plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("❌ Erro ao criar checkout:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de checkout" },
      { status: 500 }
    );
  }
}
