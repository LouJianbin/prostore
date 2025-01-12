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

// Round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }
  throw new Error("Value is not a number or string");
}

const CURRENCY_FORMAT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Format currency using the formatter above
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMAT.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMAT.format(Number(amount));
  } else {
    return "NaN";
  }
}
