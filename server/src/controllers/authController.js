import { registerUserService, loginUserService, findUserByEmail } from "../services/authServices.js";
import handleResponse from "../utils/response.js";
import jwt from "jsonwebtoken";

/**
 * Generate JWT token for user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || "1d" 
    }
  );
};

/**
 * Register a new user
 */
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name, address, role } = req.body;
    console.log(email, password, name, address, role);  
    // Validate required fields
    if (!email || !password || !name) {
      return handleResponse(res, null, "Email, password, and name are required", 400, "Validation Error");
    }
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return handleResponse(res, null, "User already exists with this email", 409, "Conflict");
    }
    
    // Register user
    const user = await registerUserService({ email, password, name, address, role });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    // Generate JWT token
    const token = generateToken(userWithoutPassword);
    
    return handleResponse(res, { user: userWithoutPassword, token }, "User registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // Validate required fields
    if (!email || !password) {
      return handleResponse(res, null, "Email and password are required", 400, "Validation Error");
    }
    
    // Login user
    const user = await loginUserService({ email, password });
    console.log(user);
    // Generate JWT token
    const token = generateToken(user);
    
    return handleResponse(res, { user, token }, "Login successful", 200);
  } catch (error) {
    if (error.message === "Invalid email or password") {
      return handleResponse(res, null, error.message, 401, "Authentication Error");
    }
    next(error);
  }
};

/**
 * Logout user (for future implementation)
 */
export const logoutUser = async (req, res, next) => {
  try {
    // Since JWT is stateless, logout is typically handled on the client side
    // by removing the token from storage
    return handleResponse(res, null, "Logout successful", 200);
  } catch (error) {
    next(error);
  }
};
