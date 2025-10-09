// import asyncHandler method
import { asyncHandler } from "../utils/asyncHandler.js";

// Import ApiError for error handling
import { ApiError } from "../utils/ApiError.js";

// Import ApiResponse for Response handling
import { ApiResponse } from "../utils/ApiResponse.js";

// Import User form User modle
import { User } from "../models/user.model.js";

// Import cloudinary method for img uploading
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Register user controller
const registerUser = asyncHandler(async (req, res) => {
  // Get user detials from frontEnd
  const { fullname, email, username, password } = req.body;
  console.log(email);

  // validate user details -> not empty
  if (
    [fullname, email, username, password].some((fild) => fild?.trim() === "")
  ) {
    throw new ApiError(400, "All filds are required");
  }

  // check if user already exists (check via email and usename)
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(
      409,
      "User with this email or UserName is already exists"
    );
  }

  // check for img (must for avatar)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImgLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required");
  }

  // upload on clodinary (check for avatar)
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImgLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar is required");
  }

  // create user object -> create enter in db
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
  });

  // remove password and refresh token fild form response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // ckeck for user creation
  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong while creating User");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered sucesfullys"));
});

// Export controller methods
export { registerUser };
