import type { Config } from "drizzle-kit";

export default {
  dialect: "mysql",
  schema: ["./drizzle/schema.ts"], // use the runtime drizzle/schema.ts the server imports
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
