import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL conectado com sucesso");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Error");
    console.error("   Certifique-se de que o container está rodando:");
    console.error("   docker-compose up -d");
    throw error;
  }
}
