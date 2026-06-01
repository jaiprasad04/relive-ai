import prisma from "../prisma";

/**
 * Get user details including credits.
 */
export async function getUser(userId) {
  if (!userId) return null;
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      credits: true,
    },
  });
}

/**
 * Deduct credits from a user.
 * Returns true if successful, false otherwise.
 */
export async function deductCredits(userId, amount) {
  if (!userId || amount <= 0) return false;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < amount) {
      return false;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });

    return true;
  } catch (error) {
    console.error(`[USER SERVICE] Error deducting credits for ${userId}:`, error);
    return false;
  }
}

/**
 * Add/Refund credits to a user.
 */
export async function addCredits(userId, amount) {
  if (!userId || amount <= 0) return false;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: amount,
        },
      },
    });
    return true;
  } catch (error) {
    console.error(`[USER SERVICE] Error adding credits for ${userId}:`, error);
    return false;
  }
}
