import { stripe } from "./stripe";
import { prisma } from "@/lib/prisma";

/**
 * Cria ou retorna customer Stripe existente
 * Evita duplicação
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  userEmail: string
) {
  try {
    // Verificar se já tem subscription com stripeCustomerId
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription?.stripeCustomerId) {
      return existingSubscription.stripeCustomerId;
    }

    // Criar novo customer no Stripe
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: {
        userId,
      },
    });

    return customer.id;
  } catch (error) {
    console.error("❌ Erro ao obter/criar Stripe customer:", error);
    throw error;
  }
}

/**
 * Salva ou atualiza subscription no banco
 */
export async function saveSubscription(data: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: string;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}) {
  try {
    const subscription = await prisma.subscription.upsert({
      where: { userId: data.userId },
      update: {
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        plan: data.plan,
        status: data.status,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
      },
      create: {
        userId: data.userId,
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        plan: data.plan,
        status: data.status,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
      },
    });

    return subscription;
  } catch (error) {
    console.error("❌ Erro ao salvar subscription:", error);
    throw error;
  }
}

/**
 * Busca subscription do usuário
 */
export async function getUserSubscription(userId: string) {
  try {
    return await prisma.subscription.findUnique({
      where: { userId },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar subscription:", error);
    throw error;
  }
}
