// Import AsyncHandler
import { asyncHandler } from "../utils/asyncHandler.js";
// Import ApiError for Error handaling
import { ApiError } from "../utils/ApiError.js";
// Import User form User model
import { User } from "../models/user.model.js";
// Import JWT
import jwt from "jsonwebtoken";

// Authantication Middelware
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get access of cookies (for mobile apps as well) s
    const token =
      req.cookies?.accessToken ||
      req.header("Authurization")?.replace("Bearer ", "");

    // Verify for the cookies
    if (!token) {
      throw new ApiError(401, "Unauthoriced request");
    }

    // decode the cokies
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Remove password and refresh Token (DB Opration)
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid AccessToken");
    }

    // Add a new Object in user
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error ||"Invalid AccessToken")
  }
});
