// Import express router
import { Router } from "express";
// Import controller methods
import { registerUser } from "../controllers/user.controller.js";
// import multer middleware for upload
import { upload } from "../middlewares/multer.middleware.js";

// Initialize router
const router = Router();

// User routes
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

// Export router
export default router;
