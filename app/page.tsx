import Link from "next/link";
import {
  ShieldCheck,
  Megaphone,
  AlertTriangle,
  ClipboardList,
  ArrowRight,
  Zap,
  Users,
  Star,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { bots, systems } from "@/lib/data";

const features = [
  {
    icon: ShieldCheck,
    title: "Sistema de Verificação",
    description:
      "Automatize o processo de verificação de membros com cargos e fluxos personalizados.",
  },
  {
    icon: Megaphone,
    title: "Anúncios Automatizados",
    description:
      "Programe e envie anúncios em canais específicos sem precisar estar online.",
  },
  {
    icon: AlertTriangle,
    title: "Sistema de Advertência",
    description:
      "Gerencie advertências, punições e histórico de infrações da sua torcida.",
  },
  {
    icon: ClipboardList,
    title: "Lista de Presença",
    description:
      "Registre e acompanhe a presença dos membros em eventos e reuniões do servidor.",
  },
];

const stats = [
  { value: "24/7", label: "Sempre online" },
  { value: "100%", label: "Gratuito para começar" },
  { value: "Rápido", label: "Setup em minutos" },
];

export default function HeroSection() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[92vh] flex items-center">
          {/* Glow background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(254,83,0,0.18) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-6 py-24 flex flex-col items-center text-center gap-8">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wide">
              <Zap className="w-3.5 h-3.5" />
              Automação completa para Discord
            </span>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-balance leading-[1.08] tracking-tight">
              <span className="text-foreground">Blaze</span>
              <span className="text-primary">System</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Automatize e escale seu servidor Discord com bots e sistemas
              inteligentes
            </p>

            {/* Description */}
            <p className="max-w-xl text-base text-muted-foreground leading-relaxed text-pretty">
              Bots completos e sistemas adicionais para personalizar seu
              servidor
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(254,83,0,0.4)] active:scale-95"
              >
                Começar gratuitamente
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="https://discord.com"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:border-primary/50 hover:text-primary transition-all active:scale-95"
              >
                Adicionar ao Discord
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-extrabold text-primary">
                    {s.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-card border-t border-border">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-14 flex flex-col gap-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                Funcionalidades
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-balance">
                Tudo que seu servidor precisa
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto text-pretty">
                Um conjunto completo de ferramentas para organizar, moderar e
                engajar sua comunidade no Discord.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-border bg-background hover:border-primary/40 hover:shadow-[0_0_24px_rgba(254,83,0,0.1)] transition-all duration-300 flex flex-col gap-4"
                >
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-5 h-5 text-primary" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-foreground text-sm">
                      {f.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Bots Section */}
        <section className="py-24 bg-background border-t border-border">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-14 flex flex-col gap-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                Bots Principais
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-balance">
                Bots completos para qualquer tipo de servidor
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto text-pretty">
                Cada bot foi desenvolvido para resolver desafios específicos na
                gestão da sua comunidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bots.map((bot) => (
                <div
                  key={bot.name}
                  className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_24px_rgba(254,83,0,0.1)] transition-all duration-300 flex flex-col gap-6"
                >
                  <span className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <bot.icon className="w-7 h-7 text-primary" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {bot.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {bot.description}
                    </p>
                  </div>
                  <Link
                    href="#"
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group-hover:gap-3"
                  >
                    Ver detalhes
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Systems Section */}
        <section className="py-24 bg-card border-t border-border">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-14 flex flex-col gap-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                Sistemas Adicionais
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-balance">
                Expanda com sistemas modulares
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto text-pretty">
                Adicione funcionalidades extras para potencializar sua
                comunidade.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {systems.map((system) => (
                <div
                  key={system.name}
                  className="group p-6 rounded-2xl border border-border bg-background hover:border-primary/40 hover:shadow-[0_0_24px_rgba(254,83,0,0.1)] transition-all duration-300 flex flex-col gap-4"
                >
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <system.icon className="w-6 h-6 text-primary" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-foreground">
                      {system.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {system.description}
                    </p>
                  </div>
                  <Link
                    href="#"
                    className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Adicionar
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-12">
            <div className="text-center flex flex-col gap-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                Depoimentos
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-balance">
                O que nossas torcidas dizem
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {[
                {
                  name: "Carlos Lima",
                  role: "Líder da Torcida Sangue Azul",
                  text: "O BlazeSystem transformou nossa organização. A verificação automática economizou horas de trabalho manual toda semana.",
                },
                {
                  name: "Fernanda Souza",
                  role: "Moderadora da Fiel Torcida",
                  text: "Os anúncios automatizados são incríveis. Conseguimos manter nossos membros informados sem esforço.",
                },
                {
                  name: "Rafael Santos",
                  role: "Admin do Bando de Loucos",
                  text: "O sistema de advertências é muito completo. Moderação ficou muito mais fácil e organizada.",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="p-6 rounded-2xl border border-border bg-card flex flex-col gap-4"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {t.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-4xl px-6 text-center flex flex-col items-center gap-6">
            <Users className="w-12 h-12 text-primary" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-balance">
              Pronto para elevar sua torcida?
            </h2>
            <p className="text-muted-foreground max-w-md text-pretty">
              Comece agora e descubra como o BlazeSystem pode transformar a
              gestão do seu servidor Discord.
            </p>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_28px_rgba(254,83,0,0.45)] active:scale-95"
            >
              Começar agora gratuitamente
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
