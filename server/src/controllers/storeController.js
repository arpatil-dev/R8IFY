import handleResponse from "../utils/response.js";
import * as storeService from "../services/storeService.js";

// ✅ Create Store
export const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    
    // Validate required fields
    if (!name || !email || !address || !ownerId) {
      return handleResponse(res, null, "Name, email, address, and ownerId are required", 400, "Validation Error");
    }

    const store = await storeService.createStore({ name, email, address, ownerId });
    return handleResponse(res, store, "Store created successfully", 201, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to create store", 500, "Server Error");
  }
};

// ✅ Get All Stores
export const getAllStores = async (req, res) => {
  try {
    const stores = await storeService.getAllStores();
    return handleResponse(res, stores, "Stores retrieved successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to fetch stores", 500, "Server Error");
  }
};

// ✅ Get Store by Store ID
export const getStoreByStoreId = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    if (!storeId) {
      return handleResponse(res, null, "Store ID is required", 400, "Validation Error");
    }

    const store = await storeService.getStoreById(storeId);
    
    if (!store) {
      return handleResponse(res, null, "Store not found", 404, "Not Found");
    }

    return handleResponse(res, store, "Store retrieved successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to fetch store", 500, "Server Error");
  }
};

// ✅ Get Stores by Owner
export const getStoresByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    if (!ownerId) {
      return handleResponse(res, null, "Owner ID is required", 400, "Validation Error");
    }

    const stores = await storeService.getStoresByOwner(ownerId);
    console.log("Stores for owner:", stores); // Debugging line
    return handleResponse(res, stores, "Owner's stores retrieved successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to fetch owner's stores", 500, "Server Error");
  }
};

// ✅ Update Store
export const updateStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { name, email, address, ownerId } = req.body;

    if (!storeId) {
      return handleResponse(res, null, "Store ID is required", 400, "Validation Error");
    }

    const updatedStore = await storeService.updateStore(storeId, { name, email, address ,ownerId});
    return handleResponse(res, updatedStore, "Store updated successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to update store", 500, "Server Error");
  }
};

// ✅ Delete Store
export const deleteStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return handleResponse(res, null, "Store ID is required", 400, "Validation Error");
    }

    await storeService.deleteStore(storeId);
    return handleResponse(res, { message: "Store deleted successfully" }, "Store deleted successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to delete store", 500, "Server Error");
  }
};

// ✅ Submit Rating for Store
export const submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!storeId) {
      return handleResponse(res, null, "Store ID is required", 400, "Validation Error");
    }

    if (!rating || rating < 1 || rating > 5) {
      return handleResponse(res, null, "Rating must be between 1 and 5", 400, "Validation Error");
    }

    const submittedRating = await storeService.submitRating({ storeId, userId, rating });
    return handleResponse(res, submittedRating, "Rating submitted successfully", 201, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to submit rating", 500, "Server Error");
  }
};

// ✅ Get Ratings for Store
export const getRatingsForStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return handleResponse(res, null, "Store ID is required", 400, "Validation Error");
    }

    const ratings = await storeService.getRatingsForStore(storeId);
    return handleResponse(res, ratings, "Store ratings retrieved successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to fetch store ratings", 500, "Server Error");
  }
};

// ✅ Update Rating
export const updateRating = async (req, res) => {
  try {
    const { storeId, ratingId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!storeId || !ratingId) {
      return handleResponse(res, null, "Store ID and Rating ID are required", 400, "Validation Error");
    }

    if (!rating || rating < 1 || rating > 5) {
      return handleResponse(res, null, "Rating must be between 1 and 5", 400, "Validation Error");
    }

    const updatedRating = await storeService.updateRating(ratingId, userId, rating);
    return handleResponse(res, updatedRating, "Rating updated successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to update rating", 500, "Server Error");
  }
};

// ✅ Delete Rating
export const deleteRating = async (req, res) => {
  try {
    const { storeId, ratingId } = req.params;
    const userId = req.user.id; // From auth middleware

    if (!storeId || !ratingId) {
      return handleResponse(res, null, "Store ID and Rating ID are required", 400, "Validation Error");
    }

    await storeService.deleteRating(ratingId, userId);
    return handleResponse(res, { message: "Rating deleted successfully" }, "Rating deleted successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to delete rating", 500, "Server Error");
  }
};

// ✅ Get Average Rating for Store
export const getAverageRating = async (req, res) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return handleResponse(res, null, "Store ID is required", 400, "Validation Error");
    }

    const averageRating = await storeService.getAverageRating(storeId);
    return handleResponse(res, averageRating, "Average rating retrieved successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to fetch average rating", 500, "Server Error");
  }
};

// ✅ Add Owner to Store (bonus function)
export const addOwnerToStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { ownerId } = req.body;

    if (!storeId || !ownerId) {
      return handleResponse(res, null, "Store ID and Owner ID are required", 400, "Validation Error");
    }

    const updatedStore = await storeService.addOwnerToStore(storeId, ownerId);
    return handleResponse(res, updatedStore, "Owner assigned to store successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to assign owner to store", 500, "Server Error");
  }
};

