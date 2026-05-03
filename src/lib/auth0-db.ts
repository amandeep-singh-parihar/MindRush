import { auth0 } from "./auth0";
import { prisma } from "./db";

/**
 * Helper to get both Auth0 session and the corresponding database user.
 * This should ONLY be used in Server Components/Actions, NOT in middleware.
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
