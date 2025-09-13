import * as adminService from "../services/adminService.js";
import handleResponse from "../utils/response.js" // your helper for uniform responses

// Create User
export const createUser = async (req, res) => {
  try {
    const user = await adminService.createUser(req.body);
    return handleResponse(res, user,"Success", 201, null);
  } catch (error) {
    return handleResponse(res, null,"Failed" ,500, error.message);
  }
};

// Create Store
export const createStore = async (req, res) => {
  try {
    const store = await adminService.createStore(req.body);
    return handleResponse(res, store, "Success", 201, null);
  } catch (error) {
    return handleResponse(res, null, "Failed", 500, error.message);
  }
};

// Get Users
export const getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers();
    return handleResponse(res, users, "Success", 200, null);
  } catch (error) {
    return handleResponse(res, null, "Failed", 500, error.message);
  }
};

// Get Stores
export const getStores = async (req, res) => {
  try {
    const stores = await adminService.getStores();
    return handleResponse(res, stores, "Success", 200, null);
  } catch (error) {
    return handleResponse(res, null, "Failed", 500, error.message);
  }
};

// Get Platform Stats
export const getStats = async (req, res) => {
  try {
    const stats = await adminService.getStats();
    return handleResponse(res, stats, "Success", 200, null);
  } catch (error) {
    return handleResponse(res, null, "Failed", 500, error.message);
  }
};
