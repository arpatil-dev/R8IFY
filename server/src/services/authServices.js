import prisma from "../config/db.js";
import bcrypt from "bcryptjs";

/**
 * Registers a new user in the database.
 * @param {Object} userData - { email, password, name }
 * @returns {Promise<Object>} Created user object
 */
export const registerUserService = async (userData) => {
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  console.log(hashedPassword);  
  return await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      address: userData.address,
      role: userData.role || "NORMAL_USER",
      isFirstLogin: false,
    },
  });
};

/**
 * Finds a user by email for login.
 * @param {string} email
 * @returns {Promise<Object|null>} User object or null
 */
export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Validates user login credentials
 * @param {Object} loginData - { email, password }
 * @returns {Promise<Object>} User object if valid
 */
export const loginUserService = async (loginData) => {
  const { email, password } = loginData;
  
  // Find user by email
  const user = await findUserByEmail(email);
  console.log(user);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
