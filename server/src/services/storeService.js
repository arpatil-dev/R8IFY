import prisma from "../config/db.js";

// all the functions in this file will directly interact with the database

// ✅ Create Store
export const createStore = async (data) => {
  const { name, email, address, ownerId } = data;

  // Ensure owner exists and is STORE_OWNER
  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner || owner.role !== "STORE_OWNER") {
    throw new Error("Invalid store owner");
  }

  const store = await prisma.store.create({
    data: { name, email, address, ownerId },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  return store;
};

// ✅ Get all stores
export const getAllStores = async () => {
  return await prisma.store.findMany({
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      ratings: {
        select: { value: true },
      },
    },
  });
};

// ✅ Get single store by id
export const getStoreById = async (id) => {
  return await prisma.store.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      ratings: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });
};

// ✅ Get stores by owner
export const getStoresByOwner = async (ownerId) => {
  return await prisma.store.findMany({
    where: { ownerId },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      ratings: {
        select: { value: true },
      },
    },
  });
};

// ✅ Update store
export const updateStore = async (id, data) => {
  const { name, email, address, ownerId } = data;

  // Check if store exists
  const existingStore = await prisma.store.findUnique({ where: { id } });
  if (!existingStore) {
    throw new Error("Store not found");
  }

  return await prisma.store.update({
    where: { id },
    data: {
      name,
      email,
      address,
      ...(ownerId && {
        owner: {
          connect: { id: ownerId },
        },
      }),
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// ✅ Add owner to store
export const addOwnerToStore = async (storeId, ownerId) => {
  // Ensure owner exists and is STORE_OWNER
  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner || owner.role !== "STORE_OWNER") {
    throw new Error("Invalid store owner");
  }

  // Check if store exists
  const existingStore = await prisma.store.findUnique({
    where: { id: storeId },
  });
  if (!existingStore) {
    throw new Error("Store not found");
  }

  return await prisma.store.update({
    where: { id: storeId },
    data: { ownerId },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// ✅ Delete store
export const deleteStore = async (id) => {
  // Check if store exists
  const existingStore = await prisma.store.findUnique({ where: { id } });
  if (!existingStore) {
    throw new Error("Store not found");
  }

  // Delete all ratings for this store first (due to foreign key constraints)
  await prisma.rating.deleteMany({
    where: { storeId: id },
  });

  // Then delete the store
  return await prisma.store.delete({
    where: { id },
  });
};

// ✅ Submit store rating (upsert - create or update)
export const submitRating = async (data) => {
  const { storeId, userId, rating } = data;

  // Validate rating value
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Check if store exists
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw new Error("Store not found");
  }

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  // Upsert rating (create or update if exists)
  return await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
    update: {
      value: rating,
    },
    create: {
      userId,
      storeId,
      value: rating,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      store: {
        select: { id: true, name: true },
      },
    },
  });
};

// ✅ Get all ratings for a store
export const getRatingsForStore = async (storeId) => {
  // Check if store exists
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw new Error("Store not found");
  }

  return await prisma.rating.findMany({
    where: { storeId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      store: { select: { id: true, name: true, email: true, address:true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ✅ Update store rating
export const updateRating = async (ratingId, userId, newRating) => {
  // Validate rating value
  if (newRating < 1 || newRating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Find the rating and check ownership
  const existingRating = await prisma.rating.findUnique({
    where: { id: ratingId },
  });

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
      user: {
        select: { id: true, name: true, email: true },
      },
      store: {
        select: { id: true, name: true },
      },
    },
  });
};

// ✅ Delete store rating
export const deleteRating = async (ratingId, userId) => {
  // Find the rating and check ownership
  const existingRating = await prisma.rating.findUnique({
    where: { id: ratingId },
  });

  if (!existingRating) {
    throw new Error("Rating not found");
  }

  if (existingRating.userId !== userId) {
    throw new Error("You can only delete your own ratings");
  }

  return await prisma.rating.delete({
    where: { id: ratingId },
  });
};

// ✅ Get average rating for a store
export const getAverageRating = async (storeId) => {
  // Check if store exists
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw new Error("Store not found");
  }

  const result = await prisma.rating.aggregate({
    where: { storeId },
    _avg: {
      value: true,
    },
    _count: {
      value: true,
    },
  });

  return {
    storeId,
    averageRating: result._avg.value || 0,
    totalRatings: result._count.value || 0,
  };
};
