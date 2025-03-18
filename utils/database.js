import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("Mongo is already connected");
    return;
  }

  try {
    await mongoose.connect("mongodb://localhost:27017/NextLogin");
    isConnected = true;
    console.log("connected to MongoDB");
  } catch (e) {
    console.log(e);
  }
};

export const disconnectFromDB = async () => {
  if (!isConnected) {
    console.log("MongoDB is not connected");
    return;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};
