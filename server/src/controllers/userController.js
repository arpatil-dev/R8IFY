import {
  updatePasswordService,
  getProfileService,
  deleteUserService,
  updateUserService,
  getUsersService,
  getUserByIdService
} from "../services/userService.js";
import { createUser as createUserService } from "../services/adminService.js";
import handleResponse from "../utils/response.js";

// Controller for updating password
export const updatePassword = async (req, res) => {
  try {
    console.log("=== UPDATE PASSWORD CONTROLLER STARTED ==="); // This should show if controller is hit
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    console.log("Request user:", req.user);
    console.log("Request Body:", req.user.id); // Debugging line
    const password = req.body.newPassword;
    if (!req) {
      throw new Error("Request object is undefined");
    }
    if (!password) {
      return handleResponse(
        res,
        null,
        "New password is required",
        400,
        "Validation Error"
      );
    }

    // Debug: Check authenticated user
    console.log("Authenticated User ID:", req.user.id);

    await updatePasswordService(req.user.id, password);

    return handleResponse(
      res,
      { message: "Password updated successfully" },
      "Password updated successfully",
      200,
      null
    );
  } catch (err) {
    return handleResponse(
      res,
      null,
      err.message || "Failed to update password",
      400,
      "Error"
    );
  }
};

// Controller for getting own profile info
export const getProfile = async (req, res) => {
  try {
    const profile = await getProfileService(req.user.id);
    return handleResponse(
      res,
      profile,
      "Profile retrieved successfully",
      200,
      null
    );
  } catch (err) {
    return handleResponse(
      res,
      null,
      err.message || "Profile not found",
      404,
      "Error"
    );
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await createUserService(req.body);
    return handleResponse(res, user, "User created successfully", 201, null);
  } catch (error) {
    return handleResponse(
      res,
      null,
      error.message || "Failed to create user",
      500,
      "Error"
    );
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();
    console.log("Users:", users); // Debugging line
    return handleResponse(res, users, "Success", 200, null);
  } catch (error) {
    return handleResponse(res, null, "Failed", 500, error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const updatedUser = await updateUserService(userId, updatedData);
    return handleResponse(
      res,
      updatedUser,
      "User updated successfully",
      200,
      null
    );
  } catch (err) {
    return handleResponse(
      res,
      null,
      err.message || "Failed to update user",
      400,
      "Error"
    );
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await deleteUserService(userId);
    return handleResponse(
      res,
      { message: "User deleted successfully" },
      "User deleted successfully",
      200,
      null
    );
  } catch (err) {
    return handleResponse(
      res,
      null,
      err.message || "Failed to delete user",
      400,
      "Error"
    );
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserByIdService(userId);
    return handleResponse(res, user, "User retrieved successfully", 200, null);
  } catch (error) {
    return handleResponse(
      res,
      null,
      error.message || "Failed to retrieve user",
      500,
      "Error"
    );
  }
};
