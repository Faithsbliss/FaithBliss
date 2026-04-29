import app, { connectDB } from "../src/app";

connectDB().catch((error) => {
  console.error("Database connection error in Vercel function:", error);
});

export default app;
