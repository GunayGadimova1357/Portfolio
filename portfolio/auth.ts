import type {NextAuthOptions} from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!adminEmail || !adminPassword) {
          throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured.");
        }

        if (email !== adminEmail || password !== adminPassword) {
          return null;
        }

        return {
          id: "admin",
          email: adminEmail,
          name: "Admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user?.email) {
        token.email = user.email;
      }

      return token;
    },
    async session({session, token}) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/en/dashboard/login",
  },
};

const handler = NextAuth(authOptions);

export {handler};
