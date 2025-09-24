// Import mongoose laibary for mongoDB connection.
import mongoose from "mongoose";

//Import DB_NAME constant  (database name).
import { DB_NAME } from "../constants.js";

/**
 * Establishes a connection to MongoDB using mongoose.
 * Use environment variable MONGODB_URI as the base connection string.
 */
const connectDB = async () => {
  //Wrap in try catch
  try {
    // Attempt to connect to MongoDB
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    // Log sucess message with DB host and name
    console.log(
      `\n✅ MongoDb connected successfully !!
      HOST: ${connectionInstance.connection.host}
      DB NAME: ${DB_NAME}
      `
    );
  } catch (error) {
    // Log error message and exit process if connection fails
    console.log("\n ❌ MongoDB Connection fails :", error);
    process.exit(1); // Exit with failure
  }
};

// Export for Exicute in index.js
export default connectDB;
