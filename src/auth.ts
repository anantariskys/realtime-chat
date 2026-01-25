import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

export const dummyUsers = [
  {
    id: "user-1",
    name: "Alice",
    email: "alice@example.com",
    password: "password",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    phoneNumber: "081234567890",
  },
  {
    id: "user-2",
    name: "Bob",
    email: "bob@example.com",
    password: "password",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    phoneNumber: "089876543210",
  },
  {
    id: "user-3",
    name: "Charlie",
    email: "charlie@example.com",
    password: "password",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    phoneNumber: "085555555555",
  },
];

import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = dummyUsers.find((u) => u.email === email);

          if (!user) return null;
          if (user.password !== password) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        const user = dummyUsers.find((u) => u.id === token.sub);
        if (user) {
            // @ts-ignore
            session.user.phoneNumber = user.phoneNumber;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
        if (user) {
            token.sub = user.id;
        }
        return token;
    }
  },
  pages: {
    signIn: "/login",
  },
};

export const auth = () => getServerSession(authOptions);
