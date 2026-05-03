import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { prisma } from "./db";

export const auth0 = new Auth0Client();

/**
 * Helper to get both Auth0 session and the corresponding database user
 */
export const getDbSession = async () => {
  const session = await auth0.getSession();
  if (!session?.user) return null;

  const db_user = await prisma.user.findUnique({
    where: {
      email: session.user.email as string,
    },
  });

  if (!db_user) {
    // Optionally create user if they don't exist in DB yet
    const newUser = await prisma.user.create({
      data: {
        email: session.user.email as string,
        name: session.user.name as string,
        image: session.user.picture as string,
      },
    });
    return { ...session, user: { ...session.user, id: newUser.id } };
  }

  return { ...session, user: { ...session.user, id: db_user.id } };
};
