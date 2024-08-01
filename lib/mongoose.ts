import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI)
    return console.error("MONGODB_URI is not defined");

  if (isConnected) return console.log("=> using existing database connection");
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("mongodb connected");
  } catch (error) {
    console.error("Error while connecting to database", error);
    return process;
  }
};
