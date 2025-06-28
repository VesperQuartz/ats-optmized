import { z } from "zod/v4";

const envSchema = z.object({
  baseUrl: z.string(),
});

export const env = envSchema.parse({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
});
