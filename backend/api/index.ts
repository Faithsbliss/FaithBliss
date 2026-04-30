import app, { connectDB } from "../src/app";

let dbReady: Promise<void> | null = null;

app.use(async (_req, _res, next) => {
  if (!dbReady) {
    dbReady = connectDB();
  }
  try {
    await dbReady;
  } catch (err) {
    console.error("DB init error:", err);
  }
  next();
});

export default app;
