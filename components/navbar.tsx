"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Flame, Menu, X } from "lucide-react"
import { useState } from "react"

import AuthButtons from "@/components/auth-buttons"

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: "/", label: "Início" },
    { href: "/pricing", label: "Planos" },
    { href: "/dashboard", label: "Dashboard" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Flame className="w-5 h-5 text-white" />
          </span>
          <span className="font-bold text-lg text-foreground tracking-tight">
            Blaze<span className="text-primary">System</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === l.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <AuthButtons />
          <Link
            href="https://discord.com"
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all hover:shadow-[0_0_16px_rgba(254,83,0,0.35)] active:scale-95"
          >
            Adicionar ao Discord
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === l.href ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <AuthButtons mobile />
          <Link
            href="https://discord.com"
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold text-center hover:bg-primary/90 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Adicionar ao Discord
          </Link>
        </div>
      )}
    </header>
  )
}
