import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

export const envServer = createEnv({
  server: {
    AUTH0_SECRET: z.string(),
    APP_BASE_URL: z.string(),
    AUTH0_DOMAIN: z.string(),
    AUTH0_CLIENT_ID: z.string(),
    AUTH0_CLIENT_SECRET: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development")
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
});
