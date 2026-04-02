"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Flame, LayoutDashboard, CreditCard, Settings, LogOut, ChevronRight } from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Servidores" },
  { href: "/pricing", icon: CreditCard, label: "Planos" },
  { href: "/dashboard/settings", icon: Settings, label: "Configurações" },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Flame className="w-5 h-5 text-white" />
          </span>
          <span className="font-bold text-base text-sidebar-foreground">
            Blaze<span className="text-primary">System</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
            U
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">Usuário</p>
            <p className="text-xs text-muted-foreground truncate">usuario@discord.com</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Menu
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-destructive transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sair
        </Link>
      </div>
    </aside>
  )
}
