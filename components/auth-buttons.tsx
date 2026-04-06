"use client";

import { signIn, signOut, useSession } from "next-auth/react";

type AuthButtonsProps = {
  mobile?: boolean;
};

export default function AuthButtons({
  mobile = false,
}: AuthButtonsProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div
        className={
          mobile
            ? "text-sm text-muted-foreground"
            : "text-sm font-medium text-muted-foreground"
        }
      >
        Carregando...
      </div>
    );
  }

  if (session?.user) {
    return (
      <div
        className={
          mobile
            ? "flex flex-col gap-3"
            : "flex items-center gap-3"
        }
      >
        <span className="text-sm font-medium text-foreground">
          Ola, {session.user.name ?? "usuario"}
        </span>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={
            mobile
              ? "rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              : "rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          }
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
      className={
        mobile
          ? "rounded-lg border border-border px-4 py-2 text-center text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          : "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      }
    >
      Entrar com Discord
    </button>
  );
}
