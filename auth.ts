import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import type { DiscordProfile } from "@auth/core/providers/discord";

function getStringClaim(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function getNullableStringClaim(value: unknown) {
  return typeof value === "string" ? value : null;
}

function getNullableBooleanClaim(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, profile, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      if (profile) {
        const discordProfile = profile as DiscordProfile;

        token.discordId = discordProfile.id;
        token.username = discordProfile.username;
        token.globalName = discordProfile.global_name;
        token.discriminator = discordProfile.discriminator;
        token.locale = discordProfile.locale;
        token.verified = discordProfile.verified;
      }

      return token;
    },
    session({ session, token }) {
      if (!session.user) {
        return session;
      }

      session.user.id =
        getStringClaim(token.discordId) ?? getStringClaim(token.sub) ?? "";
      session.user.username = getNullableStringClaim(token.username);
      session.user.globalName = getNullableStringClaim(token.globalName);
      session.user.discriminator = getNullableStringClaim(
        token.discriminator,
      );
      session.user.locale = getNullableStringClaim(token.locale);
      session.user.verified = getNullableBooleanClaim(token.verified);
      session.accessToken = getStringClaim(token.accessToken);

      return session;
    },
  },
});
