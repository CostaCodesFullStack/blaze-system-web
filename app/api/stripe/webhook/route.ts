import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    // 🔐 Validar assinatura do webhook
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Erro na validação do webhook:", err);
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ✅ PAGAMENTO CONFIRMADO
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // 📝 Dados vêm do metadata do checkout
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!userId) {
          console.warn("⚠️ userId não encontrado no webhook");
          break;
        }

        // 💾 Salvar/atualizar subscription no banco
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            plan,
            status: "active",
          },
          create: {
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            plan,
            status: "active",
          },
        });

        console.log("✅ Assinatura ativa:", {
          userId,
          plan,
          subscriptionId,
        });

        break;
      }

      // ❌ PAGAMENTO FALHOU
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        const subscriptionId = invoice.subscription as string;

        // Buscar subscription pelo stripeCustomerId
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            status: "past_due",
          },
        });

        const subscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        console.error("❌ Pagamento falhou:", {
          customerId,
          subscriptionId,
          userId: subscription?.userId,
        });

        break;
      }

      // 🗑️ ASSINATURA CANCELADA
      case "customer.subscription.deleted": {
        const subscriptionData = event.data.object as any;
        const customerId = subscriptionData.customer as string;

        await prisma.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            status: "canceled",
            stripeSubscriptionId: null,
          },
        });

        console.log("🗑️ Assinatura cancelada:", customerId);

        break;
      }

      // 🔄 PERÍODO ATUALIZADO
      case "customer.subscription.updated": {
        const subscriptionData = event.data.object as any;
        const customerId = subscriptionData.customer as string;

        // Mapear status do Stripe para nosso banco
        const statusMap: Record<string, string> = {
          active: "active",
          past_due: "past_due",
          unpaid: "unpaid",
          canceled: "canceled",
          incomplete: "incomplete",
        };

        const status = statusMap[subscriptionData.status] || subscriptionData.status;

        await prisma.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            status,
            currentPeriodStart: new Date(
              subscriptionData.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
            cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
          },
        });

        console.log("🔄 Assinatura atualizada:", customerId);

        break;
      }

      default:
        console.log(`📨 Evento ignorado: ${event.type}`);
    }
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
