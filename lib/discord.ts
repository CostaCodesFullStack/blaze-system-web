const DISCORD_ADMIN_PERMISSION = BigInt(0x8);

type DiscordGuildApiResponse = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
};

export type DiscordGuild = {
  id: string;
  name: string;
  icon: string | null;
  iconUrl: string | null;
  owner: boolean;
  permissions: string;
};

export type DiscordRole = {
  id: string;
  name: string;
  color: number;
  position: number;
};

export type DiscordChannel = {
  id: string;
  name: string;
  type: number;
  parent_id: string | null;
};

function hasAdministratorPermission(permissions: string) {
  try {
    return (
      (BigInt(permissions) & DISCORD_ADMIN_PERMISSION) ===
      DISCORD_ADMIN_PERMISSION
    );
  } catch {
    return false;
  }
}

function getGuildIconUrl(guildId: string, icon: string | null) {
  if (!icon) {
    return null;
  }

  const extension = icon.startsWith("a_") ? "gif" : "png";

  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.${extension}`;
}

const GUILD_CACHE_TTL_MS = 5 * 60 * 1000;
const adminGuildsCache = new Map<
  string,
  { guilds: DiscordGuild[]; expiresAt: number }
>();

export async function getAdminDiscordGuilds(accessToken: string) {
  const now = Date.now();
  const cached = adminGuildsCache.get(accessToken);
  if (cached && cached.expiresAt > now) {
    return cached.guilds;
  }

  const response = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Discord guild fetch failed with status ${response.status}`,
    );
  }

  const guilds = (await response.json()) as DiscordGuildApiResponse[];

  const result = guilds
    .filter(
      (guild) => guild.owner || hasAdministratorPermission(guild.permissions),
    )
    .map((guild) => ({
      ...guild,
      iconUrl: getGuildIconUrl(guild.id, guild.icon),
    }))
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));

  adminGuildsCache.set(accessToken, {
    guilds: result,
    expiresAt: now + GUILD_CACHE_TTL_MS,
  });

  return result;
}

export async function getAuthorizedDiscordGuild(
  accessToken: string,
  guildId: string,
) {
  const guilds = await getAdminDiscordGuilds(accessToken);

  return guilds.find((guild) => guild.id === guildId) ?? null;
}

export async function getGuildRoles(
  guildId: string,
  accessToken: string,
): Promise<DiscordRole[]> {
  const response = await fetch(
    `https://discord.com/api/guilds/${guildId}/roles`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Discord roles fetch failed with status ${response.status}`,
    );
  }

  const roles = (await response.json()) as DiscordRole[];

  // Filtrar o @everyone e ordenar por posição (decrescente)
  return roles
    .filter((role) => role.name !== "@everyone")
    .sort((a, b) => b.position - a.position);
}

export async function getGuildChannels(
  guildId: string,
  accessToken: string,
): Promise<DiscordChannel[]> {
  const response = await fetch(
    `https://discord.com/api/guilds/${guildId}/channels`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Discord channels fetch failed with status ${response.status}`,
    );
  }

  const channels = (await response.json()) as DiscordChannel[];

  // Filtrar apenas canais de texto (type 0) que não são thread
  return channels
    .filter((channel) => channel.type === 0)
    .sort((a, b) => {
      // Se um está em categoria e outro não, o sem categoria vem primeiro
      if ((a.parent_id === null) !== (b.parent_id === null)) {
        return a.parent_id === null ? -1 : 1;
      }
      // Depois ordena por nome
      return a.name.localeCompare(b.name, "pt-BR");
    });
}
