// Import express router
import { Router } from "express";
// Import controller methods
import {
  registerUser,
  loginUser,
  logOut,
} from "../controllers/user.controller.js";
// import multer middleware for upload
import { upload } from "../middlewares/multer.middleware.js";
// Import Auth middleware
import { verifyJWT } from "../middlewares/auth.middleware.js";

// Initialize router
const router = Router();

// User routes for register User
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
// Here our API Local URL will be : http://localhost:8000/api/v1/users/register

// User router for Login User
router.route("/login").post(loginUser);

// User Router for LogOut
router.route("/logOut").post(verifyJWT, logOut);

// Export router
export default router;
