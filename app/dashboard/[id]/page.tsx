"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, ChevronDown, Save } from "lucide-react"

const roles = [
  { id: "r1", label: "@Verificado" },
  { id: "r2", label: "@Membro" },
  { id: "r3", label: "@Torcedor" },
  { id: "r4", label: "@VIP" },
]

const channels = [
  { id: "c1", label: "#anúncios" },
  { id: "c2", label: "#geral" },
  { id: "c3", label: "#verificação" },
  { id: "c4", label: "#eventos" },
]

interface SelectProps {
  options: { id: string; label: string }[]
  value: string
  onChange: (v: string) => void
  placeholder: string
}

function CustomSelect({ options, value, onChange, placeholder }: SelectProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.id === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground hover:border-primary/50 transition-colors focus:outline-none focus:border-primary"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { onChange(opt.id); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary/10 hover:text-primary ${
                value === opt.id ? "bg-primary/10 text-primary font-medium" : "text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ServerManagementPage({ params }: { params: { id: string } }) {
  const [role, setRole] = useState("")
  const [channel, setChannel] = useState("")
  const [saved, setSaved] = useState(false)
  const isActive = params.id !== "4"

  const serverNames: Record<string, string> = {
    "1": "Torcida Sangue Azul",
    "2": "Fiel Torcida Oficial",
    "3": "Bando de Loucos FC",
    "4": "Máfia Azul Grêmio",
  }

  const serverName = serverNames[params.id] ?? "Servidor"

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="px-8 py-10 max-w-2xl">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para servidores
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">{serverName}</h1>
        <p className="text-sm text-muted-foreground">Configure o comportamento do bot neste servidor.</p>
      </div>

      {/* License status */}
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-8 ${
          isActive
            ? "border-green-500/30 bg-green-500/10"
            : "border-destructive/30 bg-destructive/10"
        }`}
      >
        {isActive ? (
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
        )}
        <div>
          <p className={`text-sm font-semibold ${isActive ? "text-green-400" : "text-destructive"}`}>
            Licença {isActive ? "Ativa" : "Expirada"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isActive
              ? "Sua licença está ativa e o bot está funcionando normalmente."
              : "Sua licença expirou. Renove seu plano para continuar usando o bot."}
          </p>
        </div>
        {!isActive && (
          <Link
            href="/pricing"
            className="ml-auto px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            Renovar
          </Link>
        )}
      </div>

      {/* Config form */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card flex flex-col gap-6">
          <h2 className="text-base font-semibold text-foreground">Configurações do Bot</h2>

          {/* Role select */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Cargo verificado
            </label>
            <p className="text-xs text-muted-foreground">
              Cargo atribuído automaticamente após a verificação do membro.
            </p>
            <CustomSelect
              options={roles}
              value={role}
              onChange={setRole}
              placeholder="Selecione um cargo..."
            />
          </div>

          {/* Channel select */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Canal de anúncios
            </label>
            <p className="text-xs text-muted-foreground">
              Canal onde os anúncios automatizados serão enviados.
            </p>
            <CustomSelect
              options={channels}
              value={channel}
              onChange={setChannel}
              placeholder="Selecione um canal..."
            />
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={!isActive}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(254,83,0,0.35)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Salvo com sucesso!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar configurações
            </>
          )}
        </button>
      </form>
    </div>
  )
}
