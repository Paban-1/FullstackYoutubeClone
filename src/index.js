// Import connectDB for database connection.
import connectDB from "./db/index.js";

// Import app for express power
import { app } from "./app.js";

//Import and configure dotenv to manage environment variables.
import dotenv from "dotenv";

// Configure dotenv to load environment variables from a specific file (./env).
dotenv.config({
  path: "./.env",
});

// Call connectDB to establish a connection to the database.
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("Mongo DB connection faild !!!", error);
  });
