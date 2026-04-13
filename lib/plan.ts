import { NextResponse } from "next/server";
import type { Subscription } from "@prisma/client";

import { PLAN_REQUIRED_ERROR, SERVER_LIMIT_ERROR } from "@/lib/plan-errors";
import { prisma } from "@/lib/prisma";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export function isSubscriptionActive(
  subscription: Subscription | null,
): boolean {
  if (!subscription) {
    return false;
  }
  if (!subscription.plan || !ACTIVE_STATUSES.has(subscription.status)) {
    return false;
  }
  if (
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd.getTime() <= Date.now()
  ) {
    return false;
  }
  return true;
}

export function getServerLimitForPlan(plan: string): number {
  switch (plan) {
    case "basic":
      return 1;
    case "pro":
      return 3;
    case "elite":
      return Number.POSITIVE_INFINITY;
    default:
      return 0;
  }
}

export type RequireActivePlanResult =
  | { ok: true; subscription: Subscription }
  | { ok: false; response: NextResponse };

export async function requireActivePlan(
  userId: string,
): Promise<RequireActivePlanResult> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription || !isSubscriptionActive(subscription)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: PLAN_REQUIRED_ERROR },
        { status: 403 },
      ),
    };
  }

  return { ok: true, subscription };
}

export function serverLimitExceededResponse() {
  return NextResponse.json(
    { success: false, error: SERVER_LIMIT_ERROR },
    { status: 403 },
  );
}
