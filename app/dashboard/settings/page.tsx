export default function DashboardSettingsPage() {
  return (
    <div className="px-8 py-10 max-w-3xl">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Área reservada para preferências gerais do painel e da conta.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold text-foreground mb-2">
          Em breve
        </h2>
        <p className="text-sm text-muted-foreground">
          Esta página ainda não possui configurações implementadas, mas a rota
          já está pronta para receber opções do dashboard.
        </p>
      </div>
    </div>
  );
}
