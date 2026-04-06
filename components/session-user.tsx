"use client";

import { useSession } from "next-auth/react";

export default function SessionUser() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-sm text-muted-foreground">Carregando sessao...</p>;
  }

  if (!session?.user) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum usuario autenticado no cliente.
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Sessao no cliente: {session.user.name ?? session.user.email}
    </p>
  );
}
