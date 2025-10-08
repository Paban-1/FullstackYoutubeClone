// Import multer
import multer from "multer";

// Config Mullter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Export Multer middleware
export const upload = multer({
  storage,
});
