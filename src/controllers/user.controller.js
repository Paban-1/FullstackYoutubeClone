// Import asyncHandler method
import { asyncHandler } from "../utils/asyncHandler.js";
// Import ApiError for error handling
import { ApiError } from "../utils/ApiError.js";
// Import ApiResponse for Response handling
import { ApiResponse } from "../utils/ApiResponse.js";
// Import User form User modle
import { User } from "../models/user.model.js";
// Import cloudinary method for img uploading
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Generate Refresh and Access Token Method
const generateAccessAndRefreshToken = async (userId) => {
  try {
    // Find the user via paramiter (DB call)
    const user = await User.findById(userId);

    // call AccessToken method and exicute
    const accessToken = user.genarateAccessToken();
    // Call RefreshToken method and exicute
    const refreshToken = user.genarateRefreshToken();

    // Save the token in User
    user.refreshToken = refreshToken;

    // Save the cahnges (DB Opration)
    await user.save({ validateBeforeSave: false });

    // return AccesToken and Refresh Token
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generate access and refresh token"
    );
  }
};

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

// Login User Controller
const loginUser = asyncHandler(async (req, res) => {
  // Get detiles from FrontEnd
  const { email, username, password } = req.body;

  // UserName or email based login
  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  // Find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User dose not exist");
  }

  // password check (DB call)
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Cradientianls");
  }

  // Genarate Access & RefreshToken
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Optional check
  const loggedInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );
  // Set The cookies Options for modifiable through Backend
  const options = {
    httpOnly: true,
    secure: true,
  };

  // return response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggedIn successfully"
      )
    );
});

// LogOut User controllers
const logOut = asyncHandler(async (req, res) => {
  // find User (DB opration)
  await User.findByIdAndUpdate(
    req.user._id,

    // undifined User refresh token
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  // set cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  // return response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// Export controller methods
export { registerUser, loginUser, logOut };
