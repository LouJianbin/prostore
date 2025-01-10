"use server";

import { CartItem } from "@/types";

export async function addItemToCart(data: CartItem) {
  // Add product to cart
  return { success: true, meassge: "Item added to cart" };
}
