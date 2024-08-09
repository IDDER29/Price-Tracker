"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer/index";
import UserDb from "../models/user.model";

import bcrypt from "bcryptjs"; // Use bcryptjs instead of bcrypt

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });

    if (!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await Product.findById(productId);

    if (!product) return;

    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );

    if (!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");
      console.log("pass the first creat content");
      await sendEmail(emailContent, [userEmail]);
      console.log("pass tttt try");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }

  try {
    // Check if already connected to avoid multiple connections
    await connectToDB(); // Assuming this function is properly defined elsewhere
    // Hash the password before saving
    const isExist = await UserDb.findOne({ email });
    if (isExist) {
      return "Alert Invalid Request: User already exists";
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { name, email, password: hashedPassword };

    const user = new UserDb(newUser);

    console.log("pass the first creat content ", user);
    // Save user to the database
    const savedUser = await user.save();

    return "user created successfully";
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Please try again later.");
  }
}

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  try {
    // Check if already connected to avoid multiple connections
    await connectToDB(); // Assuming this function is properly defined elsewhere

    // Find the user by email
    const user = await UserDb.findOne({ email });
    if (!user) {
      return "Invalid email or password.";
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return "Invalid email or password.";
    }

    // If login is successful, return a success message (or a token if implementing JWT)
    return "Login successful";
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Failed to log in. Please try again later.");
  }
}
