// import v2 from cloudinary
import { v2 as cloudinary } from "cloudinary";

// Import fs for file unlink
import fs from "fs";

// Config cloudinary with nassery keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Make a File upload method
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Check if localFilePath true
    if (!localFilePath) return null;
    // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      // Define what kind of file will uploaded
      resource_type: "auto",
    });
    // File has been uploaded successsfull
    console.log("File is uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    // Remove the loally saved temporary file as the upload opretation get failed
    fs.unlinkSync(localFilePath);
    // return if upload fails
    return null;
  }
};

// Export The method
export { uploadOnCloudinary };
