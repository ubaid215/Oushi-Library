import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { AdminRole } from "@/types";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }

      // On Google sign-in, check if user is an admin
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.adminUser.findUnique({
          where: { email: token.email },
        });

        if (!dbUser) {
          // Only allow pre-existing admin users via OAuth
          return { ...token, error: "not_authorized" };
        }

        token.id = dbUser.id;
        token.role = dbUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === "not_authorized") {
        return { ...session, error: "not_authorized" } as any;
      }

      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as AdminRole;
      }

      return session;
    },
    async signIn({ user, account }) {
      // Block Google users who aren't registered admins
      if (account?.provider === "google") {
        const dbUser = await prisma.adminUser.findUnique({
          where: { email: user.email! },
        });
        return !!dbUser;
      }
      return true;
    },
  },
});
