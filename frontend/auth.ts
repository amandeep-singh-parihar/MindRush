import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
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
  pages: {
    error: "/", // on error redirects to home
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // On first sign-in, persist the profile image from Google into the token
      if (account?.provider === "google" && profile) {
        token.picture = (profile as any).picture ?? token.picture;
      }
      if (user?.image) {
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the image from the token to the session
      if (session.user) {
        session.user.image = (token.picture as string) ?? session.user.image;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl) || url.startsWith("/")) {
        const parsedUrl = new URL(url, baseUrl);
        if (parsedUrl.pathname === "/" && parsedUrl.searchParams.has("error")) {
          return baseUrl; // Redirect to clean homepage
        }
        return url;
      }
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
});
