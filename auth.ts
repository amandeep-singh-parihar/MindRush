import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          console.log("Email or Password can't be empty");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          console.log("User not found");
          return null;
        }

        if (!user.password) {
          console.log("Password login is not available for this account");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          console.log("Invalid Password");
          return null;
        }

        console.log("Login successful");
        return {
          ...user,
          id: String(user.id),
        };
      },
    }),
  ],
  // callbacks: {
  //   authorized: async ({ auth }) => {
  //     return !!auth;
  //   },
  // },
  session: {
    strategy: "jwt",
  },
});
