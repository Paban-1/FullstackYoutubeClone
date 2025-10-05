// import asyncHandler method
import { asyncHandler } from "../utils/asyncHandler.js";

// Register user controller
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    massege: "OK",
  });
});


// Export controller methods
export { registerUser };
