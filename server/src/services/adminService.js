import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
// Create User
export const createUser = async (data) => {
  const { name, email, address, role } = data;
  const hashedPassword = await bcrypt.hash("changeme", 12);
  console.log(data);
  if (!["NORMAL_USER", "STORE_OWNER", "SYSTEM_ADMINISTRATOR"].includes(role)) {
    throw new Error("Invalid role");
  }

  return prisma.user.create({
    data: { name, email, password:hashedPassword, address, role ,isFirstLogin: true,},
  });
};

// Create Store
export const createStore = async (data) => {
  const { name, email, address, ownerId } = data;

  // Ensure owner exists and is STORE_OWNER
  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner || owner.role !== "STORE_OWNER") {
    throw new Error("Invalid store owner");
  }

  return prisma.store.create({
    data: { name, email, address, ownerId },
  });
};

// Get all Users
export const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      address: true,
      createdAt: true,
    },
  });
};

// Get all Stores
export const getStores = async () => {
  return prisma.store.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      email: true,
      owner: { select: { id: true, name: true, email: true } },
      ratings: true,
    },
  });
};  

// Get Stats (counts of users, stores, ratings)
export const getStats = async () => {
  const usersCount = await prisma.user.count();
  const storesCount = await prisma.store.count();
  const ratingsCount = await prisma.rating.count();

  return { usersCount, storesCount, ratingsCount };
};
