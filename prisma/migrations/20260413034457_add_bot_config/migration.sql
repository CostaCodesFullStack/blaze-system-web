-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "botType" TEXT NOT NULL,
    "botToken" TEXT NOT NULL,
    "botClientId" TEXT NOT NULL,
    "botName" TEXT,
    "botAvatar" TEXT,
    "systems" TEXT[],
    "welcomeChannelId" TEXT,
    "logChannelId" TEXT,
    "autoRoleId" TEXT,
    "embedColor" TEXT DEFAULT '#5865F2',
    "embedText" TEXT,
    "embedBanner" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BotConfig_guildId_idx" ON "BotConfig"("guildId");

-- CreateIndex
CREATE INDEX "BotConfig_isActive_idx" ON "BotConfig"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BotConfig_userId_guildId_key" ON "BotConfig"("userId", "guildId");

-- AddForeignKey
ALTER TABLE "BotConfig" ADD CONSTRAINT "BotConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
