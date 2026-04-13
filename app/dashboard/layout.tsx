import { redirect } from "next/navigation";

import { auth } from "@/auth";
import DashboardSidebar from "@/components/dashboard-sidebar";
import PlanGate from "@/components/plan-gate";
import { isSubscriptionActive } from "@/lib/plan";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!isSubscriptionActive(subscription)) {
    return <PlanGate subscription={subscription} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="ml-64 min-h-screen flex-1">{children}</main>
    </div>
  );
}
