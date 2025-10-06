// Description: User model with JWT authentication and password hashing
import mongoose, { Schema } from "mongoose";

// Importing jsonwebtoken and bcrypt for JWT and password hashing
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Defining the User schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary URL
      required: true,
    },
    coverImg: {
      type: String, // Cloudinary URL
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Password incrption
UserSchema.pre("save", async function (next) {
  // If the filed password is not modified then go to next or if modified then do password incript.
  if (!this.isModified("password")) return next();

  // Incrpt the password useing bcrypt and hash the password using .hash.
  this.password = bcrypt.hash(this.password, 10);
  next();
});

// custom methods for check password is correct or not?
UserSchema.methods.isPasswordCorrect = async function (password) {
  // bcrypt can also check password so ask for check
  return await bcrypt.compare(password, this.password); // This will return true or false.
};

// method for genarateAccessToken useing same methods with UserSchema.
UserSchema.methods.genarateAccessToken = function () {
  // To genarate Token use Jwt sign method and give the method payload.
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// method for genarateRefreshToken useing same methods with UserSchema.
UserSchema.methods.genarateRefreshToken = function () {
  // To genarate Token use Jwt sign method and give the method payload.
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY_SECRET,
    }
  );
};

export const User = mongoose.model("User", UserSchema);
