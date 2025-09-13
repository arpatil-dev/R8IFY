import prisma from '../config/db.js';

// ✅ Update rating
export const updateRating = async (ratingId, userId, newRating) => {
  if (newRating < 1 || newRating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const existingRating = await prisma.rating.findUnique({ where: { id: ratingId } });

  if (!existingRating) {
    throw new Error("Rating not found");
  }

  if (existingRating.userId !== userId) {
    throw new Error("You can only update your own ratings");
  }

  return await prisma.rating.update({
    where: { id: ratingId },
    data: { value: newRating },
    include: {
      user: { select: { id: true, name: true, email: true } },
      store: { select: { id: true, name: true } }
    }
  });
};

// ✅ Delete rating
export const deleteRating = async (ratingId, userId) => {
  const existingRating = await prisma.rating.findUnique({ where: { id: ratingId } });

  if (!existingRating) {
    throw new Error("Rating not found");
  }

  if (existingRating.userId !== userId) {
    throw new Error("You can only delete your own ratings");
  }

  return await prisma.rating.delete({ where: { id: ratingId } });
};

// ✅ Get all ratings for a user
export const getRatingsByUser = async (userId) => {
  // Check if user exists
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    throw new Error("User not found");
  }

  return await prisma.rating.findMany({
    where: { userId },
    include: {
      store: { select: { id: true, name: true, address: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};
