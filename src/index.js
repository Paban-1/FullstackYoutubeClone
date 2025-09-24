// Import connectDB for database connection.
import connectDB from "./db/index.js";

//Import and configure dotenv to manage environment variables.
import dotenv from "dotenv"

// Configure dotenv to load environment variables from a specific file (./env).
dotenv.config({
    path: './env'
})


// Call connectDB to establish a connection to the database.
connectDB();
