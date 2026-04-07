import { z } from "zod";

export const usZipSchema = z
  .string()
  .trim()
  .regex(/^\d{5}(-\d{4})?$/, "Enter a valid US ZIP code (e.g. 90210)");

export const emailSchema = z.string().trim().email("Enter a valid email address");
