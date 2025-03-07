// import type { Config } from "drizzle-kit";
/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./config/schema.js",
    dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
    dbCredentials: {
      url: "postgresql://ai-video_owner:WOce46GIplQu@ep-red-silence-a17y57r5.ap-southeast-1.aws.neon.tech/aivideocreate?sslmode=require"
    }
  };