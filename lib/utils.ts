import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError, ZodIssue } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatErrors(error: any) {
  // Handle Zod errors
  if (error instanceof ZodError) {
    const fieldErrors = Object.keys(error.errors).map(
      (field) => (error.errors[field] as ZodIssue).message
    );

    return fieldErrors.join(". ");
  }

  // Handle Prisma errors
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target ? String(error.meta?.target[0]) : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Handle other errors
  return typeof error.message === "string"
    ? error.message
    : JSON.stringify(error.message);
}
