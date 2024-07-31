"use server";

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string) {
  // Scrape the product page
  if (!productUrl) return;

  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
  } catch (error: any) {
    throw new Error(`Failed to create or update product: ${error.message}`);
  }

  return "Product details";
}
