import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";

import type { Provider } from "next-auth/providers";
import { compareSync } from "bcrypt-ts-edge";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { type: "email" },
      password: { type: "password" },
    },
    authorize: async (credentials) => {
      if (credentials === null) return null;

      // Find user in database
      const user = await prisma.user.findFirst({
        where: { email: credentials.email as string },
      });

      // Check if user exists and if the password matches
      if (user && user.password) {
        const isMatch = compareSync(
          credentials.password as string,
          user.password
        );

        // If password is correct, return user
        if (isMatch) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      }

      // If user does not exist or password is incorrect, return null
      return null;
    },
  }),
];

const config: NextAuthConfig = {
  providers,
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token, trigger }) {
      // Set the user ID from the token
      session.user.id = token.sub!;

      // If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = token.name;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
