import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    forgotPasswordToken: { type: String, default: "" },
    forgotPasswordTokenExpiry: { type: Date, default: Date.now() },
    verifyToken: { type: String, default: "" },
    verifyTokenExpiry: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
