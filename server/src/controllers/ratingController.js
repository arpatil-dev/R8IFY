import handleResponse from "../utils/response.js";
import * as ratingService from "../services/ratingService.js";

// ✅ Update a rating
export const updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!ratingId) {
      return handleResponse(res, null, "Rating ID is required", 400, "Validation Error");
    }

    if (!rating || rating < 1 || rating > 5) {
      return handleResponse(res, null, "Rating must be between 1 and 5", 400, "Validation Error");
    }

    const updatedRating = await ratingService.updateRating(ratingId, userId, rating);
    return handleResponse(res, updatedRating, "Rating updated successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to update rating", 500, "Server Error");
  }
};

// ✅ Delete a rating
export const deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user.id; // From auth middleware

    if (!ratingId) {
      return handleResponse(res, null, "Rating ID is required", 400, "Validation Error");
    }

    await ratingService.deleteRating(ratingId, userId);
    return handleResponse(res, { message: "Rating deleted successfully" }, "Rating deleted successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to delete rating", 500, "Server Error");
  }
};

// ✅ Get all ratings submitted by a user
export const getRatingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return handleResponse(res, null, "User ID is required", 400, "Validation Error");
    }

    const ratings = await ratingService.getRatingsByUser(userId);
    return handleResponse(res, ratings, "User ratings retrieved successfully", 200, null);
  } catch (error) {
    return handleResponse(res, null, error.message || "Failed to fetch user ratings", 500, "Server Error");
  }
};
