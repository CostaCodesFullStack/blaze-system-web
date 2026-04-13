import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      username: string | null;
      globalName: string | null;
      discriminator: string | null;
      locale: string | null;
      verified: boolean | null;
    };
  }

  interface User {
    id: string;
    username?: string | null;
    globalName?: string | null;
    discriminator?: string | null;
    locale?: string | null;
    verified?: boolean | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    discordId?: string;
    email?: string;
    username?: string | null;
    globalName?: string | null;
    discriminator?: string | null;
    locale?: string | null;
    verified?: boolean | null;
  }
}

export {};
