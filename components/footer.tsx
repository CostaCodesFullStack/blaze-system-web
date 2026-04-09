import Link from "next/link";
import { Flame, Github} from "lucide-react";
import { FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
              <Flame className="w-4 h-4 text-white" />
            </span>
            <span className="font-bold text-base text-foreground">
              Blaze<span className="text-primary">System</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Automatize e gerencie sua torcida no Discord com a melhor plataforma
            do Brasil.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Produto
          </p>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Início
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Planos
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Redes sociais
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/CostaCodesFullStack"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://discord.gg/RXDEBXj4Tr"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Discord"
            >
              <FaDiscord className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BlazeSystem. Todos os direitos reservados.
      </div>
    </footer>
  );
}
