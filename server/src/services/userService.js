import prisma from "../config/db.js";
import bcrypt from "bcryptjs";

// ✅ Update user password
export async function updatePasswordService(userId, newPassword) {
  // Validate inputs
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  if (!newPassword) {
    throw new Error("New password is required");
  }

  // Check if user exists first
  const existingUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  console.log("Updating password for user ID:", userId); // Debugging line
  
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return true;
}

// ✅ Get user profile
export async function getProfileService(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
}

// ✅ Update user by ID (Admin only)
export async function updateUserService(userId, updatedData) {
  // Prevent updating password here
  if (updatedData.password) {
    delete updatedData.password;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      address: true,
      createdAt: true,
    },
  });
  
  return user; // Added missing return statement
}

// ✅ Update user profile (for normal users - excludes role updates)
export async function updateProfileService(userId, profileData) {
  // Only allow updating specific fields, exclude role and password
  const allowedFields = {
    name: profileData.name,
    email: profileData.email,
    address: profileData.address
  };

  // Remove undefined fields
  Object.keys(allowedFields).forEach(key => 
    allowedFields[key] === undefined && delete allowedFields[key]
  );

  if (Object.keys(allowedFields).length === 0) {
    throw new Error("No valid fields to update");
  }

  // Check if email is being updated and if it's already taken
  if (allowedFields.email) {
    const existingUser = await prisma.user.findFirst({
      where: { 
        email: allowedFields.email,
        NOT: { id: userId }
      }
    });
    
    if (existingUser) {
      throw new Error("Email is already taken by another user");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: allowedFields,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });

  return updatedUser;
}

// ✅ Delete user by ID (Admin only)
export async function deleteUserService(userId) {
  await prisma.user.delete({
    where: { id: userId },
  });
  return true;
}

export async function getUsersService(){
  console.log("Fetching all users from the database..."); // Debugging line
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });

}


export const getUserByIdService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
