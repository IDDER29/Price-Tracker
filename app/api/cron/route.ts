import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    connectToDB();
    const products = await Product.find({});
    if (!products) {
      return {
        status: 404,
        message: "No products found",
      };
    }

    const updatedProducts = products.map(async (currentProduct) => {
      const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
      if (!scrapedProduct) {
        return {
          status: 404,
          message: "Product not found",
        };
      }

      const updatedPriceHistory = [
        ...currentProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      const product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };

      const updatedProduct = await Product.findOneAndUpdate(
        { url: scrapedProduct.url },
        product
      );

      // check each product's status and send emails if necessary
      const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

      if (emailNotifType && updatedProduct.users.length > 0) {
        const productInfo = {
          title: updatedProduct.title,
          url: updatedProduct.url,
        };
        // Construct emailContent
        const emailContent = await generateEmailBody(
          productInfo,
          emailNotifType
        );
        // Get array of user emails
        const userEmails = updatedProduct.users.map((user: any) => user.email);
        // Send email notification
        await sendEmail(emailContent, userEmails);
      }
      return updatedProduct;
    });
    return NextResponse.json({
      message: "ok",
      data: updatedProducts,
    });
  } catch (error) {}
}
