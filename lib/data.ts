import { ShieldCheck, Gamepad2, Building2, Users } from "lucide-react";
import { Ticket, Gift, Activity, Trophy } from "lucide-react";
import { LucideIcon } from "lucide-react";

type Bot = {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
}

type BotSystem = {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
}

export const bots: Bot[] = [
  {
    id: "torcida",
    name: "Torcida Bot",
    description: "Gestão completa para torcidas organizadas",
    icon: ShieldCheck,
  },
  {
    id: "fivem",
    name: "FiveM Bot",
    description: "Automação para servidores RP",
    icon: Gamepad2,
  },
  {
    id: "faccao",
    name: "Facção Bot",
    description: "Controle de facções",
    icon: Building2,
  },
  {
    id: "corporacao",
    name: "Corporação Bot",
    description: "Gestão de equipes",
    icon: Users,
  },
];

export const systems: BotSystem[] = [
  {
    id: "ticket",
    name: "Sistema de Tickets",
    description: "Gerencie suportes e chamados automaticamente",
    icon: Ticket,
  },
  {
    id: "sorteio",
    name: "Sistema de Sorteios",
    description: "Crie sorteios incríveis para sua comunidade",
    icon: Gift,
  },
  {
    id: "logs",
    name: "Sistema de Logs",
    description: "Registre todas as ações do servidor",
    icon: Activity,
  },
  {
    id: "ranking",
    name: "Sistema de Ranking",
    description: "Classifique membros por atividade",
    icon: Trophy,
  },
];
