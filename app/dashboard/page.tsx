import Link from "next/link"
import { ArrowRight, Crown, Users } from "lucide-react"

const servers = [
  {
    id: "1",
    name: "Torcida Sangue Azul",
    members: 1240,
    plan: "Pro",
    icon: "S",
    color: "#fe5300",
  },
  {
    id: "2",
    name: "Fiel Torcida Oficial",
    members: 875,
    plan: "Básico",
    icon: "F",
    color: "#3b82f6",
  },
  {
    id: "3",
    name: "Bando de Loucos FC",
    members: 530,
    plan: "Pro",
    icon: "B",
    color: "#22c55e",
  },
  {
    id: "4",
    name: "Máfia Azul Grêmio",
    members: 320,
    plan: "Sem plano",
    icon: "M",
    color: "#8b5cf6",
  },
]

const planBadge: Record<string, string> = {
  Pro: "bg-primary/15 text-primary",
  Básico: "bg-blue-500/15 text-blue-400",
  "Sem plano": "bg-muted text-muted-foreground",
}

export default function DashboardPage() {
  return (
    <div className="px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Meus Servidores</h1>
        <p className="text-sm text-muted-foreground">
          Selecione um servidor para gerenciar as configurações do bot.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Servidores", value: servers.length },
          { label: "Membros totais", value: servers.reduce((a, s) => a + s.members, 0).toLocaleString("pt-BR") },
          { label: "Planos ativos", value: servers.filter((s) => s.plan !== "Sem plano").length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl border border-border bg-card flex flex-col gap-1"
          >
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Server grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {servers.map((server) => (
          <div
            key={server.id}
            className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_20px_rgba(254,83,0,0.08)] transition-all duration-300 flex flex-col gap-5"
          >
            {/* Server info */}
            <div className="flex items-center gap-4">
              <span
                className="flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-base flex-shrink-0"
                style={{ backgroundColor: server.color }}
              >
                {server.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground text-sm truncate">{server.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {server.members.toLocaleString("pt-BR")} membros
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${planBadge[server.plan]}`}
              >
                {server.plan === "Pro" && <Crown className="w-3 h-3 inline mr-1" />}
                {server.plan}
              </span>
            </div>

            {/* Action */}
            <Link
              href={`/dashboard/${server.id}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group-hover:border-primary/40"
            >
              Gerenciar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
