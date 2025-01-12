"use server";

import { CartItem } from "@/types";
import { convertToPlainObject, formatErrors, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => {
        return acc + Number(item.price) * item.qty;
      }, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(itemsPrice * 0.15),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id;

    // Get cart
    const cart = await getMyCart();

    // Parse an validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });

      // Add to database
      await prisma.cart.create({ data: newCart });

      // Revalidate product page
      revalidatePath(`/products/${product.slug}`);

      return { success: true, message: `${product.name} added to cart` };
    } else {
      // Check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      // Check if item is already in cart
      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error(`${product.name} is out of stock`);
        }

        // Increase the quanity
        (cart.items as CartItem[]).find((x) => {
          if (x.productId === item.productId) {
            x.qty = x.qty + 1;
          }
        });
      } else {
        // If item does not exist, add it to cart
        // Check stock
        if (product.stock < 1)
          throw new Error(`${product.name} is out of stock`);

        // Add item to the cart.item
        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get Product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    // Check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item not found");

    // Check if only one in qty
    if (exist.qty === 1) {
      // Remove item
      (cart.items as CartItem[]).splice(
        (cart.items as CartItem[]).findIndex((x) => x.productId === productId),
        1
      );
    } else {
      // Decrease qty
      (cart.items as CartItem[]).find((x) => {
        if (x.productId === productId) {
          x.qty = x.qty - 1;
        }
      });
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/products/${product.slug}`);

    return { success: true, message: `${product.name} was removed from cart` };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}
